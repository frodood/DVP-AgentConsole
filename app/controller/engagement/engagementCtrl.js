/**
 * Created by Rajinda on 9/5/2016.
 */

agentApp.controller('engagementCtrl', function ($scope,engagementService) {


        var modalEvent = function () {
            return {
                ticketModel: function (id, className) {
                    if (className == 'display-block') {
                        $(id).removeClass('display-none').addClass(className + ' fadeIn');
                    } else if (className == 'display-none') {
                        $(id).removeClass('display-block').addClass(className);
                    }
                }
            }
        }();

        $scope.clickAddNewTicket = function (id, className) {
            modalEvent.ticketModel(id, className);
        };


        $scope.engagementsList = [];
        $scope.GetEngagementIdsByProfile = function(profileId){
            engagementService.GetEngagementIdsByProfile(profileId).then(function (response) {
                if (response) {
                    engagementService.GetEngagementSessions(profileId, response.engagements).then(function (reply) {
                        $scope.engagementsList = reply;
                    }, function (err) {
                        $scope.showAlert("Get Engagement Sessions", "error", "Fail To Get Engagement Sessions Data.")
                    });
                }
            }, function (err) {
                $scope.showAlert("Get Engagement Profile", "error", "Fail To Get Engagement Data.")
            });
        };
        $scope.GetEngagementIdsByProfile("57814a3f0203db1413f4efdc");


        $scope.showAlert = function (tittle, type, msg) {
            new PNotify({
                title: tittle,
                text: msg,
                type: type,
                styling: 'bootstrap3'
            });
        };
    }
);