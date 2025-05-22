const bcrypt = require('bcryptjs');


/**
 * Creates a hash
 *
 * @param {String} string - Password to be hashed.
 * @param {Object} options
 * @returns {String}  
 */

module.exports = function (string, options) {

    options = options || {};
    if (typeof string !== 'string') {
        throw new Error('Password string must be provided.')
    }
    let salt;
    if (options.saltRounds) {
        salt = bcrypt.genSaltSync(options.saltRounds || 10);
    }
    const hash = bcrypt.hashSync(string, salt);
    if (options.compare) {
        return bcrypt.compareSync(string, options.passwordFromDB);
    }
    return hash;
}

