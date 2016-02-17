# winston-modern-syslog

A syslog transport for [winston](https://www.npmjs.com/package/winston) that is a simple wrapper for the [modern-syslog](https://www.npmjs.com/package/modern-syslog) library.

## Installation

```
npm install --save winston-modern-syslog
```

## Usage

To use the ModernSyslog transport in winston, simply require the module and then attach it to the winston logger, or a logger of your own creation:

```javascript
var winston = require('winston');

// Requiring the module will return `winston.transports.ModernSyslog`
require('winston-modern-syslog');

// Tell winston that you're using the syslog levels instead of the defaults
winston.setLevels(winston.config.syslog.levels);

winston.add(winston.transports.ModernSyslog, {level: 'alert'});
```

As syslog only supports a subset of the levels available in winston, in the example above we explicitly configure winston to use the syslog levels.