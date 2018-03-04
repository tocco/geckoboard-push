var expect = require('chai').expect;

var format = require('./format');

describe('util', function() {
    describe('format', function() {
        describe('formatTwoDigits()', function () {
            it('should insert 0 before one-digit number', function () {
                for (var i = 0; i < 10; i++) {
                    expect(format.formatTwoDigits(i)).to.equal('0' + i);
                }
            });

            it('should leave two-digit number as is', function() {
                for (var i = 10; i < 100; i++) {
                    expect(format.formatTwoDigits(i)).to.equal('' + i);
                }
            });

            it('should throw an error if number has more than two digits', function() {
                expect(function() { format.formatTwoDigits(100); })
                    .to.throw('Given number "100" has more than two digits');
            });
        });
    });
});