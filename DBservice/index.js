const fs = require('fs');
const path = require('path');


function generateId() {
    const nextId = this.db.length + 1;
    return String(nextId).padStart(3, '0');
}

function connectDB(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log("No database found...creating one")
        fs.writeFileSync(filePath, '[]', 'utf8');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));

}

function touchDB(filePath, data) {
    fs.writeFileSync(filePath, toJsonFormat(data), 'utf-8');
}

function toJsonFormat(obj) {
    return JSON.stringify(obj, null, 2);
}


const DB_FILEPATH = path.join(__dirname, '..', 'db', 'employees.json');
const db = connectDB(DB_FILEPATH);


class DBService {
    constructor(db) {
        this.db = db || [];
        this.usersStorage = {};
        this.usersIdxStorage = {};
        this.usersEmailStorage = {};
        this.usersLastNameStorage = {};
        this.loadData()

    }

    loadData() {
        if (this.db.length > 0) {
            for (let i = 0; i < this.db.length; i++) {
                const user = this.db[i];
                if (!user || !user.id) continue;

                this.usersStorage[user.id] = user;
                this.usersIdxStorage[user.id] = i;
                this.usersEmailStorage[user.email.toLowerCase()] = user

                if (user.lastName) {
                    this.usersLastNameStorage[user.lastName.toLowerCase()] = user;
                }

            }
        }

    }

    async create(obj) {
        if (typeof obj !== 'object') throw new Error('Payload must an object or array.');

        if (obj && !Array.isArray(obj)) {
            const newEmployee = Object.assign({
                id: generateId.call(this),
                createdAt: new Date().toISOString(),
                hourlyRate: 0,
                hoursWorked: 0,
                accumulatedPay: 0,
                role: 'employee'
            }, obj);

            this.db.push(newEmployee);
            touchDB(DB_FILEPATH, this.db);
            return newEmployee;
        }
        else if (Array.isArray(obj)) {

            for (let i = 0; i < obj.length; i++) {
                const employee = obj[i];
                const newEmployee = Object.assign({
                    id: generateId.call(this),
                    createdAt: new Date().toISOString(),
                    hourlyRate: 0,
                    hoursWorked: 0,
                    accumulatedPay: 0,
                    role: 'employee'

                }, employee);

                this.db.push(newEmployee);
                touchDB(DB_FILEPATH, this.db);


            }
            return [...obj]
        }
    }

    async findById(id) {
        // if (typeof id !== 'string') throw new Error('string id must be provided.')

        const employee = this.usersStorage[id];
        if (!employee) return null;
        return employee;
    }
    async find(options) {
        options = options || {};
        const result = [];
        try {
            if (options.id) {
                const employee = await this.findById(options.id)
                if (!employee) return null;
                result.push(employee);
                return result;
            }
            if (options.email) {
                const employee = this.usersEmailStorage[options.email.toLowerCase()];
                if (!employee) return null;
                result.push(employee);
                return result;
            }
            if (options.lastName) {
                const employee = this.usersLastNameStorage[options.lastName.toLowerCase()];
                if (!employee) return null;
                result.push(employee);
                return result;
            }
            return this.db.filter((user) => user.role !== 'admin');

        } catch (err) {
            console.log(err)
        }
    }

    async findOne(options) {
        options = options || {};

        if (!(options.email || options.id || options.lastName)) {
            throw new Error('Option properties must be either by employee id or email. e.g,{employeeId:"001"},{email:"john@gmail.com"}')
        }

        try {
            if (options.id) {
                const employee = await this.findById(options.id)
                if (!employee) return null;
                return employee;
            }
            if (options.email) {
                const employee = this.usersEmailStorage[options.email.toLowerCase()];
                if (!employee) return null;
                return employee;
            }
            if (options.lastName) {
                const employee = this.usersLastNameStorage[options.lastName.toLowerCase()];
                if (!employee) return null;
                return employee;
            }

        } catch (err) {
            console.log(err)
        }
    }
    async updateById(id, updatedData) {
        if (typeof id !== 'string') throw new Error('string id must be provided.');
        if (updatedData && Array.isArray(updatedData)) throw new Error('Second argument must be an object.');

        try {
            const employee = await this.findById(id);
            if (!employee) return null;

            const previousEmail = updatedData.email || employee.email;

            const updatedEmployee = Object.assign({}, employee, updatedData, { updatedAt: new Date().toISOString() });
            const index = this.usersIdxStorage[employee.id];

            this.db[index] = updatedEmployee;
            delete this.usersEmailStorage[previousEmail];
            this.usersEmailStorage[updatedEmployee.email.toLowerCase()] = updatedEmployee;
            touchDB(DB_FILEPATH, this.db);
            return updatedEmployee;
        } catch (err) {
            console.log(err)
        }

    }

    async deleteById(id) {
        if (typeof id !== 'string') throw new Error('string id must be provided.');
        try {
            const employee = await this.findById(id);
            if (!employee) return null
            const index = this.usersIdxStorage[id];
            this.db.splice(index, 1);
            touchDB(DB_FILEPATH, this.db);
            delete this.usersStorage[id]
            delete this.usersIdxStorage[id];
            delete this.usersEmailStorage[employee.email]
            return { deleted: 1 }
        } catch (err) {
            console.log(err)
        }

    }

    //FOR INTERNAL USE ONLY
    printMemoryStore() {
        console.log(this.memoryStorage)
    }

    resetDB() {
        this.db = [];
        touchDB(DB_FILEPATH, this.db)
        console.log('database wiped clean.')
    }


}

module.exports = {
    DBService: DBService,
    connectDB: connectDB,
    touchDB: touchDB,
    toJsonFormat: toJsonFormat

}

