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

agentApp.directive("engagementTab", function ($filter, $rootScope, engagementService, ivrService,
                                              userService, ticketService, tagService, $http,authService) {
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
            profileDetail: "=",
            tabReference: "@",
            searchUsers: "="
        },
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {


            /*Initialize default scope*/
            scope.companyName="";
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


            scope.pickCompanyInfo = function () {
                var userCompanyData = authService.GetCompanyInfo();
                ticketService.pickCompanyInfo(userCompanyData.tenant,userCompanyData.company).then(function (response) {
                    if(response.data.IsSuccess)
                    {
                        scope.companyName=response.data.Result.companyName;
                    }
                    else
                    {
                        console.log("No company info found");
                    }

                }, function (error) {
                    console.log("Error in loading company info",error);
                })
            };


            scope.pickCompanyInfo();


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
                            scope.showAlert('Profile Other Data', 'success', 'Profile other data saved successfully');

                        }).catch(function (err) {
                            scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

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

                                                scope.showAlert('Profile Other Data', 'success', 'Profile other data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

                                    })
                                }
                                else {

                                    ticketService.createFormSubmissionData(obj).then(function (response) {
                                        //tag submission to ticket
                                        if (response && response.Result) {
                                            userService.mapFormSubmissionToProfile(response.Result._id, scope.profileDetail._id).then(function (responseMap) {
                                                //tag submission to ticket

                                                scope.showAlert('Profile Other Data', 'success', 'Profile other data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

                                    })
                                }

                            }).catch(function (err) {
                                scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');

                            });


                        }
                        else {
                            scope.showAlert('Profile Other Data', 'error', 'Profile other data save failed');
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
                    if (response.IsSuccess) {
                        scope.ticketList.splice(0, 0, response.Result); //scope.ticketList.push(response.Result);
                        scope.recentTicketList.pop();
                        scope.recentTicketList.push(response.Result);
                        scope.ticket = {};
                        scope.newAddTags = [];
                    } else {
                        scope.showAlert("Ticket", "error", "Fail To Save Ticket.")

                    }
                    scope.showCreateTicket = !response.IsSuccess;
                }, function (err) {
                    scope.showAlert("Save Ticket", "error", "Fail To Save Ticket.");
                });


            };

            scope.showCreateTicket = false;


            scope.showNewTicket = function () {
                if (scope.profileDetail && scope.profileDetail._id) {
                    scope.showCreateTicket = !scope.showCreateTicket;
                } else {
                    scope.showAlert("Ticket", "error", "Please Create Profile First.")
                }

                /*if (scope.showCreateTicket) {
                 if (scope.users.length > 0) {
                 var id = ticketService.GetResourceIss();
                 scope.ids = $filter('filter')(scope.users, {username: id});
                 if (scope.ids) {
                 if (scope.ids.length > 0) {
                 scope.ticket.assignee = scope.ids[0]._id;
                 }
                 }
                 }
                 }*/
            };
            scope.closeNewTicket = function () {
                scope.showCreateTicket = false;
            };


            /* Load Past Engagements By Profile ID */


            scope.showMore = function () {
                console.log('show more triggered');
                scope.loadNextEngagement();
            };

            scope.recentEngList = []
            scope.currentPage = 1;
            scope.loadNextEngagement = function () {
                var begin = ((scope.currentPage - 1) * 10)
                    , end = begin + 10;

                var ids = scope.sessionIds.slice(begin, end);
                if (ids) {
                    scope.currentPage = scope.currentPage + 1;
                    engagementService.GetEngagementSessions(scope.engagementId, ids).then(function (reply) {
                        scope.engagementsList = scope.engagementsList.concat(reply);

                        if (angular.isArray(reply) && scope.recentEngList.length === 0) {
                            scope.recentEngList = reply.slice(0, 1);
                        }

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
            scope.AppendNoteToEngagementSession = function (note) {
                if (!note) {
                    scope.showAlert("Note", "error", "Please Enter Note to Save.");
                    return;
                }
                engagementService.AppendNoteToEngagementSession(scope.sessionId, {body: note}).then(function (response) {
                    if (response) {
                        scope.currentEngagement.notes.push({body: note});
                        document.getElementById("noteBody").innerHTML = "";
                        document.getElementById("noteBody").value = "";
                        scope.showAlert("Note", "success", "Note Add Successfully.");

                    }
                    else {
                        scope.showAlert("Note", "error", "Fail To Add Note.");
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
            scope.recentTicketList = [];
            scope.GetAllTicketsByRequester = function (requester, page) {
                ticketService.GetAllTicketsByRequester(requester, page).then(function (response) {
                    if(response){
                        response.map(function (item, index) {
                            item.displayData = "[" + item.reference + "] " + item.subject;
                            scope.ticketList.push(item);
                        });

                        if(scope.currentTicketPage==1)
                            scope.recentTicketList = response.slice(0, 1);
                    }

                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Ticket List.")
                });
            };

            scope.currentTicketPage = 1;
            scope.loadNextTickets = function () {
                scope.currentTicketPage = scope.currentTicketPage + 1;
                scope.GetAllTicketsByRequester(scope.profileDetail._id,scope.currentTicketPage);
            };


            scope.getEnggemntCount = function (id) {
                engagementService.EngagementCount(id).then(function (response) {
                    if (response) {
                        response.forEach(function (item) {
                            scope.enggemntDetailsTotalCount = scope.enggemntDetailsTotalCount + item.count;
                        });

                        response.forEach(function (item) {
                            var p = ((item.count / scope.enggemntDetailsTotalCount) * 100).toFixed(2);
                            scope.enggemntDetailsCount.push({
                                "_id": item._id,
                                "count": item.count,
                                "val": p
                            });
                        });
                    }
                    //scope.enggemntDetailsCount = response;
                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Ticket List.")
                });
            };


            scope.getExternalUserTicketCounts = function (id) {
                ticketService.GetExternalUserTicketCounts(id).then(function (response) {
                    scope.ExternalUserTicketCounts = response;
                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Ticket Count.")
                });
            };

            scope.GetProfileHistory = function (profileId) {
                scope.GetEngagementIdsByProfile(profileId);
                scope.GetAllTicketsByRequester(profileId, 1);
                scope.getEnggemntCount(profileId);
                scope.getExternalUserTicketCounts(profileId);
                console.info("Profile History Loading........................");
            };


            /* Load Profile Details for Current Engagement */

            scope.GetExternalUserProfileByContact = function () {
                var category = "";
                if (scope.direction === 'inbound' || scope.direction === 'outbound') {
                    category = 'phone';
                }

                if (scope.profileDetail) {

                    scope.GetProfileHistory(scope.profileDetail._id);
                    scope.currentSubmission = scope.profileDetail.form_submission;
                    convertToSchemaForm(scope.profileDetail.form_submission, function (schemaDetails) {
                        if (schemaDetails) {
                            scope.schema = schemaDetails.schema;
                            scope.form = schemaDetails.form;
                            scope.model = schemaDetails.model;
                        }

                    });


                    if (scope.profileDetail.phone && scope.profileDetail.phone != scope.channelFrom) {
                        var setContact = true;
                        if (scope.profileDetail.contacts && scope.profileDetail.contacts.length > 0) {

                            for (var i = 0; i < scope.profileDetail.contacts.length; i++) {
                                var contact = scope.profileDetail.contacts[i];
                                if (contact.type === category && contact.contact === scope.channelFrom) {
                                    setContact = false;
                                    break;
                                }
                            }

                        }

                        if (scope.channelFrom != "direct" && setContact) {
                            var r = confirm("Add to Contact");
                            if (r == true) {
                                var contactInfo = {
                                    contact: scope.channelFrom,
                                    type: category,
                                    display: scope.channelFrom
                                };
                                userService.UpdateExternalUserProfileContact(scope.profileDetail._id, contactInfo).then(function (response) {
                                    if (response.IsSuccess) {
                                        scope.showAlert('Profile Contact', 'success', response.CustomMessage);
                                    } else {
                                        scope.showAlert('Profile Contact', 'error', response.CustomMessage);
                                    }
                                }, function (err) {
                                    var errMsg = "Update Profile Contacts Failed";
                                    if (err.statusText) {
                                        errMsg = err.statusText;
                                    }
                                    scope.showAlert('Profile Contact', 'error', errMsg);
                                });
                            } else {
                                console.log("You pressed Cancel!");
                            }
                        }
                    }

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

                            }
                            else if (scope.profileDetails.length > 1) {
                                // show multiple profile selection view
                                scope.showMultiProfile = true;
                                scope.isLoadinNewProfile = false;
                            }
                            else {
                                // show new profile
                                scope.showMultiProfile = false;
                                scope.isLoadinNewProfile = true;

                                scope.currentSubmission = null;
                                convertToSchemaForm(null, function (schemaDetails) {
                                    if (schemaDetails) {
                                        scope.schema = schemaDetails.schema;
                                        scope.form = schemaDetails.form;
                                        scope.model = schemaDetails.model;
                                    }

                                });
                            }
                        }
                        else {
                            // show new profile

                            scope.currentSubmission = null;
                            convertToSchemaForm(null, function (schemaDetails) {
                                if (schemaDetails) {
                                    scope.schema = schemaDetails.schema;
                                    scope.form = schemaDetails.form;
                                    scope.model = schemaDetails.model;
                                }

                            });


                            scope.showMultiProfile = false;
                            scope.isLoadinNewProfile = true;
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
                "phone": scope.channelFrom,
                "email": "",
                "dob": {
                    "day": 0,
                    "month": 0,
                    "year": 0
                }
            };

            //update code damith
            //get country list and languages
            //use JSON
            scope.countryList = [];
            scope.languages = [];

            //Get all country list
            getJSONData($http, "countryList", function (res) {
                scope.countryList = res;
            });

            //Get all languages list
            getJSONData($http, "languages", function (res) {
                scope.languages = res;
            });

            getJSONData($http, "customerType", function (res) {
                scope.customerType = res;
            });

            var genDayList = function () {
                var max = 31;

                var dayArr = [];

                for (min = 1; min <= max; min++) {
                    dayArr.push(min);
                }

                return dayArr;
            };

            scope.cutomerTypes = [];
            scope.loadCutomerType = function (query) {
                if (query === "*" || query === "") {
                    if (scope.customerType) {
                        return scope.customerType;
                    }
                    else {
                        return [];
                    }
                }
                else {
                    var results = query ? scope.customerType.filter(function (query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(group) {
                            return (group.customerType.toLowerCase().indexOf(lowercaseQuery) != -1);
                        };
                    }) : [];
                    return results;
                }

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
                scope.isLoadinNewProfile = false;
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
                        scope.newProfile = scope.profileDetail;
                        scope.dob.day = moment(scope.profileDetail.birthday).day();
                       // scope.dob.day = moment(scope.profileDetail.birthday, 'DD');
                       // scope.dob.day = moment(scope.profileDetail.birthday, 'DD');
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
                        scope.GetProfileHistory(profile._id);

                        if (scope.profileDetail) {
                            scope.currentSubmission = scope.profileDetail.form_submission;
                            convertToSchemaForm(scope.profileDetail.form_submission, function (schemaDetails) {
                                if (schemaDetails) {
                                    scope.schema = schemaDetails.schema;
                                    scope.form = schemaDetails.form;
                                    scope.model = schemaDetails.model;
                                }

                            });
                        }
                        else {
                            scope.currentSubmission = null;
                            convertToSchemaForm(null, function (schemaDetails) {
                                if (schemaDetails) {
                                    scope.schema = schemaDetails.schema;
                                    scope.form = schemaDetails.form;
                                    scope.model = schemaDetails.model;
                                }

                            });
                        }


                    },
                    getModelHeader: function () {
                        if (scope.showMultipleProfile) {
                            scope.modelHeader = "Found 3 Multiple Profiles";
                        }
                        if (scope.showNewProfile) {
                            scope.modelHeader = " Create New Profile";
                        }
                    },
                    searchProfile: function () {
                        scope.internalControl = scope.searchUsers || {};
                        scope.internalControl.tabReference = scope.tabReference;
                        scope.internalControl.updateProfileTab = function (newProfile) {
                            scope.profileDetail = newProfile;
                            scope.GetExternalUserProfileByContact();
                        };
                        var searchElement = document.getElementById("commonSearch");
                        searchElement.value = "#profile:search:";
                        searchElement.focus();
                    }
                }
            }();//end

            //Add new contact click event
            scope.isAddNewContact = false;
            scope.showAddNewContact = function () {
                scope.isAddNewContact = !scope.isAddNewContact;
            };//end


            //update new function
            // create new profile
            scope.createNProfile = function () {
                scope.isLoadinNewProfile = true;
                scope.showMultiProfile = false;
            };

            //engamanet details
            scope.enggemntDetailsCount = [];
            scope.enggemntDetailsTotalCount = 0;
            //ExternalUserTicketCounts details
            scope.ExternalUserTicketCounts = [];


            scope.newContact = {};
            scope.newContact.contactType = "";
            scope.newContact.contact = "";
            scope.addContactToUsr = function (newContact) {
                var contactInfo = {
                    contact: newContact.contact,
                    type: newContact.contactType,
                    display: newContact.contact
                };
                userService.UpdateExternalUserProfileContact(scope.profileDetail._id, contactInfo).then(function (response) {
                    if (response.IsSuccess) {
                        scope.profileDetail.contacts.push(contactInfo);
                    } else {
                        scope.showAlert('Profile Contact', 'error', response.CustomMessage);
                    }
                    scope.isAddNewContact = !response.IsSuccess;
                }, function (err) {
                    scope.showAlert('Profile Contact', 'error', "Update Profile Contacts Failed");
                });
            }

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
