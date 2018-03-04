var expect = require('chai').expect;
var sortDatasets = require('./sort_datasets');

describe('util', function () {
    describe('sort_datasets', function () {
        it('should return an empty array if no datasets are given', function () {
            var datasets = [];
            var sorted = sortDatasets(datasets);
            expect(sorted).to.eql([]);
        });

        it('should sort the datasets according to the feed property', function () {
            var set1 = {
                id: 'set1',
                feed: ['set2']
            };
            var set2 = {
                id: 'set2'
            };
            var datasets = [set1, set2];

            var sorted = sortDatasets(datasets);

            expect(sorted).to.eql([set2, set1]);
        });

        it('should throw an error in case of cyclic dependencies', function () {
            var set1 = {
                id: 'set1',
                feed: ['set2']
            };
            var set2 = {
                id: 'set2',
                feed: ['set1']
            };
            var datasets = [set1, set2];

            expect(function() {sortDatasets(datasets);})
                .to.throw('At least 1 circular dependency in nodes: \n\nset1\nset2\n\nGraph cannot be sorted!');
        });
    });
});