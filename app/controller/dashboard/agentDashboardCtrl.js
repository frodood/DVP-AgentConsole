/**
 * Created by team verry on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope,$rootScope, $http, dashboradService,ticketService,engagementService,profileDataParser, authService) {

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
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    };

    $scope.pieDataset = [];
    $scope.productivity = {};

    var loadProductivity = function (id) {
        dashboradService.ProductivityByResourceId(id).then(function (response) {
            if (response) {
                $scope.productivity = response;
                $scope.pieDataset.push({
                    label: 'Acw',
                    data: response.AcwTime
                });
                $scope.pieDataset.push({
                    label: 'Break',
                    data: response.BreakTime
                });
                $scope.pieDataset.push({
                    label: 'OnCall',
                    data: response.OnCallTime
                });
                $scope.pieDataset.push({
                    label: 'Idle',
                    data: response.IdleTime
                });
                $scope.pieDataset.push({
                    label: 'Hold',
                    data: response.HoldTime
                });

                $scope.productivity.OnCallTime=response.OnCallTime.toString().toHHMMSS();
                $scope.productivity.StaffedTime=response.StaffedTime.toString().toHHMMSS();
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
        }, function (err) { $scope.openTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetOpenTicketCount();

    $scope.resolveTicketCount = 0;
    var GetResolveTicketCount = function () {
        dashboradService.GetTotalTicketCount('SOLVEDTICKET').then(function (response) {
            $scope.resolveTicketCount = response;
        }, function (err) { $scope.resolveTicketCount = 0;
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets.");
        });
    };
    GetResolveTicketCount();


    $scope.myData = [{
        data: [],
        lines: {
            fill: true,
            lineWidth: 1,
            color: '#15315a'
        }
    }, {
        data: [],
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
            font: {color: '#15a9fa'},
            tickFormatter: function (val, axis) {
                return moment.unix(val).format("DD-MMM"); //moment.unix(val).date();
            }
        }
    };


    var GetCreatedicketSeries = function () {
        dashboradService.GetCreatedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.myData[0].data = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0]?c[0]:0;
                    return item;
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
                $scope.myData[1].data = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0]?c[0]:0;
                    return item;
                });
            }
        }, function (err) {
            $scope.showAlert("Ticket", "error", "Fail To Load Tickets Data.");
        });
    };
    GetResolvedTicketSeries();

    $scope.myData2 = [{
        data: [],
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
            font: {color: '#15a9fa'},
            tickFormatter: function (val, axis) {
                return moment.unix(val).format("DD-MMM"); //moment.unix(val).date();
            }
        }
    };

    var GetDeferenceResolvedTicketSeries = function () {
        dashboradService.GetDeferenceResolvedTicketSeries().then(function (response) {
            if (angular.isArray(response)) {
                $scope.myData2[0].data = response.map(function (c, index) {
                    var item = [];
                    item[0] = c[1];
                    item[1] = c[0]?c[0]:0;
                    return item;
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
        }, function (err) { $scope.queueDetails = [];
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
        data.tabType='ticketView';
        data.index=data.reference;
        $rootScope.$emit('openNewTab',data);
    };

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



});

