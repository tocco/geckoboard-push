var expect = require('chai').expect;
var supportTickets = require('./support_tickets');
var dates = require('../util/dates');

describe('datasets', function () {
    describe('support_tickets', function () {
        describe('export', function () {
            it('should export an id', function () {
                expect(supportTickets.id).to.be.equal('support_tickets.by_version');
            });

            it('should export a scheme', function () {
                expect(supportTickets.scheme).to.eql({
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
                });
            });

            it('should export a deleteBy property', function () {
                expect(supportTickets.deleteBy).to.be.equal('date');
            });

            it('should export a query', function () {
                var startOfToday = dates.getStartOfDateString();
                var startOfTomorrow = dates.getStartOfNextDayString();

                expect(supportTickets.query).to.eql({
                    entity: 'Task',
                    paths: 'relSubproject.relProject.relProject_installation',
                    where: 'create_timestamp >= datetime:"' + startOfToday + '" ' +
                    'and create_timestamp < datetime:"' + startOfTomorrow + '" ' +
                    'and exists(relSubproject where relSubproject_type.unique_id == "support")',
                    fields: 'Version.label,Installation_type.unique_id',
                    resolve: 'Installation.relProject_version,Installation.relInstallation_type'
                });
            });

            it('should export a toDatasetRecords function', function () {
                expect(supportTickets.toDatasetRecords).to.be.a('function');
            });

            it('should require versions data', function () {
                expect(supportTickets.feed).to.eql(['installations.by_version']);
            })
        });

        describe('toDatasetRecords', function () {
            it('should return empty records array if data is empty', function () {
                var json = {
                    data: []
                };
                var versions = [];

                var records = supportTickets.toDatasetRecords(json, [versions]);

                expect(records).to.eql([]);
            });

            it('should count the support tickets by version', function () {
                var json = {
                    data: [
                        // ticket 1: 2.15
                        // (ticket will be linked to version of production installation,
                        // not to version of test installation (already 2.16))
                        {
                            paths: {
                                'relSubproject.relProject.relProject_installation': {
                                    value: [
                                        { // production installation
                                            singleRelations: [{
                                                name: 'relInstallation_type',
                                                entities: [{
                                                    fields: {
                                                        unique_id: {
                                                            value: 'active'
                                                        }
                                                    }
                                                }]
                                            }, {
                                                name: 'relProject_version',
                                                entities: [{
                                                    fields: {
                                                        label: {
                                                            value: '2.15'
                                                        }
                                                    }
                                                }]
                                            }]
                                        },
                                        { // production installation
                                            singleRelations: [{
                                                name: 'relInstallation_type',
                                                entities: [{
                                                    fields: {
                                                        unique_id: {
                                                            value: 'test'
                                                        }
                                                    }
                                                }]
                                            }, {
                                                name: 'relProject_version',
                                                entities: [{
                                                    fields: {
                                                        label: {
                                                            value: '2.16'
                                                        }
                                                    }
                                                }]
                                            }]
                                        }
                                    ]
                                }
                            }
                        },
                        // ticket 2: 2.14
                        {
                            paths: {
                                'relSubproject.relProject.relProject_installation': {
                                    value: [
                                        { // production installation
                                            singleRelations: [{
                                                name: 'relInstallation_type',
                                                entities: [{
                                                    fields: {
                                                        unique_id: {
                                                            value: 'active'
                                                        }
                                                    }
                                                }]
                                            }, {
                                                name: 'relProject_version',
                                                entities: [{
                                                    fields: {
                                                        label: {
                                                            value: '2.14'
                                                        }
                                                    }
                                                }]
                                            }]
                                        },
                                        { // test installation
                                            singleRelations: [{
                                                name: 'relInstallation_type',
                                                entities: [{
                                                    fields: {
                                                        unique_id: {
                                                            value: 'test'
                                                        }
                                                    }
                                                }]
                                            }, {
                                                name: 'relProject_version',
                                                entities: [{
                                                    fields: {
                                                        label: {
                                                            value: '2.14'
                                                        }
                                                    }
                                                }]
                                            }]
                                        }
                                    ]
                                }
                            }
                        },

                        // ticket 3:
                        // 2.15, but there is no active installation for this customer project,
                        // so this should be ignored
                        {
                            paths: {
                                'relSubproject.relProject.relProject_installation': {
                                    value: [
                                        // there is only 1 installation linked to this project,
                                        // and this is a test installation
                                        {
                                            singleRelations: [{
                                                name: 'relInstallation_type',
                                                entities: [{
                                                    fields: {
                                                        unique_id: {
                                                            value: 'test'
                                                        }
                                                    }
                                                }]
                                            }, {
                                                name: 'relProject_version',
                                                entities: [{
                                                    fields: {
                                                        label: {
                                                            value: '2.15'
                                                        }
                                                    }
                                                }]
                                            }]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                };

                var versions = [{
                    date: dateString,
                    installations: 2,
                    version: '2.15'
                }, {
                    date: dateString,
                    installations: 1,
                    version: '2.14'
                }];

                var records = supportTickets.toDatasetRecords(json, [versions]);

                var dateString = dates.getDateString();

                expect(records).to.eql([{
                    date: dateString,
                    version: '2.15',
                    tickets: 1,
                    tickets_per_installation: 0.5
                }, {
                    date: dateString,
                    version: '2.14',
                    tickets: 1,
                    tickets_per_installation: 1
                }]);
            });
        });
    });
});