
const winston = require('winston');

const { combine, timestamp, printf } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
	logResult = `${timestamp} [${level.toUpperCase()}]: ${message}`

	switch (level) {
		case 'info':
			logResult = '\x1b[36m' + logResult+ '\x1b[0m';
			break;
		case 'error':
			logResult = '\x1b[31m' + logResult+ '\x1b[0m';
			break;
		case 'warn':
			logResult = '\x1b[33m'+ logResult+ '\x1b[0m';
			break;
	}
	
	return logResult;
});

var logger = winston.createLogger({
    transports: [new winston.transports.Console(),],
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
});

module.exports = logger;