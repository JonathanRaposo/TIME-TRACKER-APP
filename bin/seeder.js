const path = require('path');
const DB_FILEPATH = path.join(__dirname, '..', 'db', 'employees.json');
const { DBService, connectDB } = require('../DBservice/index.js')
const db = connectDB(DB_FILEPATH);
const dbService = new DBService(db);
const data = [

    {

        "firstName": "John",
        "lastName": "Doe",
        "email": "john@gmail.com",
        "password": "John123",


    },
    {

        "firstName": "Anne",
        "lastName": "Smith",
        "email": "anne@gmail.com",
        "password": "Anne123",

    },
    {

        "firstName": "Peter",
        "lastName": "Gabriel",
        "email": "peter@gmail.com",
        "password": "Peter123",


    }


]

dbService
    .create(data)
    .then((data) => console.log(data.length + ' employees inserted.'))
    .catch((err) => console.log('Error '))

