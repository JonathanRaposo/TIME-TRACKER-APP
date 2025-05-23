
const path = require('path');
const router = require('express').Router();
const hash = require('../../utils/hash.js');
const { DBService, connectDB } = require('../../DBservice/index.js');
const { compare } = require('bcryptjs');
const DB_FILEPATH = path.join(__dirname, '..', '..', 'db', 'employees.json');
const db = connectDB(DB_FILEPATH);
const dbService = new DBService(db);
const jwt = require('jsonwebtoken');


const { isLoggedOut } = require('../../middleware/route-guard.js');

router.get('/signup', (req, res) => {
    res.render('auth/signup.hbs', { layout: false });
});

router.post('/signup', async function (req, res, next) {

    const { firstName, lastName, email, password } = req.body;

    // MAKE SURE ALL FIELDS ARE PROVIDED
    if (!firstName || !lastName || !email || !password) {
        res.status(400).render('auth/signup.hbs', { errorMessage: 'All fields must be provided.', layout: false });
        return;
    }

    // CHECK IF EMAIL HAS VALID FORMAT

    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email_regex.test(email)) {
        res.status(400).render('auth/signup.hbs', { errorMessage: 'Provide a valid email address', layout: false });
        return;
    }
    // PASSWORD VALIDATION
    const pass_regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!pass_regex.test(password)) {
        res.status(400).render('auth/signup.hbs', { errorMessage: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.', layout: false });
        return;
    }

    try {

        const employee = await dbService.findOne({ email: email })
        if (employee) {
            return res.status(404).render('auth/signup.hbs', { errorMessage: 'Email is already registered. Try other one.', layout: false })
        }

        const newUser = { firstName, lastName, email, password: hash(password, { saltRounds: 12 }) };
        const user = await dbService.create(newUser);
        return res.redirect(`/admin/manage`)

    } catch (err) {
        console.log('error:', err)
        res.status(500).render('auth/signup.hbs', { errorMessage: 'Something went wrong. Try again.', layout: false });

    }


});

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login.hbs');
})

router.post('/login', isLoggedOut, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('auth/login.hbs', { errorMessage: 'Enter both email and password.' });
    }

    try {
        const user = await dbService.findOne({ email: email });

        if (!user) {
            return res.render('auth/login.hbs', { errorMessage: 'Email not registered. Try again.' });
        }
        const isPasswordValid = hash(password, { compare: true, passwordFromDB: user.password });
        if (!isPasswordValid) {
            return res.render('auth/login.hbs', { errorMessage: 'Incorrect password.' });
        }

        const { id, firstName, lastName, role } = user;
        const payload = { id, firstName, lastName, role };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        res.cookie('authToken', authToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.cookie('theme', 'dark');

        if (user.role === 'employee') {
            res.redirect('/employee/profile')
            return;
        }
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard')
            return;
        }
    } catch (err) {
        console.log(err)
    }

});

module.exports = router;