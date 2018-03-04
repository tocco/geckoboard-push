var expect = require('chai').expect;
var versions = require('./versions');
var dates = require('../util/dates');

describe('datasets', function () {
    describe('versions', function () {
        describe('export', function() {
            it('should export an id', function () {
                expect(versions.id).to.be.equal('installations.by_version');
            });

            it('should export a scheme', function () {
                expect(versions.scheme).to.eql({
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
                });
            });

            it('should export a deleteBy property', function () {
                expect(versions.deleteBy).to.be.equal('date');
            });

            it('should export a query', function () {
                expect(versions.query).to.eql({
                    entity: 'Installation',
                    paths: 'instance,relProject_version.label',
                    where: 'relInstallation_status.unique_id == "active"'
                });
            });

            it('should export a toDatasetRecords function', function () {
                expect(versions.toDatasetRecords).to.be.a('function');
            });
        });

        describe('toDatasetRecords', function() {
            it('should return empty records array if data is empty', function() {
                var json = {
                    data: []
                };

                var records = versions.toDatasetRecords(json);

                expect(records).to.eql([]);
            });

            it('should count the installations by version', function() {
                var json = {
                    data: [{
                        paths: {
                            'relProject_version.label': {
                                value: {
                                    value: '2.15'
                                }
                            }
                        }
                    }, {
                        paths: {
                            'relProject_version.label': {
                                value: {
                                    value: '2.14'
                                }
                            }
                        }
                    }, {
                        paths: {
                            'relProject_version.label': {
                                value: {
                                    value: '2.15'
                                }
                            }
                        }
                    }]
                };

                var records = versions.toDatasetRecords(json);

                var dateString = dates.getDateString();

                expect(records).to.eql([{
                    date: dateString,
                    installations: 2,
                    version: '2.15'
                }, {
                    date: dateString,
                    installations: 1,
                    version: '2.14'
                }]);
            });
        });
    });
});