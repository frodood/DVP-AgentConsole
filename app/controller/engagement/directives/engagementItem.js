/**
 * Created by Rajinda on 9/6/2016.
 */

agentApp.directive("engagementItem", function ($filter, moment, engagementService) {

    return {
        restrict: "EA",
        scope: {
            profileId: "@"
        },

        templateUrl: 'agent_status/view/template/agentStatus.html',


        link: function (scope, element, attributes) {

            engagementService.GetEngagementIdsByProfile(scope.profileId).then(function (response) {
                if (response) {
                    engagementService.GetEngagementSessions(scope.profileId, response).then(function (response) {


                    }, function (err) {
                        scope.showAlert("Get Engagement Sessions", "error", "Fail To Get Engagement Sessions Data.")
                    });
                }
            }, function (err) {
                scope.showAlert("Get Engagement Profile", "error", "Fail To Get Engagement Data.")
            });

            scope.showAlert = function (tittle, type, msg) {
                new PNotify({
                    title: tittle,
                    text: msg,
                    type: type,
                    styling: 'bootstrap3'
                });
            };
        }


    }
});
