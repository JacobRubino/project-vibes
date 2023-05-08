const { createLogger, transports, config } = require('winston');

const userLogger = createLogger({
    levels: config.syslog.levels,
    transports: [
        new transports.File({ filename: 'users.log' })
    ]
});

module.exports = { userLogger };