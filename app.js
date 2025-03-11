const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.getChats().then((list)=> {
        list.forEach(element => {
            if(element.id.user === ""){
                // element.sendMessage("Olá");
                console.log(JSON.stringify(element.lastMessage));
            }
        });
    })
});

client.on('message', msg => {
    console.log(msg);
    // if (msg.body == '!ping') {
    //     msg.reply('pong');
    // } else {
    //     msg.reply('Desconheço');
    // }
});

client.initialize();