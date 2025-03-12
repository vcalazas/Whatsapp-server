const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

async function getChats() {
    try {
        const chats = await client.getChats();
        return chats;
    } catch (error) {
        throw new Error('Error retrieving chats');
    }
}

function generateQRCode() {
    return new Promise((resolve, reject) => {
        client.on('qr', (qr) => {
            qrcode.generate(qr, {small: true});
            resolve(qr);
        });
    });
}

async function getContacts() {
    try {
        const contacts = await client.getContacts();
        return contacts;
    } catch (error) {
        throw new Error('Error retrieving contacts');
    }
}

module.exports = { getChats, generateQRCode, getContacts };