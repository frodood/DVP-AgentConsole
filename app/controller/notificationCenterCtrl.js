/**
 * Created by Damith on 9/8/2016.
 */

agentApp.controller('notificationCenterCtrl', function ($scope, $http) {

    $scope.closeNav = function () {
        closeNav();
    }

    $scope.showMessageBlock = function () {
        divModel.model('#sendMessage', 'display-block');
    };
    $scope.closeMessage = function () {
        divModel.model('#sendMessage', 'display-none');
    }
});
