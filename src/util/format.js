function formatTwoDigits(number) {
    if (number > 99) {
        throw new Error('Given number "' + number + '" has more than two digits');
    }
    return ('0' + number).slice(-2);
}

module.exports = {
    formatTwoDigits: formatTwoDigits
};