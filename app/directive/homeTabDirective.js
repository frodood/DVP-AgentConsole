/**
 * Created by Damith on 9/5/2016.
 */

agentApp.directive("engagementTemp", function ($filter, engagementService, ivrService, userService, ticketService, tagService) {
    return {
        restrict: "EA",
        scope: {
            company: "@",
            direction: "@",
            channelFrom: "@",
            channelTo: "@",
            channel: "@",
            skill: "@",
            sessionId: "@",
            availableTags: "=",
            users: "="
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

            scope.related = [];

            scope.loadTags = function () {
                tagService.GetAllTags().then(function (response) {
                    scope.availableTags = response;
                }, function (err) {
                    scope.showAlert("load Tags", "error", "Fail To Get Tag List.  ")
                });
            };

            function createTagFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.name.toLowerCase().indexOf(lowercaseQuery) != -1);
                };
            }

            scope.queryTagSearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.availableTags) {
                        return scope.availableTags;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.availableTags.filter(createTagFilterFor(query)) : [];
                    return results;
                }

            };

            scope.onChipAddTag = function (chip) {
                //attributeService.AddAttributeToGroup(scope.groupinfo.GroupId, chip.AttributeId, "Attribute Group").then(function (response) {
                //    if (response) {
                //        console.info("AddAttributeToGroup : " + response);
                //        scope.showAlert("Info", "Info", "ok", "Attribute " + chip.Attribute + " Save successfully");
                //
                //    }
                //    else {
                //        scope.resetAfterAddFail(chip);
                //        scope.showError("Error", "Fail To Save " + chip.Attribute);
                //    }
                //}, function (error) {
                //    scope.resetAfterAddFail(chip);
                //    scope.showError("Error", "Fail To Save " + chip.Attribute);
                //});
            };

            scope.onChipDeleteTag = function (chip) {
                //attributeService.DeleteOneAttribute(scope.groupinfo.GroupId, chip.AttributeId).then(function (response) {
                //    if (response) {
                //        console.info("AddAttributeToGroup : " + response);
                //        scope.showAlert("Info", "Info", "ok", "Successfully Delete " + chip.Attribute);
                //    }
                //    else {
                //        scope.resetAfterDeleteFail(chip);
                //        scope.showError("Error", "Fail To Delete " + chip.Attribute);
                //    }
                //}, function (error) {
                //    scope.showError("Error", "Fail To Delete " + chip.Attribute);
                //    scope.resetAfterDeleteFail(chip);
                //});

            };


            // input-tags users

            scope.loadUsers = function () {
                userService.LoadUser().then(function (response) {
                    scope.users = response;
                }, function (err) {
                    scope.showAlert("load Users", "error", "Fail To Get User List.")
                });
            };


            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(group) {
                    return (group.username.toLowerCase().indexOf(lowercaseQuery) != -1);
                };
            }

            scope.querySearch = function (query) {
                if (query === "*" || query === "") {
                    if (scope.users) {
                        return scope.users;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.users.filter(createFilterFor(query)) : [];
                    return results;
                }

            };

            scope.onChipAddUser = function (chip) {
                //attributeService.AddAttributeToGroup(scope.groupinfo.GroupId, chip.AttributeId, "Attribute Group").then(function (response) {
                //    if (response) {
                //        console.info("AddAttributeToGroup : " + response);
                //        scope.showAlert("Info", "Info", "ok", "Attribute " + chip.Attribute + " Save successfully");
                //
                //    }
                //    else {
                //        scope.resetAfterAddFail(chip);
                //        scope.showError("Error", "Fail To Save " + chip.Attribute);
                //    }
                //}, function (error) {
                //    scope.resetAfterAddFail(chip);
                //    scope.showError("Error", "Fail To Save " + chip.Attribute);
                //});
            };

            scope.onChipDeleteUser = function (chip) {
                //attributeService.DeleteOneAttribute(scope.groupinfo.GroupId, chip.AttributeId).then(function (response) {
                //    if (response) {
                //        console.info("AddAttributeToGroup : " + response);
                //        scope.showAlert("Info", "Info", "ok", "Successfully Delete " + chip.Attribute);
                //    }
                //    else {
                //        scope.resetAfterDeleteFail(chip);
                //        scope.showError("Error", "Fail To Delete " + chip.Attribute);
                //    }
                //}, function (error) {
                //    scope.showError("Error", "Fail To Delete " + chip.Attribute);
                //    scope.resetAfterDeleteFail(chip);
                //});

            };


            /*Add New Ticket*/

            scope.setPriority = function (priority) {
                scope.ticket.priority = priority;
            };

            scope.saveTicket = function (ticket) {
                ticket.channel = scope.channel;
                if (ticket.selectedTags) {
                    ticket.tags = ticket.selectedTags.map(function (obj) {
                        return obj.name;
                    });
                }


                ticketService.SaveTicket(ticket).then(function (response) {
                    if (!response) {
                        scope.showAlert("Save Ticket", "error", "Fail To Save Ticket.")
                    }
                    scope.showCreateTicket = !response;
                }, function (err) {
                    scope.showAlert("Save Ticket", "error", "Fail To Save Ticket.");
                });


            };

            scope.showCreateTicket = false;


            scope.clickAddNewTicket = function () {
                scope.ticket = {};
                scope.ticket.priority = 'normal';
                scope.showCreateTicket = !scope.showCreateTicket;
                if (scope.showCreateTicket) {
                    if (scope.users.length > 0) {
                        var id = ticketService.GetResourceIss();
                        scope.ids = $filter('filter')(scope.users, {username: id});
                        if (scope.ids) {
                            if (scope.ids.length > 0) {
                                scope.ticket.assignee = scope.ids[0]._id;
                            }
                        }
                    }
                }
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


            scope.GetProfileHistory = function (profileId) {
                console.info("GetProfileHistory........................");
                scope.GetEngagementIdsByProfile(profileId);
                scope.GetAllTicketsByRequester(profileId, 1);
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