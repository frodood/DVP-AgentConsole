/**
 * Created by Damith on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope) {

    $scope.pieDataset = [];
    $scope.pieOptions = {
        series: {
            pie: {
                show: true
            }
        }
    };

    var pieSeries = Math.floor(Math.random() * 6) + 3;

    for (i = 0; i < pieSeries; i++) {
        $scope.pieDataset[i] = {
            label: 'Series' + (i + 1),
            data: Math.floor(Math.random() * 100) + 1
        };
    }



    $scope.myData = [{
        data: [[5, 1], [15, 10], [17, 20], [30, 25]],
        lines: {
            fill: false,
            lineWidth: 1,
            color: '#63a5a2'
        }
    },{
        data: [[5, 6], [15, 33], [17, 23], [30, 66]],
        lines: {
            fill: true,
            lineWidth: 1,
            color: '#63a5a2'
        }
    }];
    $scope.myChartOptions = {
        grid: {
            borderWidth: 1,
            borderColor: '#f7f5f5 ',
            show: true
        },
        series: {
            lines: {show: true, fill: true, color: "#114858"},
            points: {show: true},
        },
        color: {color: '#63a5a2'},
        legend: {
            show: true
        },
        yaxis: {
            min: 0,
            color: '#f7f5f5'
        }, xaxis: {
            color: '#f7f5f5'
        }
    };


    /*
    //call status
    $scope.callStatus = [];
    getJSONData($http, 'callStatus', function (data) {
        $scope.callStatus = data;
    });
*/


});


//[{ data: [], yaxis: 1, label: 'sin' }
//legend: {container: '#legend',show: true}
/*


 legend: {
 container: '#legend',
 show: true
 }

 */