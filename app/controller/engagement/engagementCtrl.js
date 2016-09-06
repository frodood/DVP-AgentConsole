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


        $scope.GetEngagementIdsByProfile = function (id) {
            engagementService.GetEngagementIdsByProfile(id).then(function (response) {
                $scope.engagementSessions = response;
            }, function (error) {
                $scope.showAlert("Load Engagement Sessions", "error", "Fail To Get Engagement Sessions.");
            });
        };
        $scope.GetEngagementIdsByProfile(123);
    }
);