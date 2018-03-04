var chai = require('chai');
chai.use(require('chai-match'));
var expect = chai.expect;

var dates = require('./dates');
var format = require('./format');

describe('util', function() {
    describe('dates', function() {
        describe('getDateString()', function () {
            it('should return the given date in format YYYY-MM-DD', function () {
                var date = new Date(2018, 1, 24);
                expect(dates.getDateString(date)).to.be.equal('2018-02-24');
            });

            it('should return the current date in format YYYY-MM-DD if no date given', function () {
                var dateString = dates.getDateString();

                var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

                var today = new Date();
                var currentYear = today.getFullYear();
                var currentMonth = today.getMonth();
                var currentDay = today.getDate();

                expect(dateString).to.match(datePattern)
                    .and.capture(0).equals('' + currentYear)
                    .and.capture(1).equals(format.formatTwoDigits(currentMonth + 1))
                    .and.capture(2).equals(format.formatTwoDigits(currentDay));
            });
        });

        describe('getStartOfDateString()', function () {
            it('should return the start of the given date in format YYYY-MM-DD HH:mm', function () {
                var dateTime = new Date(2018, 1, 24, 14, 33, 12);
                expect(dates.getStartOfDateString(dateTime)).to.be.equal('2018-02-24 00:00');
            });

            it('should return the start of the current date in format YYYY-MM-DD HH:mm if no date given', function () {
                var dateString = dates.getStartOfDateString();

                var datePattern = /^(\d{4})-(\d{2})-(\d{2}) 00:00$/;

                var today = new Date();
                var currentYear = today.getFullYear();
                var currentMonth = today.getMonth();
                var currentDay = today.getDate();

                expect(dateString).to.match(datePattern)
                    .and.capture(0).equals('' + currentYear)
                    .and.capture(1).equals(format.formatTwoDigits(currentMonth + 1))
                    .and.capture(2).equals(format.formatTwoDigits(currentDay));
            });
        });

        describe('getStartOfNextDayString()', function () {
            it('should return the start of the next day in format YYYY-MM-DD HH:mm', function () {
                var dateTime = new Date(2018, 1, 24, 14, 33, 12);
                expect(dates.getStartOfNextDayString(dateTime)).to.be.equal('2018-02-25 00:00');
            });

            it('should return the start of tomorrow in format YYYY-MM-DD HH:mm if no date given', function () {
                var dateString = dates.getStartOfNextDayString();

                var datePattern = /^(\d{4})-(\d{2})-(\d{2}) 00:00$/;

                var expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() + 1);

                var expectedYear = expectedDate.getFullYear();
                var expectedMonth = expectedDate.getMonth();
                var expectedDay = expectedDate.getDate();

                expect(dateString).to.match(datePattern)
                    .and.capture(0).equals('' + expectedYear)
                    .and.capture(1).equals(format.formatTwoDigits(expectedMonth + 1))
                    .and.capture(2).equals(format.formatTwoDigits(expectedDay));
            });
        });
    });
});