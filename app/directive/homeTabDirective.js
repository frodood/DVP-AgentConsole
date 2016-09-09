/**
 * Created by Damith on 9/5/2016.
 */

agentApp.directive("engagementTemp", function (engagementService, ivrService, userService, ticketService) {
    return {
        restrict: "EA",
        scope: {
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

            /*Add New Ticket*/

            var modalEvent = function () {
                return {
                    ticketModel: function (id, className) {
                        if (className == 'display-block') {
                            $(id).removeClass('display-none').addClass(className);
                        } else if (className == 'display-none') {
                            $(id).removeClass('display-block').addClass(className);
                        }
                    }
                }
            }();

            scope.tags = [
                {text: 'just'},
                {text: 'some'},
                {text: 'cool'},
                {text: 'tags'}
            ];
            scope.related = [
                {text: '8975622'}
            ];
            scope.loadTags = function (query) {
                return $http.get('/tags?query=' + query);
            };

            scope.users = [];
            //scope.loadUser = function ($query) {
            //    return $http.get('assets/json/assigneeUsers.json', {cache: true}).then(function (response) {
            //        var countries = response.data;
            //        console.log(countries);
            //        return countries.filter(function (country) {
            //            return country.profileName.toLowerCase().indexOf($query.toLowerCase()) != -1;
            //        });
            //    });
            //};

            scope.loadUser = function ($query) {
                userService.LoadUser($query).then(function (response) {
                    return response;
                }, function (err) {
                    scope.showAlert("load User", "error", "Fail To Get User List.");
                    return undefined;
                });
            };


            /*Add New Ticket*/


            scope.showCreateTicket = false;

            scope.clickAddNewTicket = function () {
                scope.showCreateTicket = !scope.showCreateTicket;
            };


            /* Load Past Engagements By Profile ID */
            scope.engagementsList = [];
            scope.GetEngagementIdsByProfile = function (profileId) {
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


            /* Load Current Engagement Notes */
            scope.currentEngagement = {};
            scope.currentEngagement.notes = [];
            scope.GetEngagementSessionNote = function () {
                engagementService.GetEngagementSessionNote(scope.sessionId).then(function (response) {
                    scope.currentEngagement = response;
                }, function (err) {
                    scope.showAlert("Engagement Session Note", "error", "Fail To Get Engagement Session Note.")
                });
            };
            scope.GetEngagementSessionNote();

            /* Add New Note To Engagement  */
            scope.noteBody = "";
            scope.AppendNoteToEngagementSession = function (noteBody) {
                engagementService.AppendNoteToEngagementSession(scope.sessionId, {body: noteBody}).then(function (response) {
                    if (response) {
                        scope.currentEngagement.notes.push({body: noteBody});
                        scope.showAlert("Note", "susses", "Successfully add Note.")

                    }
                    else {
                        scope.showAlert("Note", "error", "Fail To Add Note.")
                    }
                }, function (err) {
                    scope.showAlert("Engagement Session Note", "error", "Fail To Get Engagement Session Note.")
                });
            };

            /* Load IVR Details for Current Engagement */
            scope.GetIvrDetailsByEngagementId = function () {
                ivrService.GetIvrDetailsByEngagementId(scope.sessionId).then(function (response) {
                    scope.ivrDetails = response;
                }, function (err) {
                    scope.showAlert("Engagement Session Note", "error", "Fail To Get Engagement Session Note.")
                });
            };
            scope.GetIvrDetailsByEngagementId();

            /* Load Profile Details for Current Engagement */
            scope.profileDetails = [];
            scope.profileDetail = {};
            scope.profileDetail.address = {
                zipcode: "",
                number: "",
                street: "",
                city: "",
                province: "",
                country: ""
            };

            scope.GetExternalUserProfileByContact = function () {
                var category = "";
                if (scope.direction === 'inbound' || scope.direction === 'outbound') {
                    category = 'phone';
                }
                userService.GetExternalUserProfileByContact(category, scope.channelFrom).then(function (response) {
                    scope.profileDetails = response;
                    if (scope.profileDetails) {
                        if (scope.profileDetails.length == 1) {
                            scope.profileDetail = scope.profileDetails[0];
                            scope.GetProfileHistory(scope.profileDetail._id);
                        }
                        else {
                            // show multiple profile selection view
                        }
                    }
                }, function (err) {
                    scope.showAlert("User Profile", "error", "Fail To Get User Profile Details.")
                });
            };
            scope.GetExternalUserProfileByContact();

            /* Load Profile Details for Current Engagement */
            scope.ticketList = [];
            scope.GetAllTicketsByRequester = function (requester, page) {
                ticketService.GetAllTicketsByRequester(requester, page).then(function (response) {
                    scope.ticketList = response;
                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Ticket List.")
                });
            };
            //scope.GetAllTicketsByRequester();


            scope.GetProfileHistory = function(profileId){
                console.info("GetProfileHistory........................");
                scope.GetEngagementIdsByProfile(profileId);
                scope.GetAllTicketsByRequester(profileId,1);
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