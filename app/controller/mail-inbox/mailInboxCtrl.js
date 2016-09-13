/**
 * Created by Damith on 9/12/2016.
 */
agentApp.controller('mailInboxCtrl', function ($scope, mailInboxService) {


    $scope.clickMoreEmailDetails = function () {

        $('#emailDescView').animate({right: "0"}, 300);
        $scope.isSelectedEmail = true;
    };

    $scope.closeMailDesc = function () {
        $('#emailDescView').animate({right: "-100%"}, 300);
        $scope.isSelectedEmail = false;
    };


    $scope.Counters = {
        Unread: 0,
        All: 0,
        Deleted: 0,
        Facebook: 0,
        Twitter: 0,
        Notification: 0

    };

    var getCounters = function(){

        try
        {
            mailInboxService.getMessageCounters()
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result)
                        {
                            $scope.Counters = data.Result;
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

    }

    getCounters();

});