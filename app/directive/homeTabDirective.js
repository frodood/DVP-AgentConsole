/**
 * Created by Damith on 9/5/2016.
 */

agentApp.directive("engagementTemp", function (engagementService) {
    return {
        restrict: "EA",
        scope:{
            company: "@",
            direction: "@",
            channelFrom: "@",
            channelTo: "@",
            channel: "@",
            skill: "@",
            sessionId: "@"
        },
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {

            scope.showCreateTicket = false;
            scope.test = Math.floor((Math.random() * 6) + 1);
            console.log(scope.test);

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

            scope.clickAddNewTicket = function () {
                scope.showCreateTicket = !scope.showCreateTicket;
            };


            scope.engagementsList = [];
            scope.GetEngagementIdsByProfile = function(profileId){
                engagementService.GetEngagementIdsByProfile(profileId).then(function (response) {
                    if (response) {
                        engagementService.GetEngagementSessions(profileId, response.engagements).then(function (reply) {
                            scope.engagementsList = reply;
                        }, function (err) {
                            scope.showAlert("Get Engagement Sessions", "error", "Fail To Get Engagement Sessions Data.")
                        });
                    }
                }, function (err) {
                    scope.showAlert("Get Engagement Profile", "error", "Fail To Get Engagement Data.")
                });
            };
            scope.GetEngagementIdsByProfile("57814a3f0203db1413f4efdc");

            scope.currentEngagement = {};
            scope.currentEngagement.notes = [];
            scope.GetEngagementSessionNote = function(){
                engagementService.GetEngagementSessionNote(scope.sessionId).then(function (response) {
                    scope.currentEngagement = response;
                }, function (err) {
                    scope.showAlert("Engagement Session Note", "error", "Fail To Get Engagement Session Note.")
                });
            };
            scope.GetEngagementSessionNote();

            scope.noteBody = "";
            scope.AppendNoteToEngagementSession = function(noteBody){
                engagementService.AppendNoteToEngagementSession(scope.sessionId,{body:noteBody}).then(function (response) {
                    if(response){
                        scope.currentEngagement.notes.push({body:noteBody});
                        scope.showAlert("Note", "susses", "Successfully add Note.")

                    }
                    else{
                        scope.showAlert("Note", "error", "Fail To Add Note.")
                    }
                }, function (err) {
                    scope.showAlert("Engagement Session Note", "error", "Fail To Get Engagement Session Note.")
                });
            };

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