var gb = require('geckoboard')(process.env.GECKOBOARD_API_KEY);

function postDataset(def, feed) {
    return function(json) {
        return new Promise(function(resolve, reject) {
            var data = def.toDatasetRecords(json, feed);

            gb.datasets.findOrCreate(
                def.scheme,
                function (err, dataset) {
                    if (err) {
                        console.error(err);
                        reject(e);
                        return;
                    }

                    dataset.post(
                        data, {
                            delete_by: def.deleteBy
                        },
                        function (err) {
                            if (err) {
                                console.error(err);
                                reject(e);
                                return;
                            }

                            resolve(data);
                        }
                    );
                }
            );
        });
    };
}

module.exports = {
    postDataset: postDataset
};