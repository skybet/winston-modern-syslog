'use strict';

var util = require('util');
var winston = require('winston');

var syslog = require('modern-syslog');

var ModernSyslog = winston.transports.ModernSyslog = function (options) {
    this.level = options.level || 'info';

    // TODO: setup storage backing
};

util.inherits(ModernSyslog, winston.Transport);

ModernSyslog.prototype.name = 'ModernSyslog';

ModernSyslog.prototype.log = function (level, msg, meta, callback) {
    // TODO: call out to syslog

    callback(null, true);
};

module.exports = ModernSyslog;
