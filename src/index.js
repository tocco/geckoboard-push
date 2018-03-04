require('dotenv').config();

if (!process.env.GECKOBOARD_API_KEY) {
    console.log('Required environment variable "GECKOBOARD_API_KEY" not set');
    return;
}
if (!process.env.BACKOFFICE_USERNAME) {
    console.log('Required environment variable "BACKOFFICE_USERNAME" not set');
    return;
}
if (!process.env.BACKOFFICE_PASSWORD) {
    console.log('Required environment variable "BACKOFFICE_PASSWORD" not set');
    return;
}

var sortDatasets = require('./util/sort_datasets');
var datasets = sortDatasets(require('./datasets'));

var queryBackoffice = require('./util/backoffice_query');
var postDataset = require('./util/geckoboard').postDataset;

var credentials = {
    username: process.env.BACKOFFICE_USERNAME,
    password: process.env.BACKOFFICE_PASSWORD
};

(function() {
    var promises = {};
    var deferreds = {};

    datasets.forEach(function(dataset) {
        var requiredPromises = getRequiredPromises(promises, dataset.feed || []);

        promises[dataset.id] = new Promise(function(resolve, reject){
            deferreds[dataset.id] = {resolve: resolve, reject: reject};
        });

        Promise.all(requiredPromises).then(function(results) {
            updateDataset(dataset, results).then(function(result) {
                deferreds[dataset.id].resolve(result);
            }).catch(function(e) {
                deferreds[dataset.id].reject(e);
            });
        });
    });
})();

function getRequiredPromises(promises, keys) {
    var filtered = [];
    keys.forEach(function(key) {
        var promise = promises[key];
        if (!promise) {
            throw new Error('Promise not found for id "' + key + '"');
        }
        filtered.push(promise);
    });
    return filtered;
}

function finish(id) {
    return function(data) {
        console.log('Executed "' + id + '" succsesfully');
        return data;
    }
}

function fail(id) {
    return function(e) {
        console.error('Execution of "' + id + '" failed:', e);
        process.exit(1);
    }
}

function updateDataset(def, feed) {
    return queryBackoffice(def.query, credentials)
        .then(postDataset(def, feed))
        .then(finish(def.id))
        .catch(fail(def.id));
}
