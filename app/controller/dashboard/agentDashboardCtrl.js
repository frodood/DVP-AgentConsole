/**
 * Created by team verry on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope, $rootScope, $http, $timeout, dashboradService, ticketService, engagementService, profileDataParser, authService) {


    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: false
        });
    };

    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    };


    $scope.dataTest = {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };

    $scope.pieDataset = [0, 0, 0, 0, 0];
    $scope.productivity = {};

    // Doughnut Chart Options
    $scope.labels = ["Acw", "Break", "OnCall", "Idle", "Hold"];
    $scope.type = 'doughnut';
    $scope.doughnutoptions = {
        legend: {display: true},
        segmentShowStroke: true,
        animationSteps: 10,
        animationEasing: "linear",
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    var total = 0;
                    for (var i in allData) {
                        total += allData[i];
                    }
                    if (total == 0)
                        return tooltipLabel + ': ' + tooltipData + ' (' + 0 + '%)';
                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
                    return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                }
            }
        }
    };

    $scope.toggle = function () {
        $scope.type = $scope.type === 'polarArea' ?
            'doughnut' : 'polarArea';
    };

    $scope.dataRange = [];
    var enumerateDaysBetweenDates = function (startDate, endDate) {
        $scope.dataRange = [];

        var currDate = startDate.clone().startOf('day');
        var lastDate = endDate.add('days', 1).clone().startOf('day');

        while (currDate.add('days', 1).diff(lastDate) < 0) {
            $scope.dataRange.push(currDate.format("DD-MMM"));//$scope.dataRange.push(moment.unix(currDate.clone().toDate()).format("DD-MMM"));
        }
    };
    enumerateDaysBetweenDates(moment().subtract(1, 'month'), moment());


    // line chat open vs Close
    $scope.colors = [
        { // grey
            backgroundColor: 'rgba(0,128,0,0.2)',
            pointBackgroundColor: 'rgba(0,128,0,1)',
            pointHoverBackgroundColor: 'rgba(0,128,0,1)',
            borderColor: 'rgba(0,128,0,1)',
            pointBorderColor: '#3333ff',
            pointHoverBorderColor: 'rgba(0,128,0,0.8)',
            /*fillColor: 'rgba(47, 132, 71, 0.8)',
             strokeColor: 'rgba(47, 132, 71, 0.8)',
             highlightFill: 'rgba(47, 132, 71, 0.8)',
             highlightStroke: 'rgba(47, 132, 71, 0.8)'*/
        },
        { // dark grey
            backgroundColor: 'rgba(0,0,128,0.2)',
            pointBackgroundColor: 'rgba(0,0,128,1)',
            pointHoverBackgroundColor: 'rgba(0,0,128,1)',
            borderColor: 'rgba(0,0,128,1)',
            pointBorderColor: '#cc00ff',
            pointHoverBorderColor: 'rgba(0,0,128,0.8)'
        }
    ];
    $scope.openCloseSeries = ['Open', 'Close'];
    $scope.openCloseData = [
        [],
        []
    ];
    $scope.datasetOverride = [];
    $scope.options = {
        fill: false,
        datasetFill: true,
        lineTension: 0,
        pointRadius: 0,
        /*title: {
         display: true,
         text: 'OPEN VS CLOSE'
         },*/
        scales: {
            yAxes: [
                {
                    id: 'Open',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'Open',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };

    var loadProductivity = function (id) {
        dashboradService.ProductivityByResourceId(id).then(function (response) {
            if (response) {

                if (response.length === 0)
                    return;
                $scope.pieDataset = [response.AcwTime, response.BreakTime, response.OnCallTime, response.IdleTime, response.HoldTime];

                /*$scope.pieDataset = [
                 {
                 value: response.BreakTime,
                 color:"#F7464A",
                 highlight: "#FF5A5E",
                 label: "Red"
                 },
                 {
                 value: response.IdleTime,
                 color: "#46BFBD",
                 highlight: "#5AD3D1",
                 label: "Green"
                 },
                 {
                 value: response.AcwTime,
                 color: "#FDB45C",
                 highlight: "#FFC870",
                 label: "Yellow"
                 },
                 {
                 value: response.OnCallTime,
                 color: "#949FB1",
                 highlight: "#A8B3C5",
                 label: "Grey"
                 },
                 {
                 value: response.HoldTime,
                 color: "#4D5360",
                 highlight: "#616774",
                 label: "Dark Grey"
                 }

                 ];*/


                $scope.productivity.OnCallTime = response.OnCallTime.toString().toHHMMSS();
                $scope.productivity.StaffedTime = response.StaffedTime.toString().toHHMMSS();
                $scope.productivity.BreakTime = response.BreakTime.toString().toHHMMSS();
            } else {
                $scope.showAlert("Productivity", "error", "Fail To Load Productivity.");
            }

        }, function (err) {
            $scope.showAlert("Productivity", "error", "Fail To Load Productivity.");
        });
    };
    loadProductivity(authService.GetResourceId());

    $scope.openTicketCount = 0;
    var GetOpenTicketCount = function () {
        dashboradService.GetTotalTicketCount('OPENTICKET').then(function (response) {
            $scope.openTicketCount = response;
        }, function (err) {
            $scope.openTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetOpenTicketCount();

    $scope.resolveTicketCount = 0;
    var GetResolveTicketCount = function () {
        dashboradService.GetTotalTicketCount('SOLVEDTICKET').then(function (response) {
            $scope.resolveTicketCount = response;
        }, function (err) {
            $scope.resolveTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetResolveTicketCount();

    var GetCreatedicketSeries = function () {
        dashboradService.GetCreatedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.openCloseData[0] = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetCreatedicketSeries();

    var GetResolvedTicketSeries = function () {
        dashboradService.GetResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.openCloseData[1] = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetResolvedTicketSeries();

    // line chat deference
    $scope.defColors = [
        { // grey
            backgroundColor: 'rgba(128,0,128,0.6)',
            pointBackgroundColor: 'rgba(128,0,128,1)',
            pointHoverBackgroundColor: 'rgba(128,0,128,1)',
            borderColor: 'rgba(128,0,128,0.5)',
            pointBorderColor: '#fff',
            pointHoverBorderColor: 'rgba(128,0,128,0.8)'
        }
    ];
    $scope.defoptions = {
        fill: false,
        datasetFill: false,
        lineTension: 0,
        pointRadius: 0,
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
    $scope.data = [
        []
    ];

    var GetDeferenceResolvedTicketSeries = function () {
        dashboradService.GetDeferenceResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {

                $scope.data[0] = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetDeferenceResolvedTicketSeries();

    $scope.queueDetails = [];
    var GetQueueDetails = function () {
        dashboradService.GetQueueDetails().then(function (response) {
            $scope.queueDetails = response;
        }, function (err) {
            $scope.queueDetails = [];
            $scope.showAlert("Queue Details", "error", "Fail To Load Queue Details.");
        });
    };
    GetQueueDetails();

    $scope.recentTickets = [];
    var GetMyRecentTickets = function () {
        ticketService.GetMyRecentTickets().then(function (response) {
            $scope.recentTickets = response;
        }, function (err) {
            $scope.showAlert("Ticket Details", "error", "Fail To Load Ticket Details.");
        });
    };
    GetMyRecentTickets();

    $scope.recentEngagements = [];
    var GetMyRecentEngagements = function () {
        engagementService.GetEngagementSessions(1111, profileDataParser.RecentEngagements).then(function (response) {
            $scope.recentEngagements = response;
        }, function (err) {
            $scope.showAlert("Engagement Details", "error", "Fail To Load Recent Engagements.");
        });
    };
    GetMyRecentEngagements();

    $scope.viewTicket = function (data) {
        data.tabType = 'ticketView';
        data.index = data.reference;
        $rootScope.$emit('openNewTab', data);
    };

    $scope.pieOptions = {
        series: {
            pie: {
                innerRadius: 0.5,
                show: true,
                stroke: {color: '#15315a'},
                background: {color: '#1c3ffd'},
                /*combine: {
                 color: '#761602',
                 threshold:0.01
                 },
                 label: {
                 show: true,
                 threshold: 0
                 }*/
            }
        },
        legend: {
            show: false
        },
        grid: {
            hoverable: true,
            clickable: true
        }
    };


    /*$scope.pieOptions = {
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
     };*/

    var loadGrapData = function () {
        GetDeferenceResolvedTicketSeries();
        GetResolvedTicketSeries();
        GetCreatedicketSeries();
        loadProductivity(authService.GetResourceId());
    };
    var loadGrapDataTimer = $timeout(loadGrapData, $scope.refreshTime * 36000);

    var loadRecentData = function () {
        GetMyRecentEngagements();
        GetMyRecentTickets();
        GetOpenTicketCount();
        GetResolveTicketCount();
        loadProductivity(authService.GetResourceId());
    };
    var loadRecentDataTimer = $timeout(loadRecentData, $scope.refreshTime * 300);

    var getAllRealTime = function () {
        GetQueueDetails();
        getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
    };

    var getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);

    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
        if (loadRecentDataTimer) {
            $timeout.cancel(loadRecentDataTimer);
        }
        if (loadGrapDataTimer) {
            $timeout.cancel(loadGrapDataTimer);
        }
    });
    $scope.refreshTime = 1000;
});

