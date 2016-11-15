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

    $scope.isProgress = false;
    $scope.isNoData = false;
    $scope.clickViewsDetails = function (data) {
        $scope.isProgress = true;
        $scope.ticketList = [];
        $scope.isNoData = false;
        ticketService.GetTicketsByView(data._id).then(function (response) {
            $scope.isProgress = false;
            $scope.ticketList = response;
            if (!response || response.length === 0) {
                $scope.isNoData = true;
            }
            else {
                $scope.isNoData = false;
            }
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