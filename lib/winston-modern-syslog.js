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

    syslog.log(level, msg, function () {
        callback(null, true);
    });
};
