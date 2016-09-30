/**
 * Created by team verry on 9/23/2016.
 */

agentApp.controller('agentDashboardCtrl', function ($scope,$rootScope, $http, dashboradService,ticketService,engagementService,profileDataParser, authService) {

    $scope.resourceId = authService.GetResourceId();
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


    var theme = {
        color: [
            '#db4114', '#f8b01d', '#2ba89c', '#114858',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],
        title: {
            itemGap: 8,
            textStyle: {
                color: '#408829',
                fontFamily: 'Roboto',
                fontWeight: 300
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {color: '#408829'},
                emphasis: {color: '#408829'}
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };

    //-----------------------------------------------

    var myObject = {}
    $scope.echartDonutSetOption = function (id) {

        dashboradService.ProductivityByResourceId(id).then(function (productivity) {
            myObject[productivity.Chatid] = echarts.init(document.getElementById(id), theme);
            myObject[productivity.Chatid].setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                legend: {
                    x: 'center',
                    y: 'bottom',
                    data: ['After work', 'Break', 'On Call', 'Idle']
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '10%',
                                    width: '50%',
                                    funnelAlign: 'center',
                                    max: 1548
                                }
                            }
                        },
                        restore: {
                            show: false,
                            title: "Restore"
                        },
                        saveAsImage: {
                            show: true,
                            title: "Save As Image"
                        }
                    }
                },
                series: [{
                    name: 'Productivity',
                    type: 'pie',
                    radius: ['35%', '55%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true
                            },
                            labelLine: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: 'center',
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'normal'
                                }
                            }
                        }
                    },
                    data: productivity
                }]
            });

        }, function (err) {
            $scope.showAlert("Productivity", "error", "Fail To Load Productivity.");
        });

    };
    $scope.echartDonutSetOption($scope.resourceId);
});

