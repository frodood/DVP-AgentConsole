/**
 * Created by Damith on 9/12/2016.
 */
agentApp.controller('mailInboxCtrl', function ($scope, mailInboxService) {


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


        //get profile pic


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
            }

        });


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

        });


    };


    $scope.counters = {
        UNREAD: 0,
        INBOX: 0,
        DELETED: 0,
        READ: 0,
        FACEBOOK: 0,
        TWITTER: 0,
        NOTIFICATION: 0

    };

    $scope.currentPageCount = $scope.counters.INBOX;

    $scope.pageStartCount = 0;

    $scope.filteredMailDisplay = [];
    $scope.moment = moment;

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
            mailInboxService.getDeletedInboxMessages(10, $scope.pageStartCount, null)
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

    $scope.reloadInboxMessages();

});