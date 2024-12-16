const dotenv = require('dotenv');
const logger = require('./winstonLogger');
dotenv.config();

const isEmptyOrUndefined = (varValue,varName) =>
	varValue === undefined || varValue == '' ? logger.warn(new Error(varName + ' is not set')) : varValue;

mysqlService = isEmptyOrUndefined(process.env.MYSQL_SERVICE,'MYSQL_SERVICE');
mysqlUser = isEmptyOrUndefined(process.env.MYSQL_USER,'MYSQL_USER');
mysqlPassword = isEmptyOrUndefined(process.env.MYSQL_PASSWORD,'MYSQL_PASSWORD');
mysqlPort = isEmptyOrUndefined(process.env.MYSQL_PORT,'MYSQL_PORT');

serverIp = isEmptyOrUndefined(process.env.SERVER_IP,'SERVER_IP');
serverPort = isEmptyOrUndefined(process.env.SERVER_PORT,'SERVER_PORT');
const apiPath = serverIp+`:`+serverPort;

module.exports = { mysqlService, mysqlUser, mysqlPassword, mysqlPort, serverIp, serverPort, apiPath};