var should = require('should'),
    sinon = require('sinon'),
    rewire = require('rewire'),
    ModernSyslog = rewire('../lib/winston-modern-syslog.js');

var mockSyslog = {
    option: {
        LOG_PID: 1
    },
    open: sinon.spy(),
    log:  sinon.spy()
};

ModernSyslog.__set__('syslog', mockSyslog);

describe('ModernSyslog', function () {

    afterEach(function () {
        mockSyslog.open.reset();
        mockSyslog.log.reset();
    });

    describe('on creation', function () {

        it('should pass options to modern-syslog', function () {
            var transport = new ModernSyslog({
                level: 'info',
                label: 'prefix',
                logPid: true
            });

            mockSyslog.open.callCount.should.equal(1);
            mockSyslog.open.firstCall.args[0].should.equal('prefix');
            mockSyslog.open.firstCall.args[1].should.equal(1);
        });

        it('should default logPid to false', function () {
            var transport = new ModernSyslog();

            mockSyslog.open.firstCall.args[1].should.equal(0);
        });
    });

    describe('logging', function () {

        it('should pass level and message to modern-syslog', function () {
            var transport = new ModernSyslog(),
                callback = sinon.spy();

            transport.log('info', 'this is my log message', {}, callback);

            mockSyslog.log.callCount.should.equal(1);
            mockSyslog.log.firstCall.args[0].should.equal('info');
            mockSyslog.log.firstCall.args[1].should.equal('this is my log message');

            // now complete the log action
            callback.callCount.should.equal(0);
            mockSyslog.log.firstCall.args[2]();
            callback.callCount.should.equal(1);
        });

        it('should prefix log levels if configured', function () {
            var transport = new ModernSyslog({prefixLevel: true});
            transport.log('info', 'log message');
            mockSyslog.log.firstCall.args[1].should.equal('[INFO] log message');
        });

        it('should cope with missing metadata', function () {
            var transport = new ModernSyslog();
            transport.log('info', 'log message');
            mockSyslog.log.firstCall.args[1].should.equal('log message');
        });

        it('should log metadata object as JSON string', function () {
            var transport = new ModernSyslog();
            transport.log('info', 'log message', {foo: 'bar'});
            mockSyslog.log.firstCall.args[1].should.equal('log message {"foo":"bar"}');
        });

        it('should log metadata error', function () {
            var transport = new ModernSyslog();
            transport.log('info', 'log message', new Error('it broke'));
            mockSyslog.log.firstCall.args[1].should.equal('log message Error: it broke');
        });
    });
});
