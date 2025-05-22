require('dotenv').config({ path: '../.env' });
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const DB_FILEPATH = path.join(__dirname, '..', 'db', 'employees.json');


const adminUser = {
    id: 'admin001',
    email: process.env.ADMIN_EMAIL,
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt),
    role: "admin",
    createdAt: new Date().toISOString()

}

const dir = path.dirname(DB_FILEPATH);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}
let users = {}

if (fs.existsSync(DB_FILEPATH)) {
    users = JSON.parse(fs.readFileSync(DB_FILEPATH, 'utf8'));

}
users.push(adminUser)
fs.writeFileSync(DB_FILEPATH, JSON.stringify(users, null, 2), 'utf8');
console.log('adding admin user')



