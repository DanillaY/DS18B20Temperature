const dotenv = require('dotenv');
const logger = require('./winstonLogger');
dotenv.config();

const isEmptyOrUndefined = (varValue,varName) =>
	varValue === undefined || varValue == '' ? logger.warn(new Error(varName + ' is not set')) : varValue;

databaseService = isEmptyOrUndefined(process.env.DATABASE_SERVICE,'DATABASE_SERVICE');
databaseUser = isEmptyOrUndefined(process.env.DATABASE_USER,'DATABASE_USER');
databasePassword = isEmptyOrUndefined(process.env.DATABASE_PASSWORD,'DATABASE_PASSWORD');
databasePort = isEmptyOrUndefined(process.env.DATABASE_PORT,'DATABASE_PORT');

serverIp = isEmptyOrUndefined(process.env.SERVER_IP,'SERVER_IP');
serverPort = isEmptyOrUndefined(process.env.SERVER_PORT,'SERVER_PORT');
const apiPath = serverIp+`:`+serverPort;

module.exports = { databaseService, databaseUser, databasePassword, databasePort, serverIp, serverPort, apiPath};