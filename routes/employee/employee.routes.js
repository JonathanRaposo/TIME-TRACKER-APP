const path = require('path');
const express = require('express');
const router = express.Router();
const { DBService, connectDB } = require('../../DBservice/index.js');
const DB_FILEPATH = path.join(__dirname, '..', '..', 'db', 'employees.json');
const db = connectDB(DB_FILEPATH)
const DbService = new DBService(db)


const isAuthenticated = require('../../middleware/isAuthenticated.js')

router.get('/employee/profile', isAuthenticated, function (req, res) {
    res.render('employee/profile.hbs', { user: req.payload, layout: false })
});

router.get('/employee/hours', isAuthenticated, async function (req, res) {
    const { id } = req.payload;
    try {
        const user = await DbService.findById(id);
        res.render('employee/hoursPage.hbs', { user: user, layout: false })

    } catch (err) {
        console.log(err)
    }

})

router.post('/employee/logout', function (req, res) {
    console.log('hit log out route')
    res.clearCookie('authToken');
    res.clearCookie('theme');
    res.redirect('/')
})

module.exports = router;