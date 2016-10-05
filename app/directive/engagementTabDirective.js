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

agentApp.directive("engagementTab", function ($filter, $rootScope, engagementService, ivrService, userService, ticketService, tagService) {
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
            loadTags: '&',
            profileDetail: "="
        },
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {

            /*Initialize default scope*/

            scope.oldFormModel = null;
            scope.currentSubmission = null;
            scope.currentForm = null;
            scope.availableTags = scope.tagCategoryList;

            /*if(!scope.profileDetail){
             scope.profileDetail = {};
             }

             scope.profileDetail.avatar = "assets/img/avatar/default-user.png";
             scope.profileDetails = [];
             scope.profileDetail.address = {
             zipcode: "",
             number: "",
             street: "",
             city: "",
             province: "",
             country: ""
             };*/

            scope.ticket = {};
            scope.ticket.priority = 'normal';
            scope.ticket.submitter = {};
            scope.ticket.submitter.avatar = "assets/img/avatar/default-user.png";

            /* End Initialize default scope*/

            /*form submit*/
            scope.showAlert = function (tittle, type, msg) {
                new PNotify({
                    title: tittle,
                    text: msg,
                    type: type,
                    styling: 'bootstrap3',
                    icon: true
                });
            };

            var buildFormSchema = function (schema, form, fields) {
                fields.forEach(function (fieldItem) {
                    if (fieldItem.field) {
                        var isActive = true;
                        if (fieldItem.active === false) {
                            isActive = false;
                        }

                        //field type parser

                        if (fieldItem.type === 'text') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "text"
                            })
                        }
                        else if (fieldItem.type === 'textarea') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "textarea"
                            })
                        }
                        else if (fieldItem.type === 'url') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "text"
                            })
                        }
                        else if (fieldItem.type === 'header') {
                            var h2Tag = '<h2>' + fieldItem.title + '</h2>';
                            form.push({
                                "type": "help",
                                "helpvalue": h2Tag
                            });
                        }
                        else if (fieldItem.type === 'radio') {
                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            var formObj = {
                                "key": fieldItem.field,
                                "type": "radios-inline",
                                "titleMap": []
                            };


                            if (fieldItem.values && fieldItem.values.length > 0) {

                                schema.properties[fieldItem.field].enum = [];

                                fieldItem.values.forEach(function (enumVal) {
                                    schema.properties[fieldItem.field].enum.push(enumVal.name);
                                    formObj.titleMap.push(
                                        {
                                            "value": enumVal.name,
                                            "name": enumVal.name
                                        }
                                    )
                                })

                            }

                            form.push(formObj);
                        }
                        else if (fieldItem.type === 'date') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive,
                                format: 'date'

                            };

                            form.push({
                                "key": fieldItem.field,
                                "minDate": "1900-01-01"
                            })
                        }
                        else if (fieldItem.type === 'number') {

                            schema.properties[fieldItem.field] = {
                                type: 'number',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "number"
                            })
                        }
                        else if (fieldItem.type === 'phone') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                pattern: "^[0-9*#+]+$",
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "text"
                            })
                        }
                        else if (fieldItem.type === 'boolean' || fieldItem.type === 'checkbox') {

                            schema.properties[fieldItem.field] = {
                                type: 'boolean',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "checkbox"
                            })
                        }
                        else if (fieldItem.type === 'checkboxes') {

                            schema.properties[fieldItem.field] = {
                                type: 'array',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive,
                                items: {
                                    type: "string",
                                    enum: []
                                }

                            };

                            if (fieldItem.values && fieldItem.values.length > 0) {

                                fieldItem.values.forEach(function (enumVal) {
                                    schema.properties[fieldItem.field].items.enum.push(enumVal.name);
                                })

                            }

                            form.push(fieldItem.field);
                        }
                        else if (fieldItem.type === 'email') {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                pattern: "^\\S+@\\S+$",
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            form.push({
                                "key": fieldItem.field,
                                "type": "text"
                            })
                        }
                        else if (fieldItem.type === 'select') {
                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive

                            };

                            var formObj = {
                                "key": fieldItem.field,
                                "type": "select",
                                "titleMap": []
                            };

                            if (fieldItem.values && fieldItem.values.length > 0) {

                                schema.properties[fieldItem.field].enum = [];

                                fieldItem.values.forEach(function (enumVal) {
                                    schema.properties[fieldItem.field].enum.push(enumVal.name);
                                    formObj.titleMap.push(
                                        {
                                            "value": enumVal.name,
                                            "name": enumVal.name
                                        });
                                })

                            }
                            form.push(formObj);
                        }

                        //end field type parser

                    }


                });

                return schema;
            };

            scope.onSubmit = function (form) {
                scope.$broadcast('schemaFormValidate');
                if (form.$valid) {
                    var arr = [];

                    for (var key in scope.model) {
                        if (scope.model.hasOwnProperty(key)) {
                            arr.push({
                                field: key,
                                value: scope.model[key]
                            });

                        }
                    }

                    //save arr
                    if (scope.currentSubmission) {
                        var obj = {
                            fields: arr
                        };
                        ticketService.updateFormSubmissionData(scope.currentSubmission.reference, obj).then(function (response) {
                            scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                        }).catch(function (err) {
                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                        })
                    }
                    else {
                        //create new submission
                        if (scope.profileDetail) {
                            var obj = {
                                fields: arr,
                                reference: scope.profileDetail._id,
                                form: scope.currentForm.name
                            };

                            ticketService.getFormSubmissionByRef(scope.profileDetail._id).then(function (responseFS) {
                                //tag submission to ticket

                                if (responseFS.Result) {
                                    ticketService.updateFormSubmissionData(scope.profileDetail._id, obj).then(function (responseUpdate) {
                                        if (responseUpdate.Result) {
                                            userService.mapFormSubmissionToProfile(responseUpdate.Result._id, scope.profileDetail._id).then(function (responseMap) {
                                                //tag submission to ticket

                                                scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                    })
                                }
                                else {
                                    ///////// CHECK FROM HERE //////////
                                    ticketService.createFormSubmissionData(obj).then(function (response) {
                                        //tag submission to ticket
                                        if (response && response.Result) {
                                            userService.mapFormSubmissionToProfile(response.Result._id, scope.profileDetail._id).then(function (responseMap) {
                                                //tag submission to ticket

                                                scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                    })
                                }

                            }).catch(function (err) {
                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                            });


                        }
                        else {
                            scope.showAlert('Operation Failed', 'error', 'Ticket not found');
                        }

                    }


                }
            };

            var convertToSchemaForm = function (formSubmission, callback) {

                //get forms profile

                if (formSubmission && formSubmission.form && formSubmission.form.fields && formSubmission.form.fields.length > 0) {
                    var schema = {
                        type: "object",
                        properties: {}
                    };

                    var form = [];

                    var model = {};
                    scope.buildModel = true;

                    ticketService.getFormsForCompany().then(function (response) {
                        if (response && response.Result && response.Result.profile_form) {
                            //compare two forms
                            if (response.Result.profile_form._id !== formSubmission.form._id) {
                                scope.currentForm = response.Result.profile_form;
                                buildFormSchema(schema, form, response.Result.profile_form.fields);

                                scope.buildModel = false;

                            }
                            else {
                                scope.currentForm = response.Result.profile_form;
                                buildFormSchema(schema, form, response.Result.profile_form.fields);
                            }
                        }
                        else {
                            scope.currentForm = formSubmission.form;
                            buildFormSchema(schema, form, formSubmission.form.fields);
                        }

                        form.push({
                            type: "submit",
                            title: "Save"
                        });

                        if (formSubmission.fields && formSubmission.fields.length > 0) {
                            formSubmission.fields.forEach(function (fieldValueItem) {
                                if (fieldValueItem.field) {
                                    model[fieldValueItem.field] = fieldValueItem.value;
                                }

                            });
                        }

                        var schemaResponse = {};

                        if (!scope.buildModel) {
                            scope.oldFormModel = model;
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: {}
                            }
                        }
                        else {
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: model
                            }

                        }

                        callback(schemaResponse);

                    }).catch(function (err) {
                        scope.currentForm = formSubmission.form;
                        buildFormSchema(schema, form, formSubmission.form.fields);

                        form.push({
                            type: "submit",
                            title: "Save"
                        });

                        if (formSubmission.fields && formSubmission.fields.length > 0) {
                            formSubmission.fields.forEach(function (fieldValueItem) {
                                if (fieldValueItem.field) {
                                    model[fieldValueItem.field] = fieldValueItem.value;
                                }

                            });
                        }

                        var schemaResponse = {};

                        if (!scope.buildModel) {
                            scope.oldFormModel = model;
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: {}
                            }
                        }
                        else {
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: model
                            }

                        }

                        callback(schemaResponse);

                    });


                }
                else {
                    //if (!formSubmission) {
                    //create form submission

                    var schema = {
                        type: "object",
                        properties: {}
                    };

                    var form = [];

                    scope.buildModel = true;

                    ticketService.getFormsForCompany().then(function (response) {
                        if (response && response.Result && response.Result.profile_form) {
                            //compare two forms
                            buildFormSchema(schema, form, response.Result.profile_form.fields);
                            scope.currentForm = response.Result.profile_form;

                            form.push({
                                type: "submit",
                                title: "Save"
                            });


                            var schemaResponse = {};

                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: {}
                            };

                            callback(schemaResponse);
                        }
                        else {
                            callback(null);
                        }


                    }).catch(function (err) {
                        callback(null);

                    });

                    /*}
                     else {
                     callback(null);
                     }*/

                }

            };

            /*form submit end*/

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
                if (!chip.tags || (chip.tags.length === 0)) {
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
                            if (angular.isObject(chip.tags[0])) {
                                var tempTags = [];
                                angular.forEach(chip.tags[0].tags, function (item) {
                                    var tags = $filter('filter')(scope.tagList, {_id: item}, true);
                                    tempTags = tempTags.concat(tags);
                                });
                                scope.availableTags = tempTags;
                            }
                            else {
                                scope.availableTags = chip.tags;
                            }
                            if (scope.availableTags.length === 0) {
                                setToDefault();
                            }
                            return;
                        }
                    }
                    setToDefault();
                }

            };

            scope.loadPostTags = function (query) {
                return scope.postTags;
            };

            var removeDuplicate = function (arr) {
                var newArr = [];
                angular.forEach(arr, function (value, key) {
                    var exists = false;
                    angular.forEach(newArr, function (val2, key) {
                        if (angular.equals(value.name, val2.name)) {
                            exists = true
                        }
                        ;
                    });
                    if (exists == false && value.name != "") {
                        newArr.push(value);
                    }
                });
                return newArr;
            };

            scope.newAddTags = [];
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
                if (ticTag) {
                    scope.postTags.push({name: ticTag});
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
                ticket.engagement_session = scope.sessionId;
                if (scope.postTags) {
                    ticket.tags = scope.postTags.map(function (obj) {
                        return obj.name;
                    });
                }
                if (ticket.related) {
                    ticket.related_tickets = ticket.related.map(function (obj) {
                        return obj._id;
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


            var getExternalUserRecentTickets = function (id) {
                ticketService.GetExternalUserRecentTickets(id).then(function (response) {
                    scope.recentTicketList = response;
                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Recent Tickets.")
                });
            };


            /* Load Profile Details for Current Engagement */

            scope.GetExternalUserProfileByContact = function () {
                var category = "";
                if (scope.direction === 'inbound' || scope.direction === 'outbound') {
                    category = 'phone';
                }

                if (scope.profileDetail) {

                    scope.currentSubmission = scope.profileDetail.form_submission;
                    convertToSchemaForm(scope.profileDetail.form_submission, function (schemaDetails) {
                        if (schemaDetails) {
                            scope.schema = schemaDetails.schema;
                            scope.form = schemaDetails.form;
                            scope.model = schemaDetails.model;
                        }

                    });


                    scope.GetProfileHistory(scope.profileDetail._id);
                    getExternalUserRecentTickets(scope.profileDetail._id);
                } else {
                    userService.GetExternalUserProfileByContact(category, scope.channelFrom).then(function (response) {
                        scope.profileDetails = response;
                        if (scope.profileDetails) {
                            if (scope.profileDetails.length == 1) {
                                scope.profileDetail = scope.profileDetails[0];

                                scope.currentSubmission = scope.profileDetails[0].form_submission;
                                convertToSchemaForm(scope.profileDetails[0].form_submission, function (schemaDetails) {
                                    if (schemaDetails) {
                                        scope.schema = schemaDetails.schema;
                                        scope.form = schemaDetails.form;
                                        scope.model = schemaDetails.model;
                                    }

                                });


                                scope.GetProfileHistory(scope.profileDetail._id);
                                getExternalUserRecentTickets(scope.profileDetail._id);
                            }
                            else if (scope.profileDetails.length > 1) {
                                // show multiple profile selection view
                                scope.showMultiProfile = true;
                                scope.showNewProfile = false;
                            }
                            else {
                                // show new profile
                                scope.showMultiProfile = false;
                                scope.showNewProfile = true;
                            }
                        }
                        else {
                            // show new profile
                            scope.showMultiProfile = false;
                            scope.showNewProfile = true;
                        }
                    }, function (err) {
                        scope.showAlert("User Profile", "error", "Fail To Get User Profile Details.")
                    });
                }
            };
            scope.GetExternalUserProfileByContact();


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

            scope.showProfileView = function (viewName, currentBtn) {
                profileDisable();
                $(viewName).removeClass('display-none').addClass('display-block ');
                $(currentBtn).addClass('active');
            };

            scope.gotoTicket = function (data) {
                data.tabType = "ticketView";
                data.activeSession = {
                    "sessionId": scope.sessionId,
                    "direction": scope.direction,
                    "channelFrom": scope.channelFrom,
                    "channelTo": scope.channelTo,
                    "channel": scope.channel,
                    "skill": scope.skill,
                    "authorExternal": scope.profileDetail._id
                };
                $rootScope.$emit('openNewTab', data);
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


            // New Profile

            scope.newProfile = {
                "title": "",
                "name": "",
                "avatar": "",
                "birthday": "",
                "gender": "",
                "firstname": "",
                "lastname": "",
                "locale": 0,
                "ssn": "",
                "address": {
                    "zipcode": "",
                    "number": "",
                    "street": "",
                    "city": "",
                    "province": "",
                    "country": ""
                },
                "phone": "",
                "email": "",
                "dob": {
                    "day": 0,
                    "month": 0,
                    "year": 0
                }
            };

            scope.countryList = [
                {name: 'Afghanistan', code: 'AF'},
                {name: 'Aland Islands', code: 'AX'},
                {name: 'Albania', code: 'AL'},
                {name: 'Algeria', code: 'DZ'},
                {name: 'American Samoa', code: 'AS'},
                {name: 'AndorrA', code: 'AD'},
                {name: 'Angola', code: 'AO'},
                {name: 'Anguilla', code: 'AI'},
                {name: 'Antarctica', code: 'AQ'},
                {name: 'Antigua and Barbuda', code: 'AG'},
                {name: 'Argentina', code: 'AR'},
                {name: 'Armenia', code: 'AM'},
                {name: 'Aruba', code: 'AW'},
                {name: 'Australia', code: 'AU'},
                {name: 'Austria', code: 'AT'},
                {name: 'Azerbaijan', code: 'AZ'},
                {name: 'Bahamas', code: 'BS'},
                {name: 'Bahrain', code: 'BH'},
                {name: 'Bangladesh', code: 'BD'},
                {name: 'Barbados', code: 'BB'},
                {name: 'Belarus', code: 'BY'},
                {name: 'Belgium', code: 'BE'},
                {name: 'Belize', code: 'BZ'},
                {name: 'Benin', code: 'BJ'},
                {name: 'Bermuda', code: 'BM'},
                {name: 'Bhutan', code: 'BT'},
                {name: 'Bolivia', code: 'BO'},
                {name: 'Bosnia and Herzegovina', code: 'BA'},
                {name: 'Botswana', code: 'BW'},
                {name: 'Bouvet Island', code: 'BV'},
                {name: 'Brazil', code: 'BR'},
                {name: 'British Indian Ocean Territory', code: 'IO'},
                {name: 'Brunei Darussalam', code: 'BN'},
                {name: 'Bulgaria', code: 'BG'},
                {name: 'Burkina Faso', code: 'BF'},
                {name: 'Burundi', code: 'BI'},
                {name: 'Cambodia', code: 'KH'},
                {name: 'Cameroon', code: 'CM'},
                {name: 'Canada', code: 'CA'},
                {name: 'Cape Verde', code: 'CV'},
                {name: 'Cayman Islands', code: 'KY'},
                {name: 'Central African Republic', code: 'CF'},
                {name: 'Chad', code: 'TD'},
                {name: 'Chile', code: 'CL'},
                {name: 'China', code: 'CN'},
                {name: 'Christmas Island', code: 'CX'},
                {name: 'Cocos (Keeling) Islands', code: 'CC'},
                {name: 'Colombia', code: 'CO'},
                {name: 'Comoros', code: 'KM'},
                {name: 'Congo', code: 'CG'},
                {name: 'Congo, The Democratic Republic of the', code: 'CD'},
                {name: 'Cook Islands', code: 'CK'},
                {name: 'Costa Rica', code: 'CR'},
                {name: 'Cote D\'Ivoire', code: 'CI'},
                {name: 'Croatia', code: 'HR'},
                {name: 'Cuba', code: 'CU'},
                {name: 'Cyprus', code: 'CY'},
                {name: 'Czech Republic', code: 'CZ'},
                {name: 'Denmark', code: 'DK'},
                {name: 'Djibouti', code: 'DJ'},
                {name: 'Dominica', code: 'DM'},
                {name: 'Dominican Republic', code: 'DO'},
                {name: 'Ecuador', code: 'EC'},
                {name: 'Egypt', code: 'EG'},
                {name: 'El Salvador', code: 'SV'},
                {name: 'Equatorial Guinea', code: 'GQ'},
                {name: 'Eritrea', code: 'ER'},
                {name: 'Estonia', code: 'EE'},
                {name: 'Ethiopia', code: 'ET'},
                {name: 'Falkland Islands (Malvinas)', code: 'FK'},
                {name: 'Faroe Islands', code: 'FO'},
                {name: 'Fiji', code: 'FJ'},
                {name: 'Finland', code: 'FI'},
                {name: 'France', code: 'FR'},
                {name: 'French Guiana', code: 'GF'},
                {name: 'French Polynesia', code: 'PF'},
                {name: 'French Southern Territories', code: 'TF'},
                {name: 'Gabon', code: 'GA'},
                {name: 'Gambia', code: 'GM'},
                {name: 'Georgia', code: 'GE'},
                {name: 'Germany', code: 'DE'},
                {name: 'Ghana', code: 'GH'},
                {name: 'Gibraltar', code: 'GI'},
                {name: 'Greece', code: 'GR'},
                {name: 'Greenland', code: 'GL'},
                {name: 'Grenada', code: 'GD'},
                {name: 'Guadeloupe', code: 'GP'},
                {name: 'Guam', code: 'GU'},
                {name: 'Guatemala', code: 'GT'},
                {name: 'Guernsey', code: 'GG'},
                {name: 'Guinea', code: 'GN'},
                {name: 'Guinea-Bissau', code: 'GW'},
                {name: 'Guyana', code: 'GY'},
                {name: 'Haiti', code: 'HT'},
                {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
                {name: 'Holy See (Vatican City State)', code: 'VA'},
                {name: 'Honduras', code: 'HN'},
                {name: 'Hong Kong', code: 'HK'},
                {name: 'Hungary', code: 'HU'},
                {name: 'Iceland', code: 'IS'},
                {name: 'India', code: 'IN'},
                {name: 'Indonesia', code: 'ID'},
                {name: 'Iran, Islamic Republic Of', code: 'IR'},
                {name: 'Iraq', code: 'IQ'},
                {name: 'Ireland', code: 'IE'},
                {name: 'Isle of Man', code: 'IM'},
                {name: 'Israel', code: 'IL'},
                {name: 'Italy', code: 'IT'},
                {name: 'Jamaica', code: 'JM'},
                {name: 'Japan', code: 'JP'},
                {name: 'Jersey', code: 'JE'},
                {name: 'Jordan', code: 'JO'},
                {name: 'Kazakhstan', code: 'KZ'},
                {name: 'Kenya', code: 'KE'},
                {name: 'Kiribati', code: 'KI'},
                {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
                {name: 'Korea, Republic of', code: 'KR'},
                {name: 'Kuwait', code: 'KW'},
                {name: 'Kyrgyzstan', code: 'KG'},
                {name: 'Lao People\'S Democratic Republic', code: 'LA'},
                {name: 'Latvia', code: 'LV'},
                {name: 'Lebanon', code: 'LB'},
                {name: 'Lesotho', code: 'LS'},
                {name: 'Liberia', code: 'LR'},
                {name: 'Libyan Arab Jamahiriya', code: 'LY'},
                {name: 'Liechtenstein', code: 'LI'},
                {name: 'Lithuania', code: 'LT'},
                {name: 'Luxembourg', code: 'LU'},
                {name: 'Macao', code: 'MO'},
                {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
                {name: 'Madagascar', code: 'MG'},
                {name: 'Malawi', code: 'MW'},
                {name: 'Malaysia', code: 'MY'},
                {name: 'Maldives', code: 'MV'},
                {name: 'Mali', code: 'ML'},
                {name: 'Malta', code: 'MT'},
                {name: 'Marshall Islands', code: 'MH'},
                {name: 'Martinique', code: 'MQ'},
                {name: 'Mauritania', code: 'MR'},
                {name: 'Mauritius', code: 'MU'},
                {name: 'Mayotte', code: 'YT'},
                {name: 'Mexico', code: 'MX'},
                {name: 'Micronesia, Federated States of', code: 'FM'},
                {name: 'Moldova, Republic of', code: 'MD'},
                {name: 'Monaco', code: 'MC'},
                {name: 'Mongolia', code: 'MN'},
                {name: 'Montserrat', code: 'MS'},
                {name: 'Morocco', code: 'MA'},
                {name: 'Mozambique', code: 'MZ'},
                {name: 'Myanmar', code: 'MM'},
                {name: 'Namibia', code: 'NA'},
                {name: 'Nauru', code: 'NR'},
                {name: 'Nepal', code: 'NP'},
                {name: 'Netherlands', code: 'NL'},
                {name: 'Netherlands Antilles', code: 'AN'},
                {name: 'New Caledonia', code: 'NC'},
                {name: 'New Zealand', code: 'NZ'},
                {name: 'Nicaragua', code: 'NI'},
                {name: 'Niger', code: 'NE'},
                {name: 'Nigeria', code: 'NG'},
                {name: 'Niue', code: 'NU'},
                {name: 'Norfolk Island', code: 'NF'},
                {name: 'Northern Mariana Islands', code: 'MP'},
                {name: 'Norway', code: 'NO'},
                {name: 'Oman', code: 'OM'},
                {name: 'Pakistan', code: 'PK'},
                {name: 'Palau', code: 'PW'},
                {name: 'Palestinian Territory, Occupied', code: 'PS'},
                {name: 'Panama', code: 'PA'},
                {name: 'Papua New Guinea', code: 'PG'},
                {name: 'Paraguay', code: 'PY'},
                {name: 'Peru', code: 'PE'},
                {name: 'Philippines', code: 'PH'},
                {name: 'Pitcairn', code: 'PN'},
                {name: 'Poland', code: 'PL'},
                {name: 'Portugal', code: 'PT'},
                {name: 'Puerto Rico', code: 'PR'},
                {name: 'Qatar', code: 'QA'},
                {name: 'Reunion', code: 'RE'},
                {name: 'Romania', code: 'RO'},
                {name: 'Russian Federation', code: 'RU'},
                {name: 'RWANDA', code: 'RW'},
                {name: 'Saint Helena', code: 'SH'},
                {name: 'Saint Kitts and Nevis', code: 'KN'},
                {name: 'Saint Lucia', code: 'LC'},
                {name: 'Saint Pierre and Miquelon', code: 'PM'},
                {name: 'Saint Vincent and the Grenadines', code: 'VC'},
                {name: 'Samoa', code: 'WS'},
                {name: 'San Marino', code: 'SM'},
                {name: 'Sao Tome and Principe', code: 'ST'},
                {name: 'Saudi Arabia', code: 'SA'},
                {name: 'Senegal', code: 'SN'},
                {name: 'Serbia and Montenegro', code: 'CS'},
                {name: 'Seychelles', code: 'SC'},
                {name: 'Sierra Leone', code: 'SL'},
                {name: 'Singapore', code: 'SG'},
                {name: 'Slovakia', code: 'SK'},
                {name: 'Slovenia', code: 'SI'},
                {name: 'Solomon Islands', code: 'SB'},
                {name: 'Somalia', code: 'SO'},
                {name: 'South Africa', code: 'ZA'},
                {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
                {name: 'Spain', code: 'ES'},
                {name: 'Sri Lanka', code: 'LK'},
                {name: 'Sudan', code: 'SD'},
                {name: 'Suriname', code: 'SR'},
                {name: 'Svalbard and Jan Mayen', code: 'SJ'},
                {name: 'Swaziland', code: 'SZ'},
                {name: 'Sweden', code: 'SE'},
                {name: 'Switzerland', code: 'CH'},
                {name: 'Syrian Arab Republic', code: 'SY'},
                {name: 'Taiwan, Province of China', code: 'TW'},
                {name: 'Tajikistan', code: 'TJ'},
                {name: 'Tanzania, United Republic of', code: 'TZ'},
                {name: 'Thailand', code: 'TH'},
                {name: 'Timor-Leste', code: 'TL'},
                {name: 'Togo', code: 'TG'},
                {name: 'Tokelau', code: 'TK'},
                {name: 'Tonga', code: 'TO'},
                {name: 'Trinidad and Tobago', code: 'TT'},
                {name: 'Tunisia', code: 'TN'},
                {name: 'Turkey', code: 'TR'},
                {name: 'Turkmenistan', code: 'TM'},
                {name: 'Turks and Caicos Islands', code: 'TC'},
                {name: 'Tuvalu', code: 'TV'},
                {name: 'Uganda', code: 'UG'},
                {name: 'Ukraine', code: 'UA'},
                {name: 'United Arab Emirates', code: 'AE'},
                {name: 'United Kingdom', code: 'GB'},
                {name: 'United States', code: 'US'},
                {name: 'United States Minor Outlying Islands', code: 'UM'},
                {name: 'Uruguay', code: 'UY'},
                {name: 'Uzbekistan', code: 'UZ'},
                {name: 'Vanuatu', code: 'VU'},
                {name: 'Venezuela', code: 'VE'},
                {name: 'Viet Nam', code: 'VN'},
                {name: 'Virgin Islands, British', code: 'VG'},
                {name: 'Virgin Islands, U.S.', code: 'VI'},
                {name: 'Wallis and Futuna', code: 'WF'},
                {name: 'Western Sahara', code: 'EH'},
                {name: 'Yemen', code: 'YE'},
                {name: 'Zambia', code: 'ZM'},
                {name: 'Zimbabwe', code: 'ZW'}
            ];
            scope.languages = [
                {"code": "ab", "name": "Abkhaz", "nativeName": "?????"},
                {"code": "aa", "name": "Afar", "nativeName": "Afaraf"},
                {"code": "af", "name": "Afrikaans", "nativeName": "Afrikaans"},
                {"code": "ak", "name": "Akan", "nativeName": "Akan"},
                {"code": "sq", "name": "Albanian", "nativeName": "Shqip"},
                {"code": "am", "name": "Amharic", "nativeName": "????"},
                {"code": "ar", "name": "Arabic", "nativeName": "???????"},
                {"code": "an", "name": "Aragonese", "nativeName": "Aragonés"},
                {"code": "hy", "name": "Armenian", "nativeName": "???????"},
                {"code": "as", "name": "Assamese", "nativeName": "???????"},
                {"code": "av", "name": "Avaric", "nativeName": "???? ????, ???????? ????"},
                {"code": "ae", "name": "Avestan", "nativeName": "avesta"},
                {"code": "ay", "name": "Aymara", "nativeName": "aymar aru"},
                {"code": "az", "name": "Azerbaijani", "nativeName": "az?rbaycan dili"},
                {"code": "bm", "name": "Bambara", "nativeName": "bamanankan"},
                {"code": "ba", "name": "Bashkir", "nativeName": "??????? ????"},
                {"code": "eu", "name": "Basque", "nativeName": "euskara, euskera"},
                {"code": "be", "name": "Belarusian", "nativeName": "??????????"},
                {"code": "bn", "name": "Bengali", "nativeName": "?????"},
                {"code": "bh", "name": "Bihari", "nativeName": "???????"},
                {"code": "bi", "name": "Bislama", "nativeName": "Bislama"},
                {"code": "bs", "name": "Bosnian", "nativeName": "bosanski jezik"},
                {"code": "br", "name": "Breton", "nativeName": "brezhoneg"},
                {"code": "bg", "name": "Bulgarian", "nativeName": "????????? ????"},
                {"code": "my", "name": "Burmese", "nativeName": "?????"},
                {"code": "ca", "name": "Catalan; Valencian", "nativeName": "Català"},
                {"code": "ch", "name": "Chamorro", "nativeName": "Chamoru"},
                {"code": "ce", "name": "Chechen", "nativeName": "??????? ????"},
                {"code": "ny", "name": "Chichewa; Chewa; Nyanja", "nativeName": "chiChe?a, chinyanja"},
                {"code": "zh", "name": "Chinese", "nativeName": "?? (Zh?ngwén), ??, ??"},
                {"code": "cv", "name": "Chuvash", "nativeName": "????? ?????"},
                {"code": "kw", "name": "Cornish", "nativeName": "Kernewek"},
                {"code": "co", "name": "Corsican", "nativeName": "corsu, lingua corsa"},
                {"code": "cr", "name": "Cree", "nativeName": "???????"},
                {"code": "hr", "name": "Croatian", "nativeName": "hrvatski"},
                {"code": "cs", "name": "Czech", "nativeName": "?esky, ?eština"},
                {"code": "da", "name": "Danish", "nativeName": "dansk"},
                {"code": "dv", "name": "Divehi; Dhivehi; Maldivian;", "nativeName": "??????"},
                {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
                {"code": "en", "name": "English", "nativeName": "English"},
                {"code": "eo", "name": "Esperanto", "nativeName": "Esperanto"},
                {"code": "et", "name": "Estonian", "nativeName": "eesti, eesti keel"},
                {"code": "ee", "name": "Ewe", "nativeName": "E?egbe"},
                {"code": "fo", "name": "Faroese", "nativeName": "føroyskt"},
                {"code": "fj", "name": "Fijian", "nativeName": "vosa Vakaviti"},
                {"code": "fi", "name": "Finnish", "nativeName": "suomi, suomen kieli"},
                {"code": "fr", "name": "French", "nativeName": "français, langue française"},
                {"code": "ff", "name": "Fula; Fulah; Pulaar; Pular", "nativeName": "Fulfulde, Pulaar, Pular"},
                {"code": "gl", "name": "Galician", "nativeName": "Galego"},
                {"code": "ka", "name": "Georgian", "nativeName": "???????"},
                {"code": "de", "name": "German", "nativeName": "Deutsch"},
                {"code": "el", "name": "Greek, Modern", "nativeName": "????????"},
                {"code": "gn", "name": "Guaraní", "nativeName": "Avañe?"},
                {"code": "gu", "name": "Gujarati", "nativeName": "???????"},
                {"code": "ht", "name": "Haitian; Haitian Creole", "nativeName": "Kreyòl ayisyen"},
                {"code": "ha", "name": "Hausa", "nativeName": "Hausa, ??????"},
                {"code": "he", "name": "Hebrew (modern)", "nativeName": "?????"},
                {"code": "hz", "name": "Herero", "nativeName": "Otjiherero"},
                {"code": "hi", "name": "Hindi", "nativeName": "??????, ?????"},
                {"code": "ho", "name": "Hiri Motu", "nativeName": "Hiri Motu"},
                {"code": "hu", "name": "Hungarian", "nativeName": "Magyar"},
                {"code": "ia", "name": "Interlingua", "nativeName": "Interlingua"},
                {"code": "id", "name": "Indonesian", "nativeName": "Bahasa Indonesia"},
                {
                    "code": "ie",
                    "name": "Interlingue",
                    "nativeName": "Originally called Occidental; then Interlingue after WWII"
                },
                {"code": "ga", "name": "Irish", "nativeName": "Gaeilge"},
                {"code": "ig", "name": "Igbo", "nativeName": "As?s? Igbo"},
                {"code": "ik", "name": "Inupiaq", "nativeName": "Iñupiaq, Iñupiatun"},
                {"code": "io", "name": "Ido", "nativeName": "Ido"},
                {"code": "is", "name": "Icelandic", "nativeName": "Íslenska"},
                {"code": "it", "name": "Italian", "nativeName": "Italiano"},
                {"code": "iu", "name": "Inuktitut", "nativeName": "??????"},
                {"code": "ja", "name": "Japanese", "nativeName": "??? (??????????)"},
                {"code": "jv", "name": "Javanese", "nativeName": "basa Jawa"},
                {"code": "kl", "name": "Kalaallisut, Greenlandic", "nativeName": "kalaallisut, kalaallit oqaasii"},
                {"code": "kn", "name": "Kannada", "nativeName": "?????"},
                {"code": "kr", "name": "Kanuri", "nativeName": "Kanuri"},
                {"code": "ks", "name": "Kashmiri", "nativeName": "???????, ???????"},
                {"code": "kk", "name": "Kazakh", "nativeName": "????? ????"},
                {"code": "km", "name": "Khmer", "nativeName": "?????????"},
                {"code": "ki", "name": "Kikuyu, Gikuyu", "nativeName": "G?k?y?"},
                {"code": "rw", "name": "Kinyarwanda", "nativeName": "Ikinyarwanda"},
                {"code": "ky", "name": "Kirghiz, Kyrgyz", "nativeName": "?????? ????"},
                {"code": "kv", "name": "Komi", "nativeName": "???? ???"},
                {"code": "kg", "name": "Kongo", "nativeName": "KiKongo"},
                {"code": "ko", "name": "Korean", "nativeName": "??? (???), ??? (???)"},
                {"code": "ku", "name": "Kurdish", "nativeName": "Kurdî, ??????"},
                {"code": "kj", "name": "Kwanyama, Kuanyama", "nativeName": "Kuanyama"},
                {"code": "la", "name": "Latin", "nativeName": "latine, lingua latina"},
                {"code": "lb", "name": "Luxembourgish, Letzeburgesch", "nativeName": "Lëtzebuergesch"},
                {"code": "lg", "name": "Luganda", "nativeName": "Luganda"},
                {"code": "li", "name": "Limburgish, Limburgan, Limburger", "nativeName": "Limburgs"},
                {"code": "ln", "name": "Lingala", "nativeName": "Lingála"},
                {"code": "lo", "name": "Lao", "nativeName": "???????"},
                {"code": "lt", "name": "Lithuanian", "nativeName": "lietuvi? kalba"},
                {"code": "lu", "name": "Luba-Katanga", "nativeName": ""},
                {"code": "lv", "name": "Latvian", "nativeName": "latviešu valoda"},
                {"code": "gv", "name": "Manx", "nativeName": "Gaelg, Gailck"},
                {"code": "mk", "name": "Macedonian", "nativeName": "?????????? ?????"},
                {"code": "mg", "name": "Malagasy", "nativeName": "Malagasy fiteny"},
                {"code": "ms", "name": "Malay", "nativeName": "bahasa Melayu, ???? ??????"},
                {"code": "ml", "name": "Malayalam", "nativeName": "??????"},
                {"code": "mt", "name": "Maltese", "nativeName": "Malti"},
                {"code": "mi", "name": "Maori", "nativeName": "te reo M?ori"},
                {"code": "mr", "name": "Marathi", "nativeName": "?????"},
                {"code": "mh", "name": "Marshallese", "nativeName": "Kajin M?aje?"},
                {"code": "mn", "name": "Mongolian", "nativeName": "??????"},
                {"code": "na", "name": "Nauru", "nativeName": "Ekakair? Naoero"},
                {"code": "nv", "name": "Navajo, Navaho", "nativeName": "Diné bizaad, Dinék?eh?í"},
                {"code": "nb", "name": "Norwegian Bokmal", "nativeName": "Norsk bokmål"},
                {"code": "nd", "name": "North Ndebele", "nativeName": "isiNdebele"},
                {"code": "ne", "name": "Nepali", "nativeName": "??????"},
                {"code": "ng", "name": "Ndonga", "nativeName": "Owambo"},
                {"code": "nn", "name": "Norwegian Nynorsk", "nativeName": "Norsk nynorsk"},
                {"code": "no", "name": "Norwegian", "nativeName": "Norsk"},
                {"code": "ii", "name": "Nuosu", "nativeName": "??? Nuosuhxop"},
                {"code": "nr", "name": "South Ndebele", "nativeName": "isiNdebele"},
                {"code": "oc", "name": "Occitan", "nativeName": "Occitan"},
                {"code": "oj", "name": "Ojibwe, Ojibwa", "nativeName": "????????"},
                {
                    "code": "cu",
                    "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
                    "nativeName": "????? ??????????"
                },
                {"code": "om", "name": "Oromo", "nativeName": "Afaan Oromoo"},
                {"code": "or", "name": "Oriya", "nativeName": "?????"},
                {"code": "os", "name": "Ossetian, Ossetic", "nativeName": "???? æ????"},
                {"code": "pa", "name": "Panjabi, Punjabi", "nativeName": "??????, ???????"},
                {"code": "pi", "name": "Pali", "nativeName": "????"},
                {"code": "fa", "name": "Persian", "nativeName": "?????"},
                {"code": "pl", "name": "Polish", "nativeName": "polski"},
                {"code": "ps", "name": "Pashto, Pushto", "nativeName": "????"},
                {"code": "pt", "name": "Portuguese", "nativeName": "Português"},
                {"code": "qu", "name": "Quechua", "nativeName": "Runa Simi, Kichwa"},
                {"code": "rm", "name": "Romansh", "nativeName": "rumantsch grischun"},
                {"code": "rn", "name": "Kirundi", "nativeName": "kiRundi"},
                {"code": "ro", "name": "Romanian, Moldavian, Moldovan", "nativeName": "român?"},
                {"code": "ru", "name": "Russian", "nativeName": "??????? ????"},
                {"code": "sa", "name": "Sanskrit (Sa?sk?ta)", "nativeName": "?????????"},
                {"code": "sc", "name": "Sardinian", "nativeName": "sardu"},
                {"code": "sd", "name": "Sindhi", "nativeName": "??????, ????? ??????"},
                {"code": "se", "name": "Northern Sami", "nativeName": "Davvisámegiella"},
                {"code": "sm", "name": "Samoan", "nativeName": "gagana faa Samoa"},
                {"code": "sg", "name": "Sango", "nativeName": "yângâ tî sängö"},
                {"code": "sr", "name": "Serbian", "nativeName": "?????? ?????"},
                {"code": "gd", "name": "Scottish Gaelic; Gaelic", "nativeName": "Gàidhlig"},
                {"code": "sn", "name": "Shona", "nativeName": "chiShona"},
                {"code": "si", "name": "Sinhala, Sinhalese", "nativeName": "?????"},
                {"code": "sk", "name": "Slovak", "nativeName": "sloven?ina"},
                {"code": "sl", "name": "Slovene", "nativeName": "slovenš?ina"},
                {"code": "so", "name": "Somali", "nativeName": "Soomaaliga, af Soomaali"},
                {"code": "st", "name": "Southern Sotho", "nativeName": "Sesotho"},
                {"code": "es", "name": "Spanish; Castilian", "nativeName": "español, castellano"},
                {"code": "su", "name": "Sundanese", "nativeName": "Basa Sunda"},
                {"code": "sw", "name": "Swahili", "nativeName": "Kiswahili"},
                {"code": "ss", "name": "Swati", "nativeName": "SiSwati"},
                {"code": "sv", "name": "Swedish", "nativeName": "svenska"},
                {"code": "ta", "name": "Tamil", "nativeName": "?????"},
                {"code": "te", "name": "Telugu", "nativeName": "??????"},
                {"code": "tg", "name": "Tajik", "nativeName": "??????, to?ik?, ???????"},
                {"code": "th", "name": "Thai", "nativeName": "???"},
                {"code": "ti", "name": "Tigrinya", "nativeName": "????"},
                {"code": "bo", "name": "Tibetan Standard, Tibetan, Central", "nativeName": "???????"},
                {"code": "tk", "name": "Turkmen", "nativeName": "Türkmen, ???????"},
                {"code": "tl", "name": "Tagalog", "nativeName": "Wikang Tagalog, ????? ??????"},
                {"code": "tn", "name": "Tswana", "nativeName": "Setswana"},
                {"code": "to", "name": "Tonga (Tonga Islands)", "nativeName": "faka Tonga"},
                {"code": "tr", "name": "Turkish", "nativeName": "Türkçe"},
                {"code": "ts", "name": "Tsonga", "nativeName": "Xitsonga"},
                {"code": "tt", "name": "Tatar", "nativeName": "???????, tatarça, ????????"},
                {"code": "tw", "name": "Twi", "nativeName": "Twi"},
                {"code": "ty", "name": "Tahitian", "nativeName": "Reo Tahiti"},
                {"code": "ug", "name": "Uighur, Uyghur", "nativeName": "Uy?urq?, ?????????"},
                {"code": "uk", "name": "Ukrainian", "nativeName": "??????????"},
                {"code": "ur", "name": "Urdu", "nativeName": "????"},
                {"code": "uz", "name": "Uzbek", "nativeName": "zbek, ?????, ???????"},
                {"code": "ve", "name": "Venda", "nativeName": "Tshiven?a"},
                {"code": "vi", "name": "Vietnamese", "nativeName": "Ti?ng Vi?t"},
                {"code": "vo", "name": "Volapuk", "nativeName": "Volapük"},
                {"code": "wa", "name": "Walloon", "nativeName": "Walon"},
                {"code": "cy", "name": "Welsh", "nativeName": "Cymraeg"},
                {"code": "wo", "name": "Wolof", "nativeName": "Wollof"},
                {"code": "fy", "name": "Western Frisian", "nativeName": "Frysk"},
                {"code": "xh", "name": "Xhosa", "nativeName": "isiXhosa"},
                {"code": "yi", "name": "Yiddish", "nativeName": "??????"},
                {"code": "yo", "name": "Yoruba", "nativeName": "Yorùbá"},
                {"code": "za", "name": "Zhuang, Chuang", "nativeName": "Sa? cue??, Saw cuengh"}
            ];
            var genDayList = function () {
                var max = 31;

                var dayArr = [];

                for (min = 1; min <= max; min++) {
                    dayArr.push(min);
                }

                return dayArr;
            };

            scope.dayList = genDayList();
            scope.monthList = [
                {index: 1, name: "January"},
                {index: 2, name: "February"},
                {index: 3, name: "March"},
                {index: 4, name: "April"},
                {index: 5, name: "May"},
                {index: 6, name: "June"},
                {index: 7, name: "July"},
                {index: 8, name: "August"},
                {index: 9, name: "September"},
                {index: 10, name: "October"},
                {index: 11, name: "November"},
                {index: 12, name: "December"}

            ];
            scope.yearList = [];
            var getYears = function () {
                var currentYear = new Date().getFullYear();
                for (var i = 0; i < 100 + 1; i++) {
                    scope.yearList.push(currentYear - i);
                }
            };
            getYears();
            scope.saveNewProfile = function (profile) {
                var collectionDate = profile.dob.year + '-' + profile.dob.month + '-' + profile.dob.day;
                profile.birthday = new Date(collectionDate);
                userService.CreateExternalUser(profile).then(function (response) {
                    if (response) {
                        scope.GetExternalUserProfileByContact();
                    }
                    else {
                        scope.showAlert("Profile", "error", "Fail To Save Profile.");
                    }
                }, function (err) {
                    scope.showAlert("Profile", "error", "Fail To Save Profile.");
                });
            };

            //engagement console
            //image crop deatails
            scope.isShowCrop = false;
            scope.myImage = '';
            scope.myCroppedImage = '';
            scope.cropImageURL = null;

            scope.viewCropArea = function () {
                scope.isShowCrop = !scope.isShowCrop;
            };
            scope.cropImage = function () {
                scope.cropImageURL = scope.myCroppedImage;
                scope.isShowCrop = !scope.isShowCrop;
            };

            //update code damith
            //create new profile
            //view multiple profile
            scope.multipleProfile = function () {
                scope.modelHeader = null;
                scope.showMultipleProfile = false;
                scope.foundProfiles = false;
                scope.showNewProfile = false;
                return {
                    showProfiles: function () {
                        scope.showMultipleProfile = true;
                        scope.foundProfiles = true;
                        scope.showNewProfile = false;
                        this.getModelHeader();
                    },
                    closeProfile: function () {
                        scope.showMultipleProfile = false;
                        scope.foundProfiles = false;
                        scope.showNewProfile = false;
                    },
                    createNewProfile: function () {
                        scope.showMultipleProfile = true;
                        scope.foundProfiles = false;
                        scope.showNewProfile = true;
                        this.getModelHeader();
                    },
                    closeNewProfile: function () {
                        scope.showNewProfile = false;
                    },
                    closeProfileSelection: function () {
                        scope.showMultiProfile = false;
                    },
                    openSelectedProfile: function (profile) {
                        scope.profileDetail = profile;
                        scope.showMultiProfile = false;
                        scope.showNewProfile = false;
                    },
                    getModelHeader: function () {
                        if (scope.showMultipleProfile) {
                            scope.modelHeader = "Found 3 Multiple Profiles";
                        }
                        if (scope.showNewProfile) {
                            scope.modelHeader = " Create New Profile";
                        }
                    }
                }
            }();//end
        }
    }
}).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.myImage = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
