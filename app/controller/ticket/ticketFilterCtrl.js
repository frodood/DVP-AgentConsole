/**
 * Created by Damith on 9/9/2016.
 */

agentApp.controller('ticketFilterCtrl', function ($scope, $http, ticketService) {

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

    $scope.loadTicketViews = function () {

        ticketService.GetTicketViews().then(function (response) {

            $scope.views = response;

        }, function (err) {

            $scope.showAlert("load Views", "error", "Fail To Load View List.")
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
            $scope.isNoData = !response;
        }, function (err) {
            $scope.isProgress = false;
            $scope.showAlert("load Tickets", "error", "Fail To Load Tickets List.")
        });

    }
});