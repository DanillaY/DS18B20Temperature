const dotenv = require('dotenv');
dotenv.config();

const isEmptyOrUndefined = (varValue,varName) =>
	varValue === undefined || varValue == '' ? console.log(varName + ' is not set') : varValue;

mysqlService = isEmptyOrUndefined(process.env.MYSQL_SERVICE,'MYSQL_SERVICE');
mysqlUser = isEmptyOrUndefined(process.env.MYSQL_USER,'MYSQL_USER');
mysqlPassword = isEmptyOrUndefined(process.env.MYSQL_PASSWORD,'MYSQL_PASSWORD');
mysqlPort = isEmptyOrUndefined(process.env.MYSQL_PORT,'MYSQL_PORT');

serverIp = isEmptyOrUndefined(process.env.SERVER_IP,'SERVER_IP');
serverPort = isEmptyOrUndefined(process.env.SERVER_PORT,'SERVER_PORT');

module.exports = { mysqlService, mysqlUser, mysqlPassword, mysqlPort, serverIp, serverPort };