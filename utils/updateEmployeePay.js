
/**
 * Process hours worked by employe
 *
 * @param {Object} worksession
 * @returns {Object} - Returns an object with hours worked and total pay for that day of work. 
 */


// const payload = {
//     "employeeId": "003",
//     "createdAt": "2025-04-30T21:20:39.078Z",
//     "hourlyRate": 20,
//     "hoursWorked": 30,
//     "accumulatedPay": 0,
//     "firstName": "Anne",
//     "lastName": "Smith",
//     "email": "anne@gmail.com",
//     "password": "$2b$10$phgM8HmHDNMYeFtNwToDBeKw2DhXlAoAZFO11NiqtwV/a0uGyGP32",
//     "role": "employee"
// }


function processHours(workSession) {

    const now = Math.floor(Date.now() / 1000);
    const duration = now - workSession.clockedInAt;
    const hours = duration / (60 * 60); //convert seconds to hour

    return {
        hours: parseFloat(hours.toFixed(2))
    }

}


/**
 * Update employee pay
 * 
 * @param {Object} employee  -Employee object to updated.
 * @param {Object} workSession  - Employee work session object when clocked itn.
 * @returns {Object} - updated employee.
 */

function updateEmployeePay(employee, workSession) {
    const { hours } = processHours(workSession);
    const updatedHours = employee.hoursWorked + hours;
    const updatedPay = updatedHours * employee.hourlyRate;

    const updatedEmployee = Object.assign({}, employee, {
        hoursWorked: parseFloat(updatedHours.toFixed(2)),
        accumulatedPay: parseFloat(updatedPay.toFixed(2))
    })
    return updatedEmployee;
}

module.exports = updateEmployeePay;