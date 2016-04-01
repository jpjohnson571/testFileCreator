describe('migratorCtrl', function () {
    beforeEach(module('migrator'));

    var $controller, $rootScope, $httpBackend, Immutable, authRequestHandler,
        dbsResponse = {"source": [{"name": "rds-dsjf"}, {"name": "sqa"}], "destination": [{"name": "rds-dsjf"}, {"name": "sqa"}]},
        schemaResponse = [
            {
                name: 'company',
                keys: ['company_name', 'company_uid']
            },
            {
                  name: 'profile',
                  keys: ['profile_uid', 'edu_uid', 'company_uid', 'profile_name']
            },
            {
                name: 'map',
                keys: ['map_uid', 'fake_key1', 'fake_key2']
            }
        ],
        graphResponse = {
            "nodes": [
                {
                    "__table": "company",
                    "__uid": "a509363624a41e0803fc2aac4f85ba2d",
                    "active": 1,
                    "company_name": "Stark Corporation",
                    "company_uid": 9736,
                    "created_by": "toodufuye",
                    "created_date": "2015-11-19 17:46:57",
                    "modified_by": "toodufuye",
                    "modified_date": "2015-11-19 17:47:08",
                    "row_version": 1
                }
            ],
            "edges": [
                {
                    "from": "5e221ec15ff3a7f99d5e4101551adf82",
                    "to": "bf9769929247656c353c7707dcbee4e",
                    "from_table": "filebroker_capability",
                    "to_table": "capability",
                    "from_link": {
                        "capability_uid": 1088082
                    },
                    "to_link": {
                        "capability_uid": 1088082
                    },
                    "__uid": "162518541bc4161a8afa824013845df3"
                }
            ],
            "stats": {
                "nodes_by_table": {
                    "capability": 1,
                    "company": 1,
                    "data_class": 2,
                    "datatype": 2,
                    "datatype_business_object": 1,
                    "datatype_doctypes": 2,
                    "endpoint": 1,
                    "filebroker_capability": 1,
                    "filebroker_channel_params": 8,
                    "filebroker_channels": 2,
                    "filebroker_param_values": 6,
                    "filebroker_params": 7,
                    "map": 1,
                    "map_rsx_version": 1,
                    "parameter": 9,
                    "parameter_list": 9,
                    "profile": 1,
                    "profile_capabilities": 1,
                    "service": 2,
                    "types": 1
                },
                "num_queries_executed": 46,
                "num_uniq_tables": 20,
                "num_edges": 96,
                "num_nodes": 59
            },
            "env": "sqa"
        };

    beforeEach(inject(function (_$rootScope_, _$controller_, _$httpBackend_, _Immutable_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Immutable = _Immutable_;

        $httpBackend.when('GET', 'http://localhost:8888/dbs')
            .respond(dbsResponse, '');
        $httpBackend.when('GET', 'http://localhost:8888/schema')
            .respond(schemaResponse, '');
        $httpBackend.when('GET', 'http://localhost:8888/sqa/profile')
            .respond(graphResponse, '');
    }));

    describe('setup variables needed in the controller', function () {
        var $scope, vm;

        beforeEach(function () {
            $httpBackend.expectGET('http://localhost:8888/dbs').respond(dbsResponse, '');
            $httpBackend.expectGET('http://localhost:8888/schema').respond(schemaResponse, '');
            $scope = $rootScope.$new();
            vm = $controller('migratorCtrl', { $scope: $scope });
            $scope.$digest();
        });

        describe('vm.preferredKey', function() {
            beforeEach(function () {
                vm.selectedTable = schemaResponse[1];
            });

            it('chooses the key with a substring of "name" if available', function () {
                expect(vm.preferredKey(vm.selectedTable.keys)).toEqual('profile_name');
            });

            it('chooses the first key since none have a substring of "name"', function () {
                expect(vm.preferredKey(schemaResponse[2].keys)).toEqual('map_uid');
            });
        });

        describe('vm.modifySetupData', function () {
            beforeEach(function () {
                vm.graph = vm.modifySetupData(Immutable.fromJS({
                    nodes: graphResponse.nodes,
                    edges: graphResponse.edges
                }));
            });

            it('modifies the nodes of a setup, adding "id" and "label" keys and values', function () {
                expect(vm.graph.get('nodes').get(0).has('id')).toEqual(true);
                expect(vm.graph.get('nodes').get(0).get('id')).toEqual('a509363624a41e0803fc2aac4f85ba2d');
                expect(vm.graph.get('nodes').get(0).has('label')).toEqual(true);
                expect(vm.graph.get('nodes').get(0).get('label')).toEqual('company');
            });

            it('modifies the edges of a setup, adding "arrows" and "color" keys and values', function () {
                expect(vm.graph.get('edges').get(0).has('arrows')).toEqual(true);
                expect(vm.graph.get('edges').get(0).get('arrows')).toEqual('to');
                expect(vm.graph.get('edges').get(0).has('color')).toEqual(true);
                expect(vm.graph.get('edges').get(0).get('color').equals(Immutable.Map({inherit:'from'}))).toEqual(true);
            });
        });

        describe('vm.restoreSetupData', function () {
            beforeEach(function () {
                vm.graph = vm.modifySetupData(Immutable.fromJS({
                    nodes: graphResponse.nodes,
                    edges: graphResponse.edges
                }));

                vm.graph = vm.restoreSetupData(vm.graph);
            });

            it('restores the nodes and edges of a setup, removing the previously added keys and values', function () {
                expect(vm.graph.get('nodes').get(0).has('id')).toEqual(false);
                expect(vm.graph.get('nodes').get(0).has('label')).toEqual(false);
                expect(vm.graph.get('edges').get(0).has('arrows')).toEqual(false);
                expect(vm.graph.get('edges').get(0).has('color')).toEqual(false);
            });

            it('restores the setup to the exact same as it was before running through modifySetupData', function () {
                expect(vm.graph.equals(Immutable.fromJS({
                    nodes: graphResponse.nodes,
                    edges: graphResponse.edges
                }))).toEqual(true);
            });
        });

        describe('vm.setTableData', function () {
            beforeEach(function () {
                vm.graph = vm.modifySetupData(Immutable.fromJS({
                    nodes: graphResponse.nodes,
                    edges: graphResponse.edges
                }));

                vm.setTableData('a509363624a41e0803fc2aac4f85ba2d');
            });

            it('sets table data', function () {
                expect(vm.hideTable).toEqual(false);
                expect(vm.tableInfo.data).not.toBeUndefined();
                expect(vm.tableInfo.name).toEqual('company');
            });

            it('sets tableInfo.data to a value that does not contain unwantedTableKeys', function () {
                var tableDataKeys = Immutable.fromJS(vm.tableInfo.data).toSet(),
                    intersect = vm.unwantedTableKeys.toSet().intersect(tableDataKeys);
                expect(intersect.isEmpty()).toBe(true);
            });
        });

        describe('vm.drawGraph', function () {
            beforeEach(function () {
                vm.hideFilter = true;
                vm.graph = vm.modifySetupData(Immutable.fromJS({
                    nodes: graphResponse.nodes,
                    edges: graphResponse.edges
                }));

                spyOn(vm, 'createNetwork');
                vm.network = {
                    fit: function() {},
                    getScale: function () {},
                    getViewPosition: function () {},
                    on: function () {}
                };

                spyOn(vm, 'trackEvent');
                vm.drawGraph(vm.graph);

            });

            it('tracks if createNetwork was called', function () {
                expect(vm.createNetwork).toHaveBeenCalled();
                expect(vm.trackEvent).toHaveBeenCalled();
                expect(vm.hideFilter).toBe(false);
                // expect(vm.data.nodes.length).toEqual(vm.graph.get('nodes').size);
                // pending();
            });
        });
    });
});
