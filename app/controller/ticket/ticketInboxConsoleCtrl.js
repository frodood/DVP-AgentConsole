agentApp.controller('ticketInboxConsoleCtrl', function ($scope, $rootScope, mailInboxService,
                                                        profileDataParser, authService, $http,
                                                        $anchorScroll, ticketService) {



    //ticket inbox

    $anchorScroll();
    //update new UI code
    var getWindowHeight = function (callback) {
        var height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        return callback(height);
    };
    getWindowHeight(function (height) {
        document.getElementById('inboxToggleLeft').style.height = height + "px";
        document.getElementById('inboxRightWrapper').style.height = height + "px";
        document.getElementById('ticketListView').style.height = height - 220 + "px";
        $scope.mainScrollerHeight = height + "px";
        $scope.ticketListHeight = height - 220 + "px";

    });

    window.onresize = function () {
        getWindowHeight(function (height) {
            document.getElementById('inboxToggleLeft').style.height = height + "px";
            document.getElementById('inboxRightWrapper').style.height = height + "px";
            document.getElementById('ticketListView').style.height = height - 220 + "px";
            $scope.ticketListHeight = height - 220 + "px";

            $scope.ticketListHeight = height - 220 + "px";

        });
    };

    //all left toggle up
    $scope.isCollapsedMyTicket = true;
    $scope.isCollapsedGroupTicketr = true;
    $scope.isCollapsedFilter = true;


    //ticket view object
    $scope.ticketList = [];
    $scope.currentSelected = {
        "name": '',
        "totalCount": ''
    };

    $scope.ticketCountObj = {
        'toDo': 0,
        'new': 0,
        'done': 0,
        'inProgress': 0,
        myTicket: {
            'myToDo': 0,
            'myNew': 0,
            'myDone': 0,
            'myInProgress': 0
        },
        myGroup: {
            'toDo': 0,
            'new': 0,
            'done': 0,
            'inProgress': 0
        }
    };
    var ticketListObj = {
        '_id': '',
        'subject': '',
        'channel': '',
        'priority': '',
        'status': '',
        'type': '',
        'updated_at': '',
        'submitter_name': '',
        'submitter_avatar': ''
    };


    //UI funtion
    //ticket inbox UI funtion

    var ticketUIFun = function () {
        return {
            loadingMainloader: function () {
                $('#ticketMainLoader').removeClass('display-none');
            },
            loadedMainLoader: function () {
                $('#ticketMainLoader').addClass('display-none');
            },
            loadingNewCount: function () {
                $('#newCountLoaded').addClass('display-none');
                $('#newCountLoading').removeClass('display-none');
            },
            loadedNewCount: function () {
                $('#newCountLoaded').removeClass('display-none');
                $('#newCountLoading').addClass('display-none');
            },
            loadingToDo: function () {
                $('#toDoCountLoaded').addClass('display-none');
                $('#todoCountLoading').removeClass('display-none');
            },
            loadedToDo: function () {
                $('#toDoCountLoaded').removeClass('display-none');
                $('#todoCountLoading').addClass('display-none');
            },
            loadingInProgress: function () {
                $('#inProgressCountLoaded').addClass('display-none');
                $('#inProgressCountLoading').removeClass('display-none');
            },
            loadedInProgress: function () {
                $('#inProgressCountLoaded').removeClass('display-none');
                $('#inProgressCountLoading').addClass('display-none');
            },
            loadingDone: function () {
                $('#doneCountLoaded').addClass('display-none');
                $('#doneCountLoading').removeClass('display-none');
            },
            loadedDone: function () {
                $('#doneCountLoaded').removeClass('display-none');
                $('#doneCountLoading').addClass('display-none');
            }

        }
    }();


    //Ticket Inbox
    //private function
    var inboxPrivateFunction = function () {
        return {
            //get all new ticket count
            newTicketListCount: function (status) {
                //new count
                ticketUIFun.loadingNewCount();
                ticketService.getAllCountByTicketStatus('new').then(function (res) {
                    ticketUIFun.loadedNewCount();
                    $scope.ticketCountObj.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;

                    }
                });
            },
            toDoListCount: function () {
                //todo ticket
                ticketUIFun.loadingToDo();
                ticketService.getAllCountByTicketStatus('open&status=progressing').then(function (res) {
                    ticketUIFun.loadedToDo();
                    $scope.ticketCountObj.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            inProgressTicketListCount: function () {
                //progressing ticket
                ticketUIFun.loadingInProgress();
                ticketService.getAllCountByTicketStatus('progressing').then(function (res) {
                    ticketUIFun.loadedInProgress();
                    $scope.ticketCountObj.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            doneTicketListCount: function () {
                //closed ticket
                ticketUIFun.loadingDone();
                ticketService.getAllCountByTicketStatus('parked&status=solved&status=closed').then(function (res) {
                    ticketUIFun.loadedDone();
                    $scope.ticketCountObj.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //get count my ticket
            myTicketNewTicketCount: function () {
                //new ticket
                ticketService.getAllCountByMyticketStatus('new').then(function (res) {
                    $scope.ticketCountObj.myTicket.myNew = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myNew = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            }, myTicketToDoTicketCount: function () {
                //todo
                ticketService.getAllCountByMyticketStatus('open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.myTicket.myToDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myToDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            myTicketInProgressTicketCount: function () {
                //progressing
                ticketService.getAllCountByMyticketStatus('progressing').then(function (res) {
                    $scope.ticketCountObj.myTicket.myInProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myInProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            myTicketDoneTicketCount: function () {
                //closed ticket
                ticketService.getAllCountByMyticketStatus('parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.myTicket.myDone = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myDone = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //get count my group
            groupTicketNewTicketCount: function () {
                //new ticket
                ticketService.getCountByMyGroupStatus('new').then(function (res) {
                    $scope.ticketCountObj.myGroup.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketToDoTicketCount: function () {
                //progressing
                ticketService.getCountByMyGroupStatus('open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.myGroup.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketProgressingTicketCount: function () {
                //progressing
                ticketService.getCountByMyGroupStatus('progressing').then(function (res) {
                    $scope.ticketCountObj.myGroup.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketClosedicketCount: function () {
                ticketService.getCountByMyGroupStatus('parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.myGroup.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //ticket filter
            getTicketFilterCount: function (item, e) {
                item.count = 0;
                ticketService.GetTicketCountByView(item._id).then(function (response) {
                    item.count = response;
                    //$filter('filter')($scope.views, {_id: item._id},true)[0].count=response;
                }, function (err) {
                    authService.IsCheckResponse(err);
                    $scope.showAlert("Get View Count", "error", "Fail To Count.")
                });
            },
            picketTicketInboxList: function (page, status) {
                $scope.ticketList = [];
                ticketUIFun.loadingMainloader();
                ticketService.getTicketByStatus(page, status).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response && response.data && response.data.Result) {
                        $scope.ticketList = response.data.Result.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            ticketListObj.submitter_name = item.submitter.name;
                            ticketListObj.submitter_avatar = item.submitter.avatar;
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }, picketMyTicketInboxList: function (page, status) {
                ticketUIFun.loadingMainloader();
                ticketService.getAllByMytickes(page, status).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response && response.data && response.data.Result) {
                        $scope.ticketList = response.data.Result.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            ticketListObj.submitter_name = item.submitter.name;
                            ticketListObj.submitter_avatar = item.submitter.avatar;
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }, picketMyGroupTicketInboxList: function (page, status) {
                //get all my ticket
                ticketUIFun.loadingMainloader();
                ticketService.getAllMyGroupTickets(page, status).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response && response.data && response.data.Result) {
                        $scope.ticketList = response.data.Result.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            ticketListObj.submitter_name = item.submitter.name;
                            ticketListObj.submitter_avatar = item.submitter.avatar;
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            },
            picketFilterInboxList: function (currentFilter, page) {
                ticketUIFun.loadingMainloader();
                ticketService.GetTicketsByView(currentFilter._id, page).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response) {
                        $scope.ticketList = response.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            ticketListObj.submitter_name = item.submitter.name;
                            ticketListObj.submitter_avatar = item.submitter.avatar;
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }
        }
    }();


    //inbox count
    inboxPrivateFunction.toDoListCount();
    inboxPrivateFunction.newTicketListCount();
    inboxPrivateFunction.inProgressTicketListCount();
    inboxPrivateFunction.doneTicketListCount();

    //my ticket inbox count
    inboxPrivateFunction.myTicketNewTicketCount();
    inboxPrivateFunction.myTicketToDoTicketCount();
    inboxPrivateFunction.myTicketInProgressTicketCount();
    inboxPrivateFunction.myTicketDoneTicketCount();


    //my Group inbox count
    inboxPrivateFunction.groupTicketNewTicketCount();
    inboxPrivateFunction.groupTicketToDoTicketCount();
    inboxPrivateFunction.groupTicketProgressingTicketCount();
    inboxPrivateFunction.groupTicketClosedicketCount();


    //myTicket inbox
    //$scope.onClickMyTicket = function () {

    //};


    $scope.openTicketView = function (_viewType, _selectedViewObj, selectedFilter, page, clickEvent) {
        $scope.ticketList = [];
        $scope.currentSelected.name = _viewType;
        $scope.currentSelected.totalCount = _selectedViewObj;

        if (clickEvent != 'goToPage') {
            page = 1;
            $scope.currentPage = page;
        } else {
            page = page ? page : '1';
        }

        switch (_viewType) {
            //ticket inbox
            case 'new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new');
                break;
            case 'todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing');
                break;
            case 'progressing':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing');
                break;
            case 'done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed');
                break;
            //my  ticket
            case 'myNew':
                inboxPrivateFunction.picketMyTicketInboxList(page, 'new');
                break;
            case 'myOpen':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing');
                break;
            case 'myProgressing':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing');
                break;
            case 'myDone':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed');
                break;
            //my Group ticket
            case 'myGroupNew':
                inboxPrivateFunction.picketMyGroupTicketInboxList(page, 'new');
                break;
            case 'myGroupToDo':
                inboxPrivateFunction.picketMyGroupTicketInboxList(page, 'open&status=progressing');
                break;
            case 'myGroupInProgress':
                inboxPrivateFunction.picketMyGroupTicketInboxList(page, 'progressing');
                break;
            case 'myGroupDone':
                inboxPrivateFunction.picketMyGroupTicketInboxList(page, 'parked&status=solved&status=closed');
                break;
            //ticket filter
            case 'filter':
                $scope.selectedFilter = selectedFilter;
                inboxPrivateFunction.picketFilterInboxList(selectedFilter, page);
                break;

        }
    };

    //init load todoList
    $scope.openTicketView('todo', $scope.ticketCountObj.toDo, '', 1);


    //ticket filter


    $scope.loadTicketFilterViews = function (e) {
        ticketService.GetTicketViews().then(function (response) {
            $scope.views = response;
            angular.forEach($scope.views, function (item) {
                inboxPrivateFunction.getTicketFilterCount(item);
            });
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert("load Views", "error", "Fail To Load View List.");
        });
    };
    $scope.loadTicketFilterViews();


    //ticket list pagination
    // $scope.getPageData = function () {
    //    // console.log($scope.currentPage);
    //
    //     $scope.openTicketView($scope.currentSelected.name,
    //         $scope.currentSelected.totalCount,
    //         '',
    //         $scope.currentPage, )
    // };


    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.goToPagination = function () {
        $scope.openTicketView($scope.currentSelected.name,
            $scope.currentSelected.totalCount, $scope.selectedFilter,
            $scope.currentPage, 'goToPage');
    };

//todo test


    getJSONData($http, 'filters', function (data) {
        $scope.jsonFilterObj = data;
    });
    getJSONData($http, 'inboxFilters', function (data) {
        $scope.jsonInboxObj = data;
    });

    getJSONData($http, 'toDo', function (data) {
        $scope.jsonToDoObj = data;
    });

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.Items, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };

    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length / $scope.pageSize);
    };

    // for (var i = 0; i < 65; i++) {
    //     $scope.data.push("Item " + i);
    // };


}).filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
