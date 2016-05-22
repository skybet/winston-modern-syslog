'use strict';

var util    = require('util'),
    syslog  = require('modern-syslog'),
    winston = require('winston');

var ModernSyslog = module.exports = winston.transports.ModernSyslog = function (options) {
    var syslogOptions = 0;

    options = options || {};

    this.level = options.level || 'info';
    this.label = options.label || process.title;
    this.logPid = options.logPid || false;
    this.facility = options.facility || syslog.facility.LOG_USER;
    this.prefixLevel = options.prefixLevel || false;

    // build syslog options
    if (this.logPid) {
        syslogOptions |= syslog.option.LOG_PID;
    }

    // open the stream
    syslog.open(this.label, syslogOptions, this.facility);
};

util.inherits(ModernSyslog, winston.Transport);

ModernSyslog.prototype.name = 'ModernSyslog';

ModernSyslog.prototype.levels = {
    'emerg': syslog.level.LOG_EMERG,
    'alert': syslog.level.LOG_ALERT,
    'crit': syslog.level.LOG_CRIT,
    'error': syslog.level.LOG_ERR,
    'err': syslog.level.LOG_ERR,
    'warn': syslog.level.LOG_WARNING,
    'warning': syslog.level.LOG_WARNING,
    'note': syslog.level.LOG_NOTICE,
    'notice': syslog.level.LOG_NOTICE,
    'info': syslog.level.LOG_INFO,
    'debug': syslog.level.LOG_DEBUG
};

ModernSyslog.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }

    // prepend level
    if (this.prefixLevel) {
        msg = '[' + level.toUpperCase() + '] ' + msg;
    }

    // append meta
    if (meta) {
        if (Object.keys(meta).length) {
            msg += ' ' + JSON.stringify(meta);
        } else if (typeof meta != 'object' || meta instanceof Error) {
            msg += ' ' + meta;
        }
    }

    syslog.log(this.levels[level], msg, function () {
        callback(null, true);
    });
};
