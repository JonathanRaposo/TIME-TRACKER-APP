require('dotenv').config();

const express = require('express');
const app = express();
require('./config/index.js')(app)

const cookieParser = require('./middleware/cookieParser.js');
app.use(cookieParser());

const isAuthenticated = require('./middleware/isAuthenticated.js');

const indexRoute = require('./routes/index.route.js');
app.use('/', indexRoute);
const authRoutes = require('./routes/auth/auth.routes.js');
app.use('/', authRoutes);

const clockRoutes = require('./routes/employee/clock.routes.js');
app.use('/', clockRoutes);

const employeeRoutes = require('./routes/employee/employee.routes.js');
app.use('/', employeeRoutes);

const adminRoutes = require('./routes/admin/admin.routes.js');
app.use('/', isAuthenticated, adminRoutes);

app.use((req, res, next) => {
    res.render('not-found.hbs');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))