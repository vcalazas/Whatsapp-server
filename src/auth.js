require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = [{
    "username": "test",
    "password": bcrypt.hashSync(process.env.DEFAULT_USER_PASSWORD, 8)
}]; // Array para armazenar usuários (apenas para exemplo)

const secretKey = process.env.SECRET_KEY; // Carrega a chave secreta do arquivo .env

// Função para registrar um novo usuário
function register(req, res) {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered successfully');
}

// Função para autenticar um usuário
function login(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).send('User not found');
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send('Invalid password');
    }
    const token = jwt.sign({ id: user.username }, secretKey, { expiresIn: 86400 }); // 24 horas
    res.status(200).send({ auth: true, token });
}

// Middleware para verificar o token JWT
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('No token provided');
    }
    jwt.verify(`${token}`.replaceAll("Bearer ", ""), secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token');
        }
        req.userId = decoded.id;
        next();
    });
}

module.exports = { register, login, verifyToken };