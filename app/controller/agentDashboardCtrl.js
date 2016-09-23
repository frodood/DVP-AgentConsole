/**
 * Created by Damith on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope, $http) {

    $scope.dataset = [];
    $scope.options = {};


    //call status
    $scope.callStatus = [];
    getJSONData($http, 'callStatus', function (data) {
        $scope.callStatus = data;
    });



});


//[{ data: [], yaxis: 1, label: 'sin' }
//legend: {container: '#legend',show: true}
/*


 legend: {
 container: '#legend',
 show: true
 }

 */