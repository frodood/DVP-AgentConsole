/**
 * Created by verry team on 9/5/2016.
 */

agentApp.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];

            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
});

agentApp.directive("engagementTab", function ($filter,$rootScope, engagementService, ivrService, userService, ticketService, tagService) {
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
            tagList: "=",
            tagCategoryList: "=",
            users: "=",
            loadTags: '&'
        },
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {

            /*Initialize default scope*/

            scope.availableTags = scope.tagCategoryList;
            scope.profileDetail = {};
            scope.profileDetail.avatar = "assets/img/avatar/default-user.png";
            scope.profileDetails = [];
            scope.profileDetail.address = {
                zipcode: "",
                number: "",
                street: "",
                city: "",
                province: "",
                country: ""
            };


            scope.ticket = {};
            scope.ticket.priority = 'normal';
            scope.ticket.submitter = {};
            scope.ticket.submitter.avatar = "assets/img/avatar/default-user.png";

            /* End Initialize default scope*/


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

            scope.tagSelectRoot = 'root';
            scope.onChipAddTag = function (chip) {
                if (!chip.tags||(chip.tags.length === 0) ) {
                    setToDefault();
                    return;
                }
                if (scope.tagSelectRoot === 'root') {
                    scope.tagSelectRoot = 'sub';
                    scope.availableTags = chip.tags;
                }
                else if (scope.tagSelectRoot === 'sub') {

                    var tempTags = [];
                    angular.forEach(chip.tags, function (item) {
                        var tags = $filter('filter')(scope.tagList, {_id: item}, true);
                        tempTags = tempTags.concat(tags);
                    });
                    scope.availableTags = tempTags;
                    scope.tagSelectRoot = 'child';

                }
                else {
                    if (chip.tags) {
                        if (chip.tags.length > 0) {
                            scope.availableTags = chip.tags;
                            return;
                        }
                    }
                    setToDefault();
                }

            };

            scope.loadPostTags = function(query) {
                return scope.postTags;
            };

           var removeDuplicate = function(arr){
                var newArr = [];
                angular.forEach(arr, function(value, key) {
                    var exists = false;
                    angular.forEach(newArr, function(val2, key) {
                        if(angular.equals(value.name, val2.name)){ exists = true };
                    });
                    if(exists == false && value.name != "") { newArr.push(value); }
                });
                return newArr;
            };

            scope.newAddTags =[];
            scope.ticket = {};
            scope.ticket.selectedTags = [];
            scope.newAddTags = [];
            scope.postTags = [];
            var setToDefault = function () {
                var ticTag = undefined;
                angular.forEach(scope.newAddTags, function (item) {
                    if (ticTag) {
                        ticTag = ticTag + "." + item.name;
                    } else {
                        ticTag = item.name;
                    }

                });
                if(ticTag){
                    scope.postTags.push({name:ticTag});
                    scope.postTags = removeDuplicate(scope.postTags);
                }

                scope.newAddTags = [];
                scope.availableTags = scope.tagCategoryList;
                scope.tagSelectRoot = 'root';
            };

            scope.onChipDeleteTag = function (chip) {
                setToDefault();
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
                ticket.requester = scope.profileDetail._id;
                if (scope.postTags) {
                    ticket.tags = scope.postTags.map(function (obj) {
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
                /* scope.ticket = {};
                 scope.ticket.priority = 'normal';
                 scope.ticket.submitter = {};
                 scope.ticket.submitter.avatar ="assets/img/avatar/bobbyjkane.jpg";*/
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


            scope.showMore = function () {
                console.log('show more triggered');
                scope.loadNextEngagement();
            };

            scope.currentPage = 1;
            scope.loadNextEngagement = function () {
                var begin = ((scope.currentPage - 1) * 10)
                    , end = begin + 10;

                var ids = scope.sessionIds.slice(begin, end);
                if (ids) {
                    scope.currentPage = scope.currentPage + 1;
                    engagementService.GetEngagementSessions(scope.engagementId, ids).then(function (reply) {
                        scope.engagementsList = scope.engagementsList.concat(reply);
                    }, function (err) {
                        scope.showAlert("Get Engagement Sessions", "error", "Fail To Get Engagement Sessions Data.")
                    });
                }
            };

            scope.engagementsList = [];
            scope.sessionIds = [];
            scope.GetEngagementIdsByProfile = function (profileId) {
                engagementService.GetEngagementIdsByProfile(profileId).then(function (response) {
                    if (response) {
                        scope.sessionIds = response.engagements;
                        scope.engagementId = response._id;
                        scope.loadNextEngagement();
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
                        scope.showAlert("Note", "success", "Note Add Successfully.");
                        scope.noteBody = "";
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
                            getExternalUserRecentTickets(scope.profileDetail._id);
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
                scope.GetEngagementIdsByProfile(profileId);
                scope.GetAllTicketsByRequester(profileId, 1);
                console.info("Profile History Loading........................");
            };

            scope.showAlert = function (tittle, type, msg) {
                new PNotify({
                    title: tittle,
                    text: msg,
                    type: type,
                    styling: 'bootstrap3',
                    desktop: {
                    desktop: true
                }
                });
            };

            var tabList = ['#viewProfile', '#viewTimeLine', '#viewTicketView'];
            var btnList = ['#timeLine', '#ticket', '#profile'];

            var profileDisable = function () {
                tabList.forEach(function (tab) {
                    $(tab).removeClass('display-block ').addClass('display-none');
                });
                btnList.forEach(function (tab) {
                    $(tab).removeClass('active');
                });
            };

            scope.showProfileView = function (viewName,currentBtn) {
                profileDisable();
                $(viewName).removeClass('display-none').addClass('display-block ');
                $(currentBtn).addClass('active');
            };

            scope.gotoTicket = function (data) {
                data.tabType = "ticketView";
                $rootScope.$emit('openNewTab',data);
            };

            var getExternalUserRecentTickets = function(id){
                ticketService.GetExternalUserRecentTickets(id).then(function (response) {
                    scope.recentTicketList = response;
                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Recent Tickets.")
                });
            };

            scope.queryTicketList = function (query) {
                if (query === "*" || query === "") {
                    if (scope.ticketList) {
                        return scope.ticketList;
                    }
                    else {
                        return [];
                    }

                }
                else {
                    var results = query ? scope.ticketList.filter(function (query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(group) {
                            return (group.ticketList.toLowerCase().indexOf(lowercaseQuery) != -1);
                        };
                    }) : [];
                    return results;
                }

            };

        }
    }
});
