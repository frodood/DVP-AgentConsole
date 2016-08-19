/**
 * Created by Damith on 8/19/2016.
 */


agentApp.controller('ticketCtrl', function ($scope, $http) {

    $scope.ticketList = {
        toDo: [],
        inProgress: [],
        done: []
    };
    getJSONData($http, 'toDo', function (data) {
        $scope.ticketList.toDo = data;
    });
    getJSONData($http, 'InProgress', function (data) {
        $scope.ticketList.inProgress = data;
    });
    getJSONData($http, 'done', function (data) {
        $scope.ticketList.done = data;
    });

    $scope.gotoTicket = function (id) {
        alert(id);
    }

    $scope.closeTicketInbox = function () {
        $('#mainTicketWrapper').addClass('display-none').
        removeClass('display-block fadeIn');

    }


});