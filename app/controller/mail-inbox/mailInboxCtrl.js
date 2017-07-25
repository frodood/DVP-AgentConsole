/**
 * Created by Veery Team on 9/12/2016.
 */
agentApp.controller('mailInboxCtrl', function ($scope, $rootScope, mailInboxService,
                                               profileDataParser, authService, $http) {


    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: true
        });
    };

    $scope.clickMoreEmailDetails = function (messageDetails) {

        $('#emailDescView').animate({right: "0"}, 300);
        $scope.isSelectedEmail = true;
        $scope.currentDisplayMessage = messageDetails;

        if (!messageDetails.has_read) {
            mailInboxService.markMessageAsRead(profileDataParser.myProfile._id, messageDetails._id)
                .then(function (data) {
                    if (data.IsSuccess) {
                        messageDetails.has_read = true;
                    }

                })
                .catch(function (err) {
                    //authService.IsCheckResponse(err);
                    $scope.showAlert('Mail Inbox', 'error', 'Failed to set mail status');

                });
        }


    };

    $scope.closeMailDesc = function () {
        $('#emailDescView').animate({right: "-100%"}, 300);
        $scope.isSelectedEmail = false;
    };

    $scope.currentFilter = 'INBOX';

    $scope.getNextPage = function () {
        var nextPageStart = $scope.pageStartCount + 10;

        getCounters(function () {
            if (nextPageStart < $scope.counters[$scope.currentFilter]) {
                $scope.pageStartCount = nextPageStart;

                if ($scope.currentFilter === 'INBOX') {
                    getAllInboxMessages();
                }
                else if ($scope.currentFilter === 'DELETED') {
                    getDeletedMessages();
                }
                else if ($scope.currentFilter === 'UNREAD') {
                    getUnreadMessages();
                }
                else if ($scope.currentFilter === 'READ') {
                    getReadMessages();
                }
                else if ($scope.currentFilter === 'FACEBOOK') {
                    getFacebookMessages();
                }
                else if ($scope.currentFilter === 'TWITTER') {
                    getTwitterMessages();
                }
                else if ($scope.currentFilter === 'NOTIFICATION') {
                    getNotificationMessages();
                }
                else if ($scope.currentFilter === 'SMS') {
                    getSMSMessages();
                }
            }

        });


    };

    $scope.openTab = function () {
        if ($scope.currentDisplayMessage && $scope.currentDisplayMessage.engagement_session) {
            var tabObj = {
                tabType: 'inbox',
                data: $scope.currentDisplayMessage.engagement_session,
                index: $scope.currentDisplayMessage.engagement_session._id
            };
            $rootScope.$emit('openNewTab', tabObj);
        }

    };

    $scope.getPreviousPage = function () {
        var previousPageStart = $scope.pageStartCount - 10;

        getCounters(function () {
            if (previousPageStart < $scope.counters[$scope.currentFilter]) {
                $scope.pageStartCount = previousPageStart;
            }
            else {
                //start from 0
                $scope.pageStartCount = 0;
            }

            if ($scope.currentFilter === 'INBOX') {
                getAllInboxMessages();
            }
            else if ($scope.currentFilter === 'DELETED') {
                getDeletedMessages();
            }
            else if ($scope.currentFilter === 'UNREAD') {
                getUnreadMessages();
            }
            else if ($scope.currentFilter === 'READ') {
                getReadMessages();
            }
            else if ($scope.currentFilter === 'FACEBOOK') {
                getFacebookMessages();
            }
            else if ($scope.currentFilter === 'TWITTER') {
                getTwitterMessages();
            }
            else if ($scope.currentFilter === 'NOTIFICATION') {
                getNotificationMessages();
            }
            else if ($scope.currentFilter === 'SMS') {
                getSMSMessages();
            }

        });


    };


    $scope.counters = {
        UNREAD: 0,
        INBOX: 0,
        DELETED: 0,
        READ: 0,
        FACEBOOK: 0,
        TWITTER: 0,
        NOTIFICATION: 0,
        SMS: 0

    };

    $scope.currentPageCount = $scope.counters.INBOX;

    $scope.pageStartCount = 0;

    $scope.filteredMailDisplay = [];
    $scope.markedMessages = [];
    $scope.moment = moment;

    $scope.markMessage = function (message) {
        if (message.IsMarked) {
            message.IsMarked = false;
        }
        else {
            message.IsMarked = true;
        }
    };


    var getCounters = function (callback) {

        try {
            mailInboxService.getMessageCounters(profileDataParser.myProfile._id)
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.counters = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to retrieve counters');
                        }

                        callback();

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to retrieve counters');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to retrieve counters');
        }

    };

    $scope.reloadInboxMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }


        getCounters(function () {
            getAllInboxMessages();
        });


    };

    $scope.reloadDeletedMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getDeletedMessages();
        });

    };

    $scope.reloadUnreadMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getUnreadMessages();
        });

    };

    $scope.reloadReadMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getReadMessages();
        });

    };


    $scope.reloadFacebookMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getFacebookMessages();
        });


    };

    $scope.reloadTwitterMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getTwitterMessages();
        });


    };

    $scope.reloadNotificationMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getNotificationMessages();
        });


    };

    $scope.reloadSMSMessages = function () {
        $scope.pageStartCount = 0;

        if ($scope.isSelectedEmail) {
            $scope.closeMailDesc();
        }

        getCounters(function () {
            getSMSMessages();
        });


    };

    $scope.deleteMultipleMessages = function () {
        //filter out marked messages
        var msgIdArr = [];

        $scope.filteredMailDisplay.forEach(function (msg) {
            if (msg.IsMarked) {
                msgIdArr.push(msg._id);
            }
        });

        deleteInboxMessages(msgIdArr, function (err, result) {
            if (result) {
                getCounters(function () {
                    if ($scope.currentFilter === 'INBOX') {
                        getAllInboxMessages();
                    }
                    else if ($scope.currentFilter === 'DELETED') {
                        getDeletedMessages();
                    }
                    else if ($scope.currentFilter === 'UNREAD') {
                        getUnreadMessages();
                    }
                    else if ($scope.currentFilter === 'READ') {
                        getReadMessages();
                    }
                    else if ($scope.currentFilter === 'FACEBOOK') {
                        getFacebookMessages();
                    }
                    else if ($scope.currentFilter === 'TWITTER') {
                        getTwitterMessages();
                    }
                    else if ($scope.currentFilter === 'NOTIFICATION') {
                        getNotificationMessages();
                    }
                    else if ($scope.currentFilter === 'SMS') {
                        getSMSMessages();
                    }
                });
            }

        });


    };

    $scope.deleteInboxMessage = function (messageId) {
        var arr = [];
        arr.push(messageId);
        deleteInboxMessages(arr, function (err, result) {
            if (result) {
                getCounters(function () {
                    if ($scope.currentFilter === 'INBOX') {
                        getAllInboxMessages();
                    }
                    else if ($scope.currentFilter === 'DELETED') {
                        getDeletedMessages();
                    }
                    else if ($scope.currentFilter === 'UNREAD') {
                        getUnreadMessages();
                    }
                    else if ($scope.currentFilter === 'READ') {
                        getReadMessages();
                    }
                    else if ($scope.currentFilter === 'FACEBOOK') {
                        getFacebookMessages();
                    }
                    else if ($scope.currentFilter === 'TWITTER') {
                        getTwitterMessages();
                    }
                    else if ($scope.currentFilter === 'NOTIFICATION') {
                        getNotificationMessages();
                    }
                    else if ($scope.currentFilter === 'SMS') {
                        getSMSMessages();
                    }
                });
            }

        });


    };

    var deleteInboxMessages = function (messageIds, callback) {
        try {
            mailInboxService.deleteInboxMessages(profileDataParser.myProfile._id, messageIds)
                .then(function (data) {
                        if (data.IsSuccess) {
                            callback(null, data.Result);
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to delete message');

                            callback(data.Exception, data.Result);
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to delete message');
                        callback(err, false);
                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to delete message');
            callback(ex, false);

        }
    };

    var getAllInboxMessages = function () {

        try {
            $scope.currentFilter = 'INBOX';
            $scope.currentPageCount = $scope.counters.INBOX;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount, null)
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getDeletedMessages = function () {

        try {
            $scope.currentFilter = 'DELETED';
            $scope.currentPageCount = $scope.counters.DELETED;
            $scope.filteredMailDisplay = [];
            mailInboxService.getDeletedInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount)
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getUnreadMessages = function () {

        try {
            $scope.currentFilter = 'UNREAD';
            $scope.currentPageCount = $scope.counters.UNREAD;
            $scope.filteredMailDisplay = [];
            mailInboxService.getUnReadInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount)
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getReadMessages = function () {

        try {
            $scope.currentFilter = 'READ';
            $scope.currentPageCount = $scope.counters.READ;
            $scope.filteredMailDisplay = [];
            mailInboxService.getReadInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount)
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getFacebookMessages = function () {

        try {
            $scope.currentFilter = 'FACEBOOK';
            $scope.currentPageCount = $scope.counters.FACEBOOK;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount, 'FACEBOOK')
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getTwitterMessages = function () {

        try {
            $scope.currentFilter = 'TWITTER';
            $scope.currentPageCount = $scope.counters.TWITTER;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount, 'TWITTER')
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getNotificationMessages = function () {

        try {
            $scope.currentFilter = 'NOTIFICATION';
            $scope.currentPageCount = $scope.counters.NOTIFICATION;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount, 'NOTIFICATION')
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    var getSMSMessages = function () {

        try {
            $scope.currentFilter = 'SMS';
            $scope.currentPageCount = $scope.counters.SMS;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(profileDataParser.myProfile._id, 10, $scope.pageStartCount, 'SMS')
                .then(function (data) {
                        if (data.IsSuccess) {
                            if (data.Result) {
                                $scope.filteredMailDisplay = data.Result;
                            }
                        }
                        else {
                            var errMsg = data.CustomMessage;

                            if (data.Exception) {
                                errMsg = data.Exception.Message;
                            }
                            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');
                        }

                    },
                    function (err) {
                        authService.IsCheckResponse(err);
                        $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

                    })

        }
        catch (ex) {
            $scope.showAlert('Mail Inbox', 'error', 'Failed to get messages');

        }

    };

    $scope.reloadInboxMessages();


    //update new UI code
    var getWindowHeight = function (callback) {
        var height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        return callback(height);
    };
    getWindowHeight(function (height) {
        document.getElementById('inboxToggleLeft').style.height = height + "px";
        document.getElementById('inboxRightWrapper').style.height = height + "px";

    });

    window.onresize = function () {
        getWindowHeight(function (height) {
            document.getElementById('inboxToggleLeft').style.height = height + "px";
            document.getElementById('inboxRightWrapper').style.height = height + "px";

        });
    }

    //todo test
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    getJSONData($http, 'filters', function (data) {
        $scope.jsonFilterObj = data;
    });
    getJSONData($http, 'inboxFilters', function (data) {
        $scope.jsonInboxObj = data;
    });

    getJSONData($http, 'toDo', function (data) {
        $scope.jsonToDoObj = data;
    });

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.Items, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };
});