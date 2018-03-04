var TopoSort = require('topo-sort');

function sort(datasets) {
    var tsort = new TopoSort();

    datasets.forEach(function(dataset) {
        tsort.add(dataset.id, dataset.feed || []);
    });

    var sortedIds = tsort.sort();

    sortedIds.reverse();

    return datasets.sort(function(a, b) {
        return sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id);
    });
}

module.exports = sort;
