/**
 * Created by Veery Team on 9/9/2016.
 */

agentApp.controller('ticketFilterCtrl', function ($scope, $http, $rootScope, ticketService, authService, $state) {

    /*getJSONData($http, 'filters', function (data) {
     $scope.views = data;
     });*/

    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: false
        });
    };

    $scope.setUserTitles = function (userObj) {

        var title="";


        if(userObj.firstname && userObj.lastname)
        {
            title=userObj.firstname+" "+ userObj.lastname;
        }
        else
        {
            if(userObj.firstname)
            {
                title=userObj.firstname;
            }
            else if(userObj.lastname)
            {
                title=userObj.lastname;
            }
            else
            {
                title=userObj.name;
            }

        }

        return title;
    }

    var getTicketViewCount = function (item, e) {
        item.count = 0;
        ticketService.GetTicketCountByView(item._id).then(function (response) {
            item.count = response;
            //$filter('filter')($scope.views, {_id: item._id},true)[0].count=response;
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert("Get View Count", "error", "Fail To Count.")
        });
    };

    $scope.loadTicketViews = function (e) {
        ticketService.GetTicketViews().then(function (response) {
            $scope.views = response;
            angular.forEach($scope.views, function (item) {
                getTicketViewCount(item);
            });
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert("load Views", "error", "Fail To Load View List.");
        });
    };
    $scope.loadTicketViews();

    $scope.currentPage = "1";
    $scope.pageTotal = "1";
    $scope.pageSize = "100";
    $scope.getPageData = function (Paging, page, pageSize, total) {

        $scope.isProgress = true;
        $scope.ticketList = [];
        $scope.isNoData = false;
        ticketService.GetTicketsByView($scope.filterId,page).then(function (response) {
            $scope.isProgress = false;
            $scope.ticketList = response;
            $scope.showPaging = true;
            $scope.isNoData = !response || response.length === 0;
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.isProgress = false;
            $scope.showAlert("load Tickets", "error", "Fail To Load Tickets List.")
        });

    };


    $scope.isProgress = false;
    $scope.isNoData = false;
    $scope.showPaging = false;
    $scope.filterId = 0;
    $scope.clickViewsDetails = function (data) {
        $scope.pageSize = "100";
        $scope.pageTotal = data.count;
        $scope.currentPage = 1;
        $scope.filterId = data._id;

        $scope.isProgress = true;
        $scope.ticketList = [];
        $scope.isNoData = false;
        ticketService.GetTicketsByView(data._id,$scope.currentPage).then(function (response) {
            $scope.isProgress = false;
            $scope.ticketList = response;

            angular.forEach($scope.ticketList, function (ticket) {

                if(ticket.submitter)
                {
                    ticket.submitter.displayname= $scope.setUserTitles(ticket.submitter);
                }

                else
                {
                   ticket.submitter.displayname="Unassigned";
                }

                if(ticket.requester)
                {
                    ticket.requester.displayname= $scope.setUserTitles(ticket.requester);
                }

            });


            $scope.showPaging = true;
            $scope.isNoData = !response || response.length === 0;
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.isProgress = false;
            $scope.showAlert("load Tickets", "error", "Fail To Load Tickets List.")
        });

    };

    // open tab for specific ticket
    $scope.viewSpecificTicket = function (data) {
        data.tabType = 'ticketView';
        $rootScope.$emit('openNewTab', data);
    }

});