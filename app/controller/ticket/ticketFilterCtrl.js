/**
 * Created by Damith on 9/9/2016.
 */

agentApp.controller('ticketFilterCtrl', function ($scope, $http) {

    getJSONData($http, 'filters', function (data) {
        $scope.views = data;
    });

    $scope.clickViewsDetails = function (data) {
       
    }
});