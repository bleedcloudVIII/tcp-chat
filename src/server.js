const net = require('net');

const srv = net.createServer();

let clients = [];
srv.on('connection', (client) => {
    const host = client.remoteAddress;
    const port = client.remotePort;

    client.name = host + ':' + port;
    clients.push(client);

    console.log(clients.name + ' connected');
    // client.write('Hi, ' + client.name + '\n');
    
    client.on('data', (data) => {
        broadcast(data, client);
    });

    client.on('end', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(client.name + ' quit');
    });

    client.on('error', (error) => {
        console.log(error );
    });
});
function broadcast(data, client) {
    let cleanup = [];
    for(let i=0; i<clients.length; i++) {
        if(client !== clients[i]) {
            if(clients[i].writable) {
                clients[i].write(client.name + ' : ' + data);
            }
            else {
                cleanup.push(clients[i]);
                clients[i].destroy();
            }
        }
    }

    for(let i=0; i<cleanup.length; i++) {
        clients.splice(clients.indexOf(cleanup[i]), 1);
    }
}

srv.listen(5003);