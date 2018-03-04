var format = require('./format');

function getDateString(date) {
    var d = date || new Date();
    return formatDateIso(d);
}

function getStartOfDateString(date) {
    var d = date || new Date();
    var isoDate = formatDateIso(d);
    return appendTime(isoDate);
}

function getStartOfNextDayString(date) {
    var d = date || new Date();
    d.setDate(d.getDate() + 1);
    var isoDate = formatDateIso(d);
    return appendTime(isoDate);
}

function formatDateIso(date) {
    return date.getFullYear() + '-' + format.formatTwoDigits(date.getMonth() + 1) + '-' + format.formatTwoDigits(date.getDate());
}

function appendTime(isoDateString) {
    return isoDateString + ' 00:00';
}

module.exports = {
    getDateString: getDateString,
    getStartOfDateString: getStartOfDateString,
    getStartOfNextDayString: getStartOfNextDayString
};
