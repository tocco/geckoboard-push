var dates = require('../util/dates');

function getCountByVersion(json) {
    var countByVersion = {};

    for (var i = 0; i < json.data.length; i++) {
        var version = json.data[i].paths['relProject_version.label'].value.value;
        if (version) {
            if (!countByVersion.hasOwnProperty(version)) {
                countByVersion[version] = 0;
            }
            countByVersion[version]++;
        }
    }

    return countByVersion;
}

function toDatasetRecords(json) {
    var countByVersion = getCountByVersion(json);

    var today = dates.getDateString();

    var data = [];

    for (var version in countByVersion) {
        if (countByVersion.hasOwnProperty(version)) {
            data.push({
                date: today,
                version: version,
                installations: countByVersion[version]
            });
        }
    }

    return data;
}

module.exports = {
    id: 'installations.by_version',
    scheme: {
        id: 'installations.by_version',
        fields: {
            date: {
                name: 'Date',
                type: 'date'
            },
            version: {
                name: 'Version',
                type: 'string'
            },
            installations: {
                name: 'Number of installations',
                type: 'number'
            }
        }
    },
    deleteBy: 'date',
    query: {
        entity: 'Installation',
        paths: 'instance,relProject_version.label',
        where: 'relInstallation_status.unique_id == "active"'
    },
    toDatasetRecords: toDatasetRecords
};