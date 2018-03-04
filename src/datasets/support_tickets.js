var dates = require('../util/dates');

var today = dates.getDateString();
var startOfToday = dates.getStartOfDateString();
var startOfTomorrow = dates.getStartOfNextDayString();

function getSingleRelationEntity(entity, name) {
    for (var i = 0; i < entity.singleRelations.length; i++) {
        var relation = entity.singleRelations[i];
        if (relation.name === name) {
            if (!relation.entities || !relation.entities[0]) {
                throw new Error('Entities missing for relation ' + name);
            }
            return relation.entities[0];
        }
    }
    throw new Error('Relation ' + name + ' not found');
}

function getProductionInstallation(installations) {
    for (var i = 0; i < installations.length; i++) {
        var installation = installations[i];
        var typeEntity = getSingleRelationEntity(installation, 'relInstallation_type');
        if (typeEntity.fields['unique_id'].value === 'active') {
            return installation;
        }
    }
    return null;
}

function getInstallationVersion(installation) {
    var versionEntity = getSingleRelationEntity(installation, 'relProject_version');
    return versionEntity.fields['label'].value;
}

function getVersion(task) {
    var installations = task.paths['relSubproject.relProject.relProject_installation'].value;
    var productionInstallation = getProductionInstallation(installations);
    if (productionInstallation) {
        return getInstallationVersion(productionInstallation);
    }
    return null;
}

function getCountByVersion(json) {
    var countByVersion = {};

    for (var i = 0; i < json.data.length; i++) {
        var task = json.data[i];
        var version = getVersion(task);

        if (version) {
            if (!countByVersion.hasOwnProperty(version)) {
                countByVersion[version] = 0;
            }
            countByVersion[version]++;
        }
    }

    return countByVersion;
}

function getInstallationCountByVersion(installationsData) {
    var byVersion = {};
    installationsData.forEach(function(record) {
        byVersion[record.version] = record.installations;
    });
    return byVersion;
}

function toDatasetRecords(json, feed) {
    var countByVersion = getCountByVersion(json);
    var installationCountByVersion = getInstallationCountByVersion(feed[0]);

    var data = [];

    for (var version in countByVersion) {
        if (countByVersion.hasOwnProperty(version)) {
            var totalTicketsCount = countByVersion[version];
            var installationsCount = installationCountByVersion[version];

            data.push({
                date: today,
                version: version,
                tickets: totalTicketsCount,
                tickets_per_installation: Math.round((totalTicketsCount / installationsCount) * 10) / 10
            });
        }
    }

    return data;
}

module.exports = {
    id: 'support_tickets.by_version',
    feed: ['installations.by_version'],
    scheme: {
        id: 'support_tickets.by_version',
        fields: {
            date: {
                name: 'Date',
                type: 'date'
            },
            version: {
                name: 'Version',
                type: 'string'
            },
            tickets: {
                name: 'Number of support tickets',
                type: 'number'
            },
            tickets_per_installation: {
                name: 'Number of support tickets per installation',
                type: 'number'
            }
        }
    },
    deleteBy: 'date',
    query: {
        entity: 'Task',
        where: 'create_timestamp >= datetime:"' + startOfToday + '"' +
        ' and create_timestamp < datetime:"' + startOfTomorrow + '"' +
        ' and exists(relSubproject where relSubproject_type.unique_id == "support")',
        paths: 'relSubproject.relProject.relProject_installation',
        resolve: 'Installation.relProject_version,Installation.relInstallation_type',
        fields: 'Version.label,Installation_type.unique_id'
    },
    toDatasetRecords: toDatasetRecords
};