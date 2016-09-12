/**
 * Created by Damith on 9/12/2016.
 */
agentApp.controller('mailInboxCtrl', function ($scope, $http) {


    $scope.clickMoreEmailDetails = function () {

        $('#emailDescView').animate({right: "0"}, 300);
    }

    $scope.closeMailDesc = function () {
        $('#emailDescView').animate({right: "-100%"}, 300);
    }

});