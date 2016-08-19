/**
 * Created by Damith on 8/16/2016.
 */

agentApp.controller('consoleCtrl', function ($scope, $http) {

    $scope.notifications = [];
    $scope.agentList = [];
    getJSONData($http, 'notification', function (data) {
        $scope.notifications = data;
    });

    getJSONData($http, 'userList', function (data) {
        $scope.agentList = data;
    });

    $scope.status = {
        isopen: false
    };

    /*# console top menu */
    $scope.consoleTopMenu = {
        openTicket: function () {
            $('#mainTicketWrapper').addClass('z-index-0 display-block fadeIn').
            removeClass('display-none zoomOut');
        }
    }


});
