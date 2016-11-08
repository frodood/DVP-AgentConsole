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

    $scope.dataRange = [];
    var enumerateDaysBetweenDates = function (startDate, endDate) {
        $scope.dataRange = [];

        var currDate = startDate.add('days', 1).clone().startOf('day');
        var lastDate = endDate.clone().startOf('day');

        while (currDate.add('days', 1).diff(lastDate) < 0) {
            $scope.dataRange.push(currDate.format("DD-MMM"));//$scope.dataRange.push(moment.unix(currDate.clone().toDate()).format("DD-MMM"));
        }
    };
    enumerateDaysBetweenDates(moment().subtract(1, 'month'), moment());

    var randomColorFactor = function () {
        return Math.round(Math.random() * 255);
    };
    var randomColor = function (opacity) {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };

    /* -------------------- Chart Configurations -----------------------------------------*/
    /*Open Vs Close Chart Configurations*/
    $scope.createVsOpenConfig = {
        type: 'line',
        data: {
            labels: $scope.dataRange,
            datasets: [{
                label: "Created Ticket",
                data: [],
                fill: true,
                /*lineTension: 0,*/
                borderDash: [0, 0],
                borderColor: "rgba(0,205,115,1)",
                backgroundColor: "rgba(0,205,115,0.3)",
                pointBorderColor: "rgba(0,205,115,1)",
                pointBackgroundColor: "rgba(0,205,115,0.5)",
                pointBorderWidth: 1
            }, {
                label: "Resolved Ticket",
                data: [],
                fill: true,
                /* lineTension: 0,*/
                borderDash: [0, 0],
                borderColor: "rgba(79,147,0,1)",
                backgroundColor: "rgba(79,147,0,0.5)",
                pointBorderColor: "rgba(79,147,0,1)",
                pointBackgroundColor: "rgba(79,147,0,0.5)",
                pointBorderWidth: 1
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true
            }, tooltips: {
                mode: 'label'
            },
            hover: {
                mode: 'label'
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: "rgba(244,245,244,0.5)",
                        zeroLineColor: "rgba(244,245,244,1)"
                    },
                    ticks: {
                        userCallback: function (dataLabel, index) {
                            return ''; //index % 2 === 0 ? dataLabel : '';
                        }
                    },
                    scaleLabel: {
                        display: false,
                        labelString: 'Days'
                    }
                }],
                yAxes: [{
                    display: true,
                    beginAtZero: false,
                    gridLines: {
                        color: "rgba(244,245,244,0.5)",
                        zeroLineColor: "rgba(244,245,244,1)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Count'
                    }
                }]
            }
        }
    };
    //$.each($scope.createVsOpenConfig.data.datasets, function (i, dataset) {
    //    dataset.borderColor = randomColor(0.4);
    //    dataset.backgroundColor = randomColor(0.5);
    //    dataset.pointBorderColor = randomColor(0.7);
    //    dataset.pointBackgroundColor = randomColor(0.5);
    //    dataset.pointBorderWidth = 1;
    //});

    var openclose = document.getElementById("openclosecanvas").getContext("2d");
    window.opencloseChart = new Chart(openclose, $scope.createVsOpenConfig);

    /* Deference  Chart Configurations*/
    $scope.deferenceConfig = {
        type: 'line',
        data: {
            labels: $scope.dataRange,
            datasets: [{
                label: "Deference",
                data: [],
                fill: true,
                /*lineTension: 0,*/
                borderDash: [0, 0],

            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            },
            title: {
                display: false
            }, tooltips: {
                mode: 'label'
            },
            hover: {
                mode: 'label'
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: "rgba(244,245,244,0)",
                        zeroLineColor: "rgba(244,245,244,1)"
                    },
                    ticks: {
                        userCallback: function (dataLabel, index) {
                            return index % 3 === 0 ? dataLabel : '';
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Days'
                    }
                }],
                yAxes: [{
                    display: true,
                    beginAtZero: false,
                    gridLines: {
                        color: "rgba(244,245,244,0)",
                        zeroLineColor: "rgba(244,245,244,1)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Count'
                    }
                }]
            }
        }
    };
    $.each($scope.deferenceConfig.data.datasets, function (i, dataset) {
        dataset.borderColor = "rgba(230,82,0,1)";
        dataset.backgroundColor = "rgba(230,82,0,0.6)";
        dataset.pointBorderColor = "rgba(74,57,30,1)";
        dataset.pointBackgroundColor = "rgba(230,82,0,0.5)";
        dataset.pointBorderWidth = 1;
    });
    var deference = document.getElementById("deferencecanvas").getContext("2d");
    window.deferenceChart = new Chart(deference, $scope.deferenceConfig);

    /*productivity*/
    $scope.doughnutData = {
        labels: ["Acw", "Break", "OnCall", "Idle", "Hold"],

        datasets: [
            {
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    "#ffa918",
                    "#e65200",
                    "#37dba9",
                    "#8298ae",
                    "#d90000"
                ],
                hoverBackgroundColor: [
                    "#ffa918",
                    "#36A2EB",
                    "#37dba9",
                    "#8298ae",
                    "#d90000"
                ],
                borderWidth: [0, 0, 0, 0, 0],
            }]
    };
    var doughnutChart = document.getElementById("doughnutChart");


    window.myDoughnutChart = new Chart(doughnutChart, {
        type: 'doughnut',
        data: $scope.doughnutData,
        options: {
            responsive: false,
            title: {
                display: false
            },
            legend: {
                display: true,
                position: 'bottom',
                padding: 10,
                labels: {
                    fontColor: 'rgb(130, 152, 174)',
                    fontSize: 15,
                    boxWidth: 50
                }
            }
        }
    });
    doughnutChart.setAttribute("style", "width: 300px;height: 300px;margin-top: 15px;");

    /* -------------------- Chart Configurations End-----------------------------------------*/

    function secondToHours(seconds) {
        return (seconds / 3600).toFixed(2);
    }

    $scope.productivity = {};
    var loadProductivity = function (id) {
        dashboradService.ProductivityByResourceId(id).then(function (response) {
            if (response) {

                if (response.length === 0)
                    return;
                $scope.doughnutData.datasets[0].data = [secondToHours(response.AcwTime), secondToHours(response.BreakTime),
                    secondToHours(response.OnCallTime), secondToHours(response.IdleTime), secondToHours(response.HoldTime)];
                window.myDoughnutChart.update();


                $scope.productivity.OnCallTime = response.OnCallTime.toString().toHHMMSS();
                $scope.productivity.StaffedTime = response.StaffedTime.toString().toHHMMSS();
                $scope.productivity.BreakTime = response.BreakTime.toString().toHHMMSS();
                $scope.productivity.IncomingCallCount = response.IncomingCallCount;
                $scope.productivity.MissCallCount = response.MissCallCount;
                $scope.productivity.TransferCallCount = response.TransferCallCount;
            } else {
                $scope.showAlert("Productivity", "error", "Fail To Load Productivity.");
            }

        }, function (err) {
            $scope.showAlert("Productivity", "error", "Fail To Load Productivity.");
        });
    };
    loadProductivity(authService.GetResourceId());

    $scope.newTicketCount = 0;
    var GetOpenTicketCount = function () {
        dashboradService.GetTotalTicketCount('NEWTICKET').then(function (response) {
            $scope.newTicketCount = response;
        }, function (err) {
            $scope.newTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetOpenTicketCount();

    $scope.closeTicketCount = 0;
    var GetResolveTicketCount = function () {
        dashboradService.GetTotalTicketCount('CLOSEDTICKET').then(function (response) {
            $scope.closeTicketCount = response;
        }, function (err) {
            $scope.closeTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetResolveTicketCount();

    var GetCreatedicketSeries = function () {
        dashboradService.GetCreatedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.createVsOpenConfig.data.datasets[0].data = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
                window.opencloseChart.update();
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetCreatedicketSeries();

    var GetResolvedTicketSeries = function () {
        dashboradService.GetResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.createVsOpenConfig.data.datasets[1].data = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
                window.opencloseChart.update();
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetResolvedTicketSeries();

    var GetDeferenceResolvedTicketSeries = function () {
        dashboradService.GetDeferenceResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.deferenceConfig.data.datasets[0].data = response.map(function (c, index) {
                    return c[0] ? Math.ceil(c[0]) : 0;
                });
                window.deferenceChart.update();
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

