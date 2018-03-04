var fetch = require('node-fetch');

/**
 * @param query Consists of the following properties:
 * - `entity`: The entity model name to fetch
 * - `paths` (optional): The paths to fetch ("_paths" query parameter)
 * - `where` (optional): The where condition ("_where" query parameter)
 * - `resolve` (optional): The relations to resolve (query parameters "_relation" and "_resolve")
 * - `fields` (optional): The field values to return ("_fields" query parameter)
 * @param credentials The credentials to use for the query (consisting of the properties `username` and `password`
 * @returns {PromiseLike<T> | Promise<T>}
 */
function query(query, credentials) {
    return fetchData(query, credentials).then(getJson);
}

function fetchData(query, credentials) {
    var url = 'https://www.tocco.ch/nice2/rest/entities/' + query.entity + '?_limit=10000';

    if (query.paths) {
        url += '&_paths=' + query.paths
    }
    if (query.where) {
        url += '&_where=' + encodeURIComponent(query.where)
    }
    if (query.resolve) {
        url += '&_relations=' + query.resolve +
            '&_resolve=' + query.resolve
    }
    if (query.fields) {
        url += '&_fields=' + query.fields
    }

    var auth = 'Basic ' + new Buffer(credentials.username + ':' + credentials.password).toString('base64');

    return fetch(url, {
        headers: {
            'Authorization': auth
        }
    });
}

function getJson(res) {
    if (res.ok === true) {
        return res.json();
    } else if (res.status === 401) {
        throw 'Invalid backoffice credentials'
    } else {
        throw 'Failed to fetch data from backoffice'
    }
}

module.exports = query;
