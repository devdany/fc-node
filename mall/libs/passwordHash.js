var crypto = require('crypto');
var mysalt = 'dany';

module.exports = password => {
    return crypto.createHash('sha512').update(password + mysalt).digest('base64');
};