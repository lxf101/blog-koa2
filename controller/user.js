const {exec, escape} = require('../db/mysql');
const {generatePassword} = require('../utils/cryp');

const login = async (username, password) => {
    username = escape(username);
    password = generatePassword(password);
    password = escape(password);

    let sql = `select username, realname from users where username=${username} and password=${password}`;
    let resData = await exec(sql);
    return resData[0] || {}
}

module.exports = {
    login
}