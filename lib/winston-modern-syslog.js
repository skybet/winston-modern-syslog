'use strict';

var util    = require('util'),
    syslog  = require('modern-syslog'),
    winston = require('winston');

var ModernSyslog = module.exports = winston.transports.ModernSyslog = function (options) {
    var syslogOptions = 0;

    options = options || {};

    this.level  = options.level  || 'info';
    this.label  = options.label  || process.title;
    this.logPid = options.logPid || false;

    // build syslog options
    if (this.logPid) {
        syslogOptions |= syslog.option.LOG_PID;
    }

    // open the stream
    syslog.open(this.label, syslogOptions);
};

util.inherits(ModernSyslog, winston.Transport);

ModernSyslog.prototype.name = 'ModernSyslog';

ModernSyslog.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }

    syslog.log(level, msg, function () {
        callback(null, true);
    });
};
