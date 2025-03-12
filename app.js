const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { register, login, verifyToken } = require('./src/auth');
const { getChats, generateQRCode, getContacts } = require('./src/whatsapp');
const { connectToDatabase, createAnnotation, listAnnotations, getAnnotationByMessageID } = require('./src/annotations');

const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas as rotas
app.use(bodyParser.json()); // Parse JSON bodies

// Conectar ao banco de dados MongoDB
connectToDatabase();

// Rotas de autenticação
app.post('/register', register);
app.post('/login', login);

// Endpoint para listar chats, protegido por JWT
app.get('/chats', verifyToken, async (req, res) => {
    try {
        const chats = await getChats();
        res.json(chats);
    } catch (error) {
        res.status(500).send('Error retrieving chats');
    }
});

// Endpoint para gerar QR Code
app.get('/generate-qrcode', verifyToken, async (req, res) => {
    try {
        const qrCode = await generateQRCode();
        res.send(qrCode);
    } catch (error) {
        res.status(500).send('Error generating QR Code');
    }
});

// Endpoint para listar contatos, protegido por JWT
app.get('/contacts', verifyToken, async (req, res) => {
    try {
        const contacts = await getContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).send('Error retrieving contacts');
    }
});

// Endpoint para criar uma anotação
app.post('/annotations', verifyToken, async (req, res) => {
        try {
        await createAnnotation(req.body);
        res.status(201).send('Annotation created successfully');
    } catch (error) {
        res.status(500).send('Error creating annotation');
    }
});

// Endpoint para listar anotações
app.get('/annotations', verifyToken, async (req, res) => {
    try {
        const annotations = await listAnnotations();
        res.json(annotations);
    } catch (error) {
        res.status(500).send('Error retrieving annotations');
    }
});

// Endpoint para obter uma anotação por messageID
app.get('/annotations/:messageID', verifyToken, async (req, res) => {
    const { messageID } = req.params;
    try {
        const annotation = await getAnnotationByMessageID(messageID);
        if (!annotation) {
            return res.status(404).send('Annotation not found');
        }
        res.json(annotation);
    } catch (error) {
        res.status(500).send('Error retrieving annotation');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});