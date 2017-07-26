agentApp.controller('ticketInboxConsoleCtrl', function ($scope, $rootScope, mailInboxService,
                                                        profileDataParser, authService, $http,
                                                        $anchorScroll, ticketService) {



    //ticket inbox

    $anchorScroll();


    //ticket view object
    $scope.ticketList = [];
    var ticketListObj = {
        "assignee": '',
        "subject": '',
        "priority": '',
        "status": '',
        "created": '',
        "channel": ''
    };


    //UI funtion
    //ticket inbox UI funtion

    var ticketUIFun = function () {
        return {
            loadingToDo: function () {
                $('#toDoCount').addClass('display-none');
                $('#todoCountLoading').removeClass('display-none');
            },
            loadedToDo: function () {
                $('#toDoCount').removeClass('display-none');
                $('#todoCountLoading').addClass('display-none');
            }
        }
    }();


    //Ticket Inbox
    //private function

    var inboxPrivateFunction = function () {
        return {
            pickToDoList: function (page) {
                ticketUIFun.loadingToDo();
                ticketService.getNewTickets(page).then(function (response) {
                    ticketUIFun.loadedToDo();
                    if (response &&  response.data && response.data.Result) {
                        console.log(response.data.Result);
                        console.log('done todo list open');
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }
        }
    }();

    inboxPrivateFunction.pickToDoList(1);


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
    }

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