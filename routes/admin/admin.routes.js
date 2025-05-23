const path = require('path');
const express = require('express');
const router = express.Router();
const { MemoryStorage, connect } = require('../../sessions/memoryStorage.js');
const WORK_SESSION_PATH = path.join(__dirname, '..', '..', 'sessions', 'workSessions.json')
const WORK_SESSION_DB = connect(WORK_SESSION_PATH);
const sessions = new MemoryStorage(WORK_SESSION_DB)

const { DBService, connectDB } = require('../../DBservice/index.js');
const DB_FILEPATH = path.join(__dirname, '..', '..', 'db', 'employees.json');
const db = connectDB(DB_FILEPATH);
const dbService = new DBService(db);
const hash = require('../../utils/hash.js');

const isAdmin = require('../../middleware/isAdmin.js');

router.get('/admin/dashboard', isAdmin, function (req, res) {
    res.render('admin/dashboard.hbs', { user: req.payload, layout: false })
})

router.get('/admin/manage', function (req, res) {

    res.render('admin/manage.hbs', { layout: false })
})
router.get('/admin/manage/employee', async function (req, res) {

    const { id } = req.query;
    try {
        const result = await dbService.find({ id: id })
        res.render('admin/manage.hbs', { layout: false, users: result });
    } catch (err) {
        console.log(err)
    }
})


router.get('/admin/employees/search', isAdmin, async function (req, res) {

    const { employeeId, lastName, email } = req.query;

    let result = null;
    try {
        if (employeeId) {
            result = await dbService.find({ id: employeeId });

            if (result) {
                res.render('admin/manage.hbs', { layout: false, users: result });
                return;
            }
            return res.render('admin/manage.hbs', { layout: false, resultMessage: '0 results.' })

        } else if (lastName) {
            result = await dbService.find({ lastName: lastName });
            if (result) {
                res.render('admin/manage.hbs', { layout: false, users: result });
                return;
            }
            return res.render('admin/manage.hbs', { layout: false, resultMessage: '0 results.' })
        } else if (email) {
            result = await dbService.find({ email: email });
            if (result) {
                res.render('admin/manage.hbs', { layout: false, users: result });
                return;
            }
            return res.render('admin/manage.hbs', { layout: false, resultMessage: '0 results.' })
        }


    } catch (err) {
        console.log(err);
    }
})
router.get('/admin/employees/clockedin', async function (req, res) {

    try {
        const allEmployees = await dbService.find();
        const onlineSessions = await sessions.getClockedInEmployees();
        const onlineIds = Object.keys(onlineSessions);

        const onlineEmployees = [];
        const offlineEmployees = [];

        allEmployees
            .forEach(function (employee) {
                if (onlineIds.includes(employee.id)) {
                    onlineEmployees.push(employee);
                } else {
                    offlineEmployees.push(employee)
                }

            })

        res.render('admin/clockedin-employees', { online: onlineEmployees, offline: offlineEmployees, layout: false })



    } catch (err) {
        console.log(err)
    }
})


router.get('/admin/employees', isAdmin, async function (req, res) {

    try {
        const employees = await dbService.find();
        res.render('admin/employee-list.hbs', { users: employees, layout: false })
    } catch (err) {
        console.log(err)
    }

})

router.get('/admin/employees/:id', async function (req, res) {

    const { id } = req.params;
    try {
        const employee = await dbService.findById(id);
        console.log('found employee:', employee)
        const onlineSessions = await sessions.getClockedInEmployees();
        let online = false;
        Object.keys(onlineSessions)
            .forEach(function (id) {
                if (id === employee.id) {
                    online = true;
                }
            })

        const hireDate = new Date(employee?.createdAt).getFullYear()
        const data = Object.assign({}, employee, { hireDate: hireDate });
        res.render('admin/employee-details', { user: data, status: online, layout: false })

    } catch (err) {
        console.log(err)
    }
})
router.get('/admin/employees/:id/edit', async function (req, res) {
    const { id } = req.params;

    try {
        const employee = await dbService.findById(id);
        return res.render('admin/employee-edit.hbs', { user: employee, layout: false })
    } catch (err) {
        console.log(err)
    }


})

router.post('/admin/employees/:id/edit', isAdmin, async function (req, res) {

    const { hourlyRate, hoursWorked } = req.body;
    const { id } = req.params;

    const hourly_rate = parseFloat(hourlyRate);
    const hours_worked = parseFloat(hoursWorked);
    const totalPay = parseFloat((hourly_rate * hours_worked).toFixed(2));

    const updatedData = Object.assign({}, req.body, { hourlyRate: hourly_rate, hoursWorked: hours_worked, accumulatedPay: totalPay });

    try {

        const updatedEmployee = await dbService.updateById(id, updatedData);
        if (updatedEmployee) {
            return res.render(`admin/employee-updated.hbs`, { user: updatedEmployee, layout: false })
        }
    } catch (err) {
        console.log(err)
    }

})

router.post('/admin/employees/:id/delete', isAdmin, async function (req, res) {

    const { id } = req.params;
    try {
        const result = await dbService.deleteById(id);
        console.log(result)
        return res.render('admin/manage.hbs', { layout: false })
    } catch (err) {
        console.log(err)
    }
})

//  admin log out route

router.post('/admin/logout', function (req, res) {

    res.clearCookie('authToken');
    res.clearCookie('theme');
    res.redirect('/');

})
module.exports = router;