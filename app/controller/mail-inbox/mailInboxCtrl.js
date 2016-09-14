/**
 * Created by Damith on 9/12/2016.
 */
agentApp.controller('mailInboxCtrl', function ($scope, $rootScope, mailInboxService) {


    $scope.clickMoreEmailDetails = function (messageDetails) {

        $('#emailDescView').animate({right: "0"}, 300);
        $scope.isSelectedEmail = true;
        $scope.currentDisplayMessage = messageDetails;

        if(!messageDetails.has_read)
        {
            mailInboxService.markMessageAsRead(messageDetails._id)
                .then(function (data)
                {
                    if(data.IsSuccess)
                    {
                        messageDetails.has_read = true;
                    }

                })
                .catch(function(err)
                {

                });
        }


    };

    $scope.closeMailDesc = function () {
        $('#emailDescView').animate({right: "-100%"}, 300);
        $scope.isSelectedEmail = false;
    };

    $scope.currentFilter = 'INBOX';

    $scope.getNextPage = function()
    {
        var nextPageStart = $scope.pageStartCount + 10;

        getCounters(function()
        {
            if(nextPageStart < $scope.counters[$scope.currentFilter])
            {
                $scope.pageStartCount = nextPageStart;

                if($scope.currentFilter === 'INBOX')
                {
                    getAllInboxMessages();
                }
                else if($scope.currentFilter === 'DELETED')
                {
                    getDeletedMessages();
                }
                else if($scope.currentFilter === 'UNREAD')
                {
                    getUnreadMessages();
                }
                else if($scope.currentFilter === 'READ')
                {
                    getReadMessages();
                }
                else if($scope.currentFilter === 'FACEBOOK')
                {
                    getFacebookMessages();
                }
                else if($scope.currentFilter === 'TWITTER')
                {
                    getTwitterMessages();
                }
                else if($scope.currentFilter === 'NOTIFICATION')
                {
                    getNotificationMessages();
                }
                else if($scope.currentFilter === 'SMS')
                {
                    getSMSMessages();
                }
            }

        });


    };

    $scope.openTab = function()
    {
        if($scope.currentDisplayMessage && $scope.currentDisplayMessage.engagement_session)
        {
            $rootScope.$emit('INBOX_NewEngagementTab', $scope.currentDisplayMessage.engagement_session);
        }

    };

    $scope.getPreviousPage = function()
    {
        var previousPageStart = $scope.pageStartCount - 10;

        getCounters(function()
        {
            if(previousPageStart < $scope.counters[$scope.currentFilter])
            {
                $scope.pageStartCount = previousPageStart;
            }
            else
            {
                //start from 0
                $scope.pageStartCount = 0;
            }

            if($scope.currentFilter === 'INBOX')
            {
                getAllInboxMessages();
            }
            else if($scope.currentFilter === 'DELETED')
            {
                getDeletedMessages();
            }
            else if($scope.currentFilter === 'UNREAD')
            {
                getUnreadMessages();
            }
            else if($scope.currentFilter === 'READ')
            {
                getReadMessages();
            }
            else if($scope.currentFilter === 'FACEBOOK')
            {
                getFacebookMessages();
            }
            else if($scope.currentFilter === 'TWITTER')
            {
                getTwitterMessages();
            }
            else if($scope.currentFilter === 'NOTIFICATION')
            {
                getNotificationMessages();
            }
            else if($scope.currentFilter === 'SMS')
            {
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

    $scope.markMessage = function(message)
    {
        if(message.IsMarked)
        {
            message.IsMarked = false;
        }
        else
        {
            message.IsMarked = true;
        }
    };


    var getCounters = function(callback){

        try
        {
            mailInboxService.getMessageCounters()
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.counters = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                    callback();

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    $scope.reloadInboxMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }


        getCounters(function()
        {
            getAllInboxMessages();
        });


    };

    $scope.reloadDeletedMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getDeletedMessages();
        });

    };

    $scope.reloadUnreadMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getUnreadMessages();
        });

    };

    $scope.reloadReadMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getReadMessages();
        });

    };


    $scope.reloadFacebookMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getFacebookMessages();
        });


    };

    $scope.reloadTwitterMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getTwitterMessages();
        });


    };

    $scope.reloadNotificationMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getNotificationMessages();
        });


    };

    $scope.reloadSMSMessages = function()
    {
        $scope.pageStartCount = 0;

        if($scope.isSelectedEmail)
        {
            $scope.closeMailDesc();
        }

        getCounters(function()
        {
            getSMSMessages();
        });


    };

    $scope.deleteMultipleMessages = function()
    {
        //filter out marked messages
        var msgIdArr = [];

        $scope.filteredMailDisplay.forEach(function(msg)
        {
            if(msg.IsMarked)
            {
                msgIdArr.push(msg._id);
            }
        });

        deleteInboxMessages(msgIdArr, function(err, result)
        {
            if(result)
            {
                getCounters(function()
                {
                    if($scope.currentFilter === 'INBOX')
                    {
                        getAllInboxMessages();
                    }
                    else if($scope.currentFilter === 'DELETED')
                    {
                        getDeletedMessages();
                    }
                    else if($scope.currentFilter === 'UNREAD')
                    {
                        getUnreadMessages();
                    }
                    else if($scope.currentFilter === 'READ')
                    {
                        getReadMessages();
                    }
                    else if($scope.currentFilter === 'FACEBOOK')
                    {
                        getFacebookMessages();
                    }
                    else if($scope.currentFilter === 'TWITTER')
                    {
                        getTwitterMessages();
                    }
                    else if($scope.currentFilter === 'NOTIFICATION')
                    {
                        getNotificationMessages();
                    }
                    else if($scope.currentFilter === 'SMS')
                    {
                        getSMSMessages();
                    }
                });
            }

        });


    };

    $scope.deleteInboxMessage = function(messageId)
    {
        var arr = [];
        arr.push(messageId);
        deleteInboxMessages(arr, function(err, result)
        {
            if(result)
            {
                getCounters(function()
                {
                    if($scope.currentFilter === 'INBOX')
                    {
                        getAllInboxMessages();
                    }
                    else if($scope.currentFilter === 'DELETED')
                    {
                        getDeletedMessages();
                    }
                    else if($scope.currentFilter === 'UNREAD')
                    {
                        getUnreadMessages();
                    }
                    else if($scope.currentFilter === 'READ')
                    {
                        getReadMessages();
                    }
                    else if($scope.currentFilter === 'FACEBOOK')
                    {
                        getFacebookMessages();
                    }
                    else if($scope.currentFilter === 'TWITTER')
                    {
                        getTwitterMessages();
                    }
                    else if($scope.currentFilter === 'NOTIFICATION')
                    {
                        getNotificationMessages();
                    }
                    else if($scope.currentFilter === 'SMS')
                    {
                        getSMSMessages();
                    }
                });
            }

        });


    };

    var deleteInboxMessages = function(messageIds, callback)
    {
        try
        {
            mailInboxService.deleteInboxMessages(messageIds)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        callback(null, data.Result);
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);

                        callback(data.Exception, data.Result);
                    }

                },
                function (err) {
                    callback(err, false);
                })

        }
        catch(ex)
        {
            console.log(ex);
            callback(ex, false);

        }
    };

    var getAllInboxMessages = function()
    {

        try
        {
            $scope.currentFilter = 'INBOX';
            $scope.currentPageCount = $scope.counters.INBOX;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(10, $scope.pageStartCount, null)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getDeletedMessages = function()
    {

        try
        {
            $scope.currentFilter = 'DELETED';
            $scope.currentPageCount = $scope.counters.DELETED;
            $scope.filteredMailDisplay = [];
            mailInboxService.getDeletedInboxMessages(10, $scope.pageStartCount)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getUnreadMessages = function()
    {

        try
        {
            $scope.currentFilter = 'UNREAD';
            $scope.currentPageCount = $scope.counters.UNREAD;
            $scope.filteredMailDisplay = [];
            mailInboxService.getUnReadInboxMessages(10, $scope.pageStartCount)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getReadMessages = function()
    {

        try
        {
            $scope.currentFilter = 'READ';
            $scope.currentPageCount = $scope.counters.READ;
            $scope.filteredMailDisplay = [];
            mailInboxService.getReadInboxMessages(10, $scope.pageStartCount)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getFacebookMessages = function()
    {

        try
        {
            $scope.currentFilter = 'FACEBOOK';
            $scope.currentPageCount = $scope.counters.FACEBOOK;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(10, $scope.pageStartCount, 'FACEBOOK')
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getTwitterMessages = function()
    {

        try
        {
            $scope.currentFilter = 'TWITTER';
            $scope.currentPageCount = $scope.counters.TWITTER;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(10, $scope.pageStartCount, 'TWITTER')
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getNotificationMessages = function()
    {

        try
        {
            $scope.currentFilter = 'NOTIFICATION';
            $scope.currentPageCount = $scope.counters.NOTIFICATION;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(10, $scope.pageStartCount, 'NOTIFICATION')
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    var getSMSMessages = function()
    {

        try
        {
            $scope.currentFilter = 'SMS';
            $scope.currentPageCount = $scope.counters.SMS;
            $scope.filteredMailDisplay = [];
            mailInboxService.getAllInboxMessages(10, $scope.pageStartCount, 'SMS')
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.filteredMailDisplay = data.Result;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }

                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };

    $scope.reloadInboxMessages();

});