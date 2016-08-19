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


});
