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

    });

    window.onresize = function () {
        getWindowHeight(function (height) {
            document.getElementById('inboxToggleLeft').style.height = height + "px";
            document.getElementById('inboxRightWrapper').style.height = height + "px";

        });
    };


    //ticket view object
    $scope.ticketList = [];
    $scope.ticketCountObj = {
        'toDo': 0,
        'new': 0,
        'done': 0,
        inProgress: 0
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
            }
        }
    }();


    //Ticket Inbox
    //private function
    var inboxPrivateFunction = function () {
        return {
            //get all new ticket count
            newTicketListCount: function () {
                //get all new count
                ticketUIFun.loadingNewCount();
                ticketService.getAllCountByTicketStatus('new').then(function (res) {
                    ticketUIFun.loadedNewCount();
                    $scope.ticketCountObj.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.new = res.data.Result;
                    }
                });
            },
            //get all _todo count
            toDoListCount: function () {
                ticketUIFun.loadingToDo();
                ticketService.getAllCountByTicketStatus('toDo').then(function (res) {
                    ticketUIFun.loadedToDo();
                    $scope.ticketCountObj.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.toDo = res.data.Result;
                    }
                });
            },
            inProgressTicketListCount: function () {
                ticketService.getAllCountByTicketStatus('inProgress').then(function (res) {
                    $scope.ticketCountObj.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.inProgress = res.data.Result;
                    }
                });
            },
            pickToDoList: function (page) {
                $scope.ticketList = [];
                ticketService.getNewTickets(page).then(function (response) {

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
                        //console.log($scope.ticketList);
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }
        }
    }();

    inboxPrivateFunction.pickToDoList(1);
    inboxPrivateFunction.toDoListCount();
    inboxPrivateFunction.newTicketListCount();
    inboxPrivateFunction.inProgressTicketListCount();


    $scope.goToTicketList = function () {

    };


//todo test
    $scope.totalItems = 64;
    $scope.currentPage = 4;

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
})
;