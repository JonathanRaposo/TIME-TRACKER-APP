const path = require('path');
const fs = require('fs');

function connect(filePath) {

    if (!fs.existsSync(filePath)) {
        console.log("No database found...creating one")
        fs.writeFileSync(filePath, '{}', 'utf8');
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));

}

function touch(filePath, data) {
    fs.writeFileSync(filePath, toJsonFormat(data), 'utf-8');
}

function toJsonFormat(obj) {
    return JSON.stringify(obj, null, 2);
}


const WORK_SESSION_PATH = path.join(__dirname, 'workSessions.json')


class MemoryStorage {
    constructor(workSessions) {
        this.workSessions = workSessions || {};
    }

    async createWorkSession(payload) {
        if (typeof payload !== 'object') throw new Error('Argument must be an object.')
        const sessPayload = {
            employeeId: payload.id,
            clockedInAt: Math.floor(Date.now() / 1000),
            hourlyRate: payload.hourlyRate
        }
        this.workSessions[payload.id] = sessPayload;
        touch(WORK_SESSION_PATH, this.workSessions)
        return sessPayload;
    }
    async getWorkSession(employeeId) {
        if (typeof employeeId !== 'string') throw new Error('String id must be provided.');
        return this.workSessions[employeeId];
    }
    async deleteWorkSession(employeeId) {
        if (typeof employeeId !== 'string') throw new Error('String id must be provided.');
        delete this.workSessions[employeeId];
        touch(WORK_SESSION_PATH, this.workSessions);
    }

    async getClockedInEmployees() {
        return this.workSessions;
    }
    resetWorkSessions() {
        this.workSessions = {};
        touch(WORK_SESSION_PATH, this.workSessions);
        console.log('work session wiped clean.')

    }

}

module.exports = {
    MemoryStorage,
    connect,
    touch

}