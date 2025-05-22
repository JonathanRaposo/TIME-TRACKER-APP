const path = require('path');
const express = require('express');
const router = express.Router();
const hash = require('../../utils/hash.js');
const { DBService, connectDB } = require('../../DBservice/index.js');
const DB_FILEPATH = path.join(__dirname, '..', '..', 'db', 'employees.json');
const db = connectDB(DB_FILEPATH)
const dbService = new DBService(db);
const { MemoryStorage, connect } = require('../../sessions/memoryStorage.js')
const WORK_SESSION_PATH = path.join(__dirname, '..', '..', 'sessions', 'workSessions.json')
const WORK_SESSION_DB = connect(WORK_SESSION_PATH);
const sessions = new MemoryStorage(WORK_SESSION_DB);;

const updateEmployeePay = require('../../utils/updateEmployeePay.js');


//CLOCK IN ROUTE
router.get('/employee/clockin', async function (req, res) {
    res.render('employee/clockin.hbs');
})

router.post('/employee/clockin', async function (req, res) {
    console.log(req.body)
    const { id, password } = req.body;
    if (!id || !password) {
        return res.status(404).render('employee/clockin.hbs', { errorMessage: 'Employee id and password must be provided' });
    }

    try {

        const employee = await dbService.findById(id);
        if (!employee) {
            return res.status(404).render('employee/clockin.hbs', { errorMessage: `'No employee found with id ${employee.id}.Try again.` });
        }
        const isPasswordValid = hash(password, { compare: true, passwordFromDB: employee.password });
        if (!isPasswordValid) {
            return res.status(401).render('employee/clockin.hbs', { errorMessage: 'Incorrect password.' })
        }
        const workSession = await sessions.getWorkSession(id)
        console.log('current session:', workSession)
        if (!workSession) {
            const newSession = await sessions.createWorkSession(employee);
            console.log('new session', newSession);
            return res.redirect('/');

        }
        return res.status(404).render('employee/clockin.hbs', { errorMessage: "You're already clocked in." })
    } catch (err) {
        console.log(err)
        return res.status(500).render('employee/clockin.hbs', { errorMessage: 'Internal server error.' });
    }
})

// CLOCK OUT ROUTE

router.get('/employee/clockout', async function (req, res) {
    res.render('employee/clockout.hbs');
})
router.post('/employee/clockout', async function (req, res) {
    console.log(req.body);
    const { id } = req.body;

    try {
        console.log('Employee id:', id)
        const workSession = await sessions.getWorkSession(id);
        if (!workSession) {
            return res.status(404).render('employee/clockout.hbs', { errorMessage: "You're not clocked in." })

        }
        console.log('current work session:', workSession)

        const employee = await dbService.findById(id);
        console.log('employee:', employee)

        const updatedData = await updateEmployeePay(employee, workSession);
        const updatedEmployee = await dbService.updateById(id, updatedData);
        console.log("updated employee pay:", updatedData);

        console.log('final result:', updatedEmployee);
        if (updateEmployeePay) {
            console.log('success deleting work session')
            sessions.deleteWorkSession(id);
            res.status(200).redirect('/');
            return;
        }
        return res.status(500).render('employee/clockout.hbs', { errorMessage: 'Something went wrong.' })



    } catch (err) {
        console.log(err)
        return res.status(500).render('employee/clockout.hbs', { errorMessage: 'Internal server error.' })
    }

})




module.exports = router;