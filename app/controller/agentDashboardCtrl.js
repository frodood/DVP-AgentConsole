/**
 * Created by Damith on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope, $http) {

    $scope.pieDataset = [];
    $scope.pieOptions = {
        series: {
            pie: {
                innerRadius: 0.5,
                show: true,
                stroke: {color: '#15315a'},
                background: {color: '#1c3ffd'},
            }
        },
        legend: {
            show: false
        }
    };

    var pieSeries = Math.floor(Math.random() * 6) + 3;

    for (var i = 0; i < pieSeries; i++) {
        $scope.pieDataset[i] = {
            label: 'Series' + (i + 1),
            data: Math.floor(Math.random() * 100) + 1
        };
    }


    $scope.myData = [{
        data: [[5, 1], [15, 10], [17, 20], [30, 25]],
        lines: {
            fill: true,
            lineWidth: 1,
            color: '#15315a'
        }
    }, {
        data: [[5, 6], [15, 33], [17, 23], [30, 66]],
        lines: {
            fill: true,
            lineWidth: 1,
            color: '#15315a'
        }
    }];
    $scope.myChartOptions = {
        grid: {
            borderWidth: 1,
            borderColor: '#15315a',
            show: true
        },
        series: {
            lines: {show: true, fill: false, color: "#114858"},
            points: {show: true},
            shadowSize: 0, color: "#db4114"
        },
        color: {color: '#63a5a2'},
        legend: {
            show: true,
        },
        yaxis: {
            min: 0,
            color: '#0f2544',
            font: {color: '#15a9fa'}
        }, xaxis: {
            color: '#0f2544',
            font: {color: '#15a9fa'}
        }
    };

    $scope.myData2 = [{
        data: [[5, 1], [15, 10], [17, 20], [30, 25]],
        lines: {
            fill: true,
            lineWidth: 1,
            color: '#15315a',
            font: {color: '#63a5a2'}
        }
    }];
    $scope.myChartOptions2 = {
        grid: {
            borderWidth: 1,
            borderColor: '#15315a',
            show: true
        },
        series: {
            lines: {show: true, fill: false, color: "#1c3ffd"},
            points: {show: true},
            shadowSize: 0, color: "#1c3ffd"
        },
        color: {color: '#1c3ffd'},
        legend: {
            show: true
        },
        yaxis: {
            min: 0,
            color: '#0f2544',
            font: {color: '#15a9fa'}
        }, xaxis: {
            color: '#0f2544',
            font: {color: '#15a9fa'}
        }
    };


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