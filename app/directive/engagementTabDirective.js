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

agentApp.directive("engagementTab", function ($filter, $rootScope,$uibModal,$q, engagementService, ivrService,
                                              userService, ticketService, tagService, $http, authService, integrationAPIService, profileDataParser,jwtHelper) {
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
            searchUsers: "=",
            schemaResponseNewTicket: "="
        },
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {


            scope.schemaw = scope.schemaResponseNewTicket.schema;
            scope.formw = scope.schemaResponseNewTicket.form;
            scope.modelw = scope.schemaResponseNewTicket.model;

            /*Initialize default scope*/
            scope.profileLoadin = true;
            scope.showNewProfile = false;
            scope.editProfile = false;
            scope.companyName = "";
            scope.oldFormModel = null;
            scope.currentSubmission = null;
            scope.currentForm = null;
            scope.availableTags = scope.tagCategoryList;

            scope.integrationAPIList = [];
            scope.currentTicketForm = null;

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

            scope.setUserTitles = function (userObj) {

                var title="";


                if(userObj.firstname && userObj.lastname)
                {
                    title=userObj.firstname+" "+ userObj.lastname;
                }
                else
                {
                    if(userObj.firstname)
                    {
                        title=userObj.firstname;
                    }
                    else if(userObj.lastname)
                    {
                        title=userObj.lastname;
                    }
                    else
                    {
                        title=userObj.name;
                    }

                }

                return title;
            }
            scope.assigneeUsers = profileDataParser.assigneeUsers;

            angular.forEach(scope.assigneeUsers, function (assignee) {
                assignee.displayname=scope.setUserTitles(assignee);
            });

            scope.assigneeGroups = profileDataParser.assigneeUserGroups;


            scope.pickCompanyInfo = function () {
                var userCompanyData = authService.GetCompanyInfo();
                ticketService.pickCompanyInfo(userCompanyData.tenant, userCompanyData.company).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.companyName = response.data.Result.companyName;
                    }
                    else {
                        console.log("No company info found");
                    }

                }, function (error) {
                    console.log("Error in loading company info", error);
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
                        ticketService.updateFormSubmissionData(scope.currentSubmission, obj).then(function (response) {
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


            scope.getIntegrationMetaData = function () {
                integrationAPIService.getIntegrationURLMetaData('PROFILE')
                    .then(function (data) {
                        if (data.Result) {
                            scope.integrationAPIList = data.Result;
                        }
                        else {
                            scope.integrationAPIList = [];
                        }
                    })
                    .catch(function (err) {
                        scope.showAlert("External API Data", "error", "Get meta data failed");
                    })

            };

            scope.callExternalAPI = function (integrationObj) {

                integrationAPIService.getIntegrationAPIData(integrationObj._id, scope.profileDetail)
                    .then(function (data) {
                        if (data && data.Result) {
                            if (data.Result) {
                                integrationObj.integrationAPIStatus = 1;
                            }
                            else {
                                integrationObj.integrationAPIStatus = 2;
                            }
                            integrationObj.jsonDataAPI = data.Result;
                        }
                        else {
                            if (data.Exception) {
                                integrationObj.integrationAPIStatus = 3;
                            }
                            else {
                                integrationObj.integrationAPIStatus = 2;
                            }
                            integrationObj.jsonDataAPI = null;
                        }

                    })
                    .catch(function (err) {
                        integrationObj.jsonDataAPI = null;
                        integrationObj.integrationAPIStatus = 3;
                        scope.showAlert("External API Data", "error", "Get meta data failed");
                    })

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

                if (chip.tags) {
                    if (chip.tags.length > 0) {

                        var tempTags = [];
                        angular.forEach(chip.tags, function (item) {

                            if (!angular.isObject(item)) {

                                var tags = $filter('filter')(scope.tagList, {_id: item}, true);
                                tempTags = tempTags.concat(tags);

                            } else {
                                tempTags = tempTags.concat(item);
                            }
                        });
                        scope.availableTags = tempTags;

                        return;
                    }
                }


            };

            /*scope.onChipAddTag = function (chip) {
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
             if (!angular.isObject(chip.tags[0])) {
             var tempTags = [];
             /!*angular.forEach(chip.tags[0], function (item) {
             var tags = $filter('filter')(scope.tagList, {_id: item}, true);
             tempTags = tempTags.concat(tags);
             });*!/
             var tags = $filter('filter')(scope.tagList, {_id: chip.tags[0]}, true);
             tempTags = tempTags.concat(tags);
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
             */
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

            var findFormForCompanyOrTag = function(isolatedTags, callback)
            {
                ticketService.getFormByIsolatedTag(isolatedTags).then(function(tagForm)
                {
                    if(tagForm.Result && tagForm.Result.length > 0)
                    {

                        callback(null, tagForm.Result[0].dynamicForm);
                    }
                    else
                    {
                        ticketService.getFormsForCompany().then(function(compForm)
                        {
                            if(compForm.Result.ticket_form)
                            {
                                callback(null, compForm.Result.ticket_form);
                            }
                            else
                            {
                                callback(null, null);
                            }

                        }).catch(function(err)
                        {
                            callback(err, null);
                        })
                    }


                }).catch(function(err)
                {
                    callback(err, null);
                })
            };

            scope.onIsolatedTagRemoved = function()
            {
                var schema = {
                    type: "object",
                    properties: {}
                };

                var form = [];

                var arrMap = scope.postTags.map(function(item)
                {
                    return item.name;
                })

                findFormForCompanyOrTag(arrMap, function(err, ticket_form)
                {
                    if(ticket_form)
                    {
                        scope.currentTicketForm = ticket_form;
                        buildFormSchema(schema, form, ticket_form.fields);
                        //var currentForm = response.Result.ticket_form;

                        /*form.push({
                         type: "submit",
                         title: "Save"
                         });*/

                        scope.schemaw = schema;
                        scope.formw = form;
                        scope.modelw = {};
                    }
                    else
                    {
                        scope.currentTicketForm = null;
                    }
                });
            };

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

                    scope.onIsolatedTagRemoved();

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

            /*scope.userGroups = [];
             scope.loadUserGroups = function () {
             userService.getUserGroupList().then(function (response) {
             if (response.data && response.data.IsSuccess) {
             scope.userGroups = response.data.Result;
             }
             }, function (err) {

             scope.showAlert("Load User Groups", "error", "Fail To Get User Groups.")
             });
             };
             scope.loadUserGroups();*/


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

 	    scope.loadMyAppMetaData = function () {
                ticketService.GetMyTicketConfig(function (success,data) {

                    if(success && data && data.Result)
                    {
                        scope.ticket.subject=data.Result.subject;
                        scope.setPriority(data.Result.priority);
                        scope.ticket.description=data.Result.description;

                    }
                });

            }

            

            scope.saveTicket = function (ticket,cusForm) {
                ticket.channel = scope.channel;
                ticket.requester = scope.profileDetail._id;
                ticket.engagement_session = scope.sessionId;

                ticket.assignee_group = ticket.assignee;

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
                        ticket.reference = response.Result.reference;
                        ticket.id = response.Result._id;
                        ticket._id = response.Result._id;
                        ticket.created_at = new Date();
                        scope.ticketList.splice(0, 0, ticket); //scope.ticketList.push(response.Result);
                        scope.recentTicketList.pop();
                        scope.recentTicketList.push(ticket);
                        scope.ticket = {};
                        scope.newAddTags = [];
                        addDynamicDataToTicket(ticket);
                        scope.showAlert('Ticket', 'success', 'Ticket Saved successfully');
                        scope.postTags = [];
                    } else {
                        scope.showAlert("Ticket", "error", "Fail To Save Ticket.")

                    }
                    scope.showCreateTicket = !response.IsSuccess;
                }, function (err) {
                    scope.showAlert("Save Ticket", "error", "Fail To Save Ticket.");
                });


            };

            var addDynamicDataToTicket = function (ticket) {

                var arr = [];

                for (var key in scope.modelw) {
                    if (scope.modelw.hasOwnProperty(key)) {
                        arr.push({
                            field: key,
                            value: scope.modelw[key]
                        });

                    }
                }

<<<<<<< HEAD
                var obj = {
                    fields: arr,
                    reference: ticket._id,
                    form: scope.currentTicketForm.name
                };
                ticketService.createFormSubmissionData(obj).then(function (response) {
                    //tag submission to ticket
                    if (response && response.Result) {
                        ticketService.mapFormSubmissionToTicket(response.Result._id, ticket._id).then(function (responseMap) {
                            //tag submission to ticket
                            //scope.showAlert('Ticket Other Data', 'success', 'Ticket other data saved successfully');
                            console.log('Ticket other data saved successfully');
                        }).catch(function (err) {
                            //scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                            console.log('Ticket other data save failed');
                        });
                    }
                    else {
                        scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                    }
=======
               var obj = {
                   fields: arr,
                   reference: ticket._id,
                   form: scope.schemaResponseNewTicket.currentForm.name
               };
               ticketService.createFormSubmissionData(obj).then(function (response) {
                   //tag submission to ticket
                   if (response && response.Result) {
                       ticketService.mapFormSubmissionToTicket(response.Result._id, ticket._id).then(function (responseMap) {
                           //tag submission to ticket
                           //scope.showAlert('Ticket Other Data', 'success', 'Ticket other data saved successfully');
console.log('Ticket other data saved successfully');
                       }).catch(function (err) {
                           //scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                           console.log('Ticket other data save failed');
                       });
                   }
                   else {
                       scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                   }
>>>>>>> master


                }).catch(function (err) {
                    scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                })

            };

            scope.availableTicketTypes = [];
            scope.getAvailableTicketTypes = function () {
                ticketService.getAvailableTicketTypes().then(function (response) {

                    if (response && response.IsSuccess) {

                        scope.availableTicketTypes = response.Result;
                    }
                    else {
                        scope.availableTicketTypes = [];
                    }
                }, function (error) {
                    scope.availableTicketTypes = [];
                });
            };

            scope.getAvailableTicketTypes();

            scope.showCreateTicket = false;


            scope.showNewTicket = function () {
                if (scope.profileDetail && scope.profileDetail._id) {
                    scope.showCreateTicket = !scope.showCreateTicket;
                    if(scope.showCreateTicket)
                    {
                        scope.onIsolatedTagRemoved();
                        scope.loadMyAppMetaData();
                    }
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
            scope.isShowTimeLine = false;
            scope.loadNextEngagement = function () {
                var begin = ((scope.currentPage - 1) * 10)
                    , end = begin + 10;

                var ids = scope.sessionIds.slice(begin, end);
                if (ids) {
                    scope.currentPage = scope.currentPage + 1;
                    scope.isShowTimeLine = true;
                    engagementService.GetEngagementSessions(scope.engagementId, ids).then(function (reply) {
                        scope.engagementsList = scope.engagementsList.concat(reply);

                        if (angular.isArray(reply) && scope.recentEngList.length === 0) {
                            scope.recentEngList = reply.slice(0, 1);
                        }
                        scope.isShowTimeLine = false;

                    }, function (err) {
                        scope.showAlert("Get Engagement Sessions", "error", "Fail To Get Engagement Sessions Data.");
                        scope.isShowTimeLine = false;
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
            scope.isLoadingTicke = false;
            scope.GetAllTicketsByRequester = function (requester, page) {
                scope.isLoadingTicke = true;
                ticketService.GetAllTicketsByRequester(requester, page).then(function (response) {
                    if (response) {
                        response.map(function (item, index) {
                            item.displayData = "[" + item.reference + "] " + item.subject;
                            scope.ticketList.push(item);
                        });

                        if (scope.currentTicketPage == 1)
                            scope.recentTicketList = response.slice(0, 1);
                    }
                    scope.isLoadingTicke = false;

                }, function (err) {
                    scope.showAlert("Ticket", "error", "Fail To Get Ticket List.");
                    scope.isLoadingTicke = false;
                });
            };

            scope.currentTicketPage = 1;
            scope.loadNextTickets = function () {
                scope.currentTicketPage = scope.currentTicketPage + 1;
                scope.GetAllTicketsByRequester(scope.profileDetail._id, scope.currentTicketPage);
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


            scope.addIsolatedEngagementSession = function (profileId, sessionId) {
                engagementService.AddIsolatedEngagementSession(profileId, sessionId).then(function (response) {
                    if (response.IsSuccess) {
                        console.log(response.CustomMessage);
                    } else {
                        scope.showAlert('Engagement', 'error', response.CustomMessage);
                    }
                }, function (err) {
                    scope.showAlert('Engagement', 'error', "Add Isolated Engagement Failed");
                });
            };

            scope.moveEngagementBetweenProfiles = function (sessionId, operation, from, to) {
                engagementService.MoveEngagementBetweenProfiles(sessionId, operation, from, to).then(function (response) {
                    if (response.IsSuccess) {
                        console.log(response.CustomMessage);
                    } else {
                        scope.showAlert('Engagement', 'error', response.CustomMessage);
                    }
                }, function (err) {
                    scope.showAlert('Engagement', 'error', "Move Engagement Between Profiles Failed");
                });
            };

            /* Load Profile Details for Current Engagement */
            scope.mapProfile = {};
            scope.mapProfile.isShowConfirm = false;

            scope.mapProfileAndNumber = function () {
                scope.mapProfile.isShowConfirm = false;
                if (scope.mapProfile.mapEngagement) {
                    scope.moveEngagementBetweenProfiles(scope.sessionId, 'cut', scope.exProfileId, scope.profileDetail._id);
                }
                if (scope.mapProfile.addNumber) {
                    var contactInfo = {
                        contact: scope.channelFrom,
                        type: 'phone',
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
                }
            };

            scope.closeProfileAndNumber = function () {
                scope.mapProfile.isShowConfirm = false;
            };

            scope.createNProfile = function () {
                if (scope.profileDetail) {
                    scope.exProfileId = angular.copy(scope.profileDetail._id);
                }
                scope.showMultiProfile = false;
                scope.profileLoadin = false;
                scope.showNewProfile = true;
                scope.editProfile = false;
                scope.newProfile = {
                    "title": "",
                    "name": "",
                    "avatar": "assets/img/avatar/profileAvatar.png",
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
            };



            var loadUserData = function(){
                if (scope.profileDetails) {
                    if (scope.profileDetails.length == 1) {
                        scope.profileDetail = scope.profileDetails[0];
                        scope.GetProfileHistory(scope.profileDetail._id);
                        scope.profileLoadin = false;
                        scope.currentSubmission = scope.profileDetails[0].form_submission;
                        convertToSchemaForm(scope.profileDetails[0].form_submission, function (schemaDetails) {
                            if (schemaDetails) {
                                scope.schema = schemaDetails.schema;
                                scope.form = schemaDetails.form;
                                scope.model = schemaDetails.model;
                            }

                        });

                    }
                    else if (scope.profileDetails.length > 1) {
                        // show multiple profile selection view
                        scope.profileLoadin = false;
                        scope.showMultiProfile = true;

                    }
                    else {
                        // show new profile
                        scope.profileLoadin = false;
                        scope.showMultiProfile = true;

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

                }
            };

            scope.GetExternalUserProfileByContact = function () {
                var category = "";

                switch (scope.channel){
                    case 'call':
                        if (scope.direction === 'inbound' || scope.direction === 'outbound') {
                            category = 'phone';
                        } else if (scope.direction === 'direct') {
                            category = 'direct';
                        }
                        break;

                    case 'api':
                        if (scope.direction === 'direct') {
                            category = 'direct';
                        }
                        break;

                    default :
                        category = scope.channel;
                        break;

                }

                if (scope.profileDetail) {

                    scope.GetProfileHistory(scope.profileDetail._id);
                    scope.profileLoadin = false;
                    scope.showMultiProfile = false;
                    scope.showNewProfile = false;
                    scope.currentSubmission = scope.profileDetail.form_submission;
                    convertToSchemaForm(scope.profileDetail.form_submission, function (schemaDetails) {
                        if (schemaDetails) {
                            scope.schema = schemaDetails.schema;
                            scope.form = schemaDetails.form;
                            scope.model = schemaDetails.model;
                        }

                    });

                    if (scope.channelFrom != "direct") {
                        if (scope.exProfileId) {
                            scope.mapProfile.showEngagement = true;
                        } else {
                            scope.addIsolatedEngagementSession(scope.profileDetail._id, scope.sessionId);
                        }
                    }

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

                        if (scope.channelFrom != "direct" && scope.channel === "call" && setContact) {

                            scope.mapProfile.showNumberd = true;
                            // var r = confirm("Add to Contact");
                            //if (r == true) {
                            //
                            //} else {
                            //    console.log("You pressed Cancel!");
                            //}
                        }
                    }

                    if (scope.mapProfile && (scope.mapProfile.showEngagement || scope.mapProfile.showNumberd)) {
                        scope.mapProfile.isShowConfirm = true;
                    }

                } else {
                    if(category === 'direct') {
                        scope.createNProfile();
                    }else{
                        if(scope.channel === 'chat'){
                            userService.getExternalUserProfileByField("firstname", scope.channelFrom).then(function (response) {
                                if (response && response.IsSuccess) {
                                    scope.profileDetails = response.Result;
                                }

                                loadUserData();
                            }, function (err) {
                                scope.showAlert("User Profile", "error", "Fail To Get User Profile Details.")
                            });
                        }else {
                            userService.GetExternalUserProfileByContact(category, scope.channelFrom).then(function (response) {
                                scope.profileDetails = response;

                                loadUserData();


                            }, function (err) {
                                scope.showAlert("User Profile", "error", "Fail To Get User Profile Details.")
                            });
                        }
                    }
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
                "avatar": "assets/img/avatar/profileAvatar.png",
                "birthday": "",
                "gender": "",
                "firstname": (scope.channel === "chat")?scope.channelFrom:"",
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
                "phone": (scope.channel === "call")?scope.channelFrom:"",
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
            scope.titles = [];
            scope.gender = ['Male', 'Female'];

            //Get all country list
            getJSONData($http, "countryList", function (res) {
                scope.countryList = res;
            });

            //Get all languages list
            getJSONData($http, "languages", function (res) {
                scope.languages = res;
            });

            /*getJSONData($http, "customerType", function (res) {
             scope.customerType = res;
             });*/

            //Get all title
            getJSONData($http, "titles", function (res) {
                scope.titles = res;
            });



            var getCustomerTypes = function () {
                userService.loadCutomerTags().then(function (response) {

                    if(response.IsSuccess)
                    {
                        scope.customerType=response.Result;
                        scope.customerType.forEach(function (tag) {
                            tag.cutomerType=tag.name;

                        });
                    }
                    else
                    {
                        scope.customerType=[];
                        scope.showAlert("Customer types", "error", "Fail To load Customer types.");

                    }
                }, function (error) {
                    scope.customerType=[];
                    scope.showAlert("Customer types", "error", "Fail To load Customer types.");
                });
            };

            getCustomerTypes();

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
                profile.tags=[];
                scope.cutomerTypes.forEach(function (tag) {
                    profile.tags.push(tag.cutomerType)
                })
                var collectionDate = profile.dob.year + '-' + profile.dob.month.index + '-' + profile.dob.day;
                profile.birthday = new Date(collectionDate);


                userService.getExternalUserProfileBySsn(profile.ssn).then(function (resSSN) {

                    if(resSSN.IsSuccess && resSSN.Result.length>0)
                    {
                        scope.showAlert("Profile", "error", "SSN is already taken");
                    }
                    else
                    {
                        userService.getExternalUserProfileByField("phone",profile.phone).then(function (resPhone) {

                            if(resPhone.IsSuccess && resPhone.Result.length>0)
                            {
                                scope.showAlert("Profile", "error", "Phone number is already taken");
                            }
                            else
                            {
                                userService.getExternalUserProfileByField("email",profile.email).then(function (resEmail) {

                                    if(resEmail.IsSuccess && resEmail.Result.length>0)
                                    {
                                        scope.showAlert("Profile", "error", "Email is already taken");
                                    }
                                    else
                                    {
                                        userService.CreateExternalUser(profile).then(function (response) {
                                            if (response) {
                                                scope.profileDetail = response;
                                                scope.showNewProfile = false;

                                                scope.GetProfileHistory(response._id);
                                                if(scope.exProfileId) {
                                                    scope.moveEngagementBetweenProfiles(scope.sessionId, 'cut', scope.exProfileId, scope.profileDetail._id);
                                                }else {
                                                    scope.addIsolatedEngagementSession(response._id, scope.sessionId);
                                                }
                                            }
                                            else {
                                                scope.showAlert("Profile", "error", "Fail To Save Profile.");
                                            }
                                        }, function (err) {
                                            scope.showAlert("Profile", "error", "Fail To Save Profile.");
                                        });
                                    }

                                }, function (errEmail) {
                                    scope.showAlert("Profile", "error", "Checking Email failed");
                                });



                            }
                        }, function (errPhone) {
                            scope.showAlert("Profile", "error", "Checking Phone number failed");
                        })
                    }

                }, function (errSSN) {
                    scope.showAlert("Profile", "error", "Checking SSN failed");
                });



            };

            scope.CheckExternalUserAvailabilityBySSN = function (ssn,profile)
            {
                var deferred = $q.defer();

                userService.getExternalUserProfileBySsn(ssn).then(function (resPhone) {

                    if(resPhone.IsSuccess)
                    {
                        if(resPhone.Result.length==0)
                        {
                            deferred.resolve(true);
                        }
                        else
                        {
                            if(profile._id==resPhone.Result[0]._id)
                            {
                                deferred.resolve(true);
                            }
                            else
                            {
                                scope.showAlert("Profile", "error", "SSN is already taken");
                                deferred.resolve(false);
                            }
                        }

                    }
                    else
                    {
                        deferred.resolve(true);
                    }

                }, function (errPhone) {

                    scope.showAlert("Profile", "error", "Error in searching ssn");
                    deferred.resolve(false);
                });
                return deferred.promise;
            }

            scope.CheckExternalUserAvailabilityByField = function (field,value,profile) {

                var deferred = $q.defer();

                userService.getExternalUserProfileByField(field,value).then(function (resPhone) {

                    if(resPhone.IsSuccess)
                    {
                        if(resPhone.Result.length==0)
                        {
                            deferred.resolve(true);
                        }
                        else
                        {
                            if(profile._id==resPhone.Result[0]._id)
                            {
                                deferred.resolve(true);
                            }
                            else
                            {
                                scope.showAlert("Profile", "error", field+" is already taken");
                                deferred.resolve(false);
                            }
                        }


                    }
                    else
                    {
                        deferred.resolve(true);
                    }

                }, function (errPhone) {

                    scope.showAlert("Profile", "error", "Error in searching "+field);
                    deferred.resolve(false);
                });
                return deferred.promise;
            };


            scope.UpdateExternalUser = function (profile) {
                var collectionDate = profile.dob.year + '-' + profile.dob.month.index + '-' + profile.dob.day;
                profile.tags=[];
                scope.cutomerTypes.forEach(function (tag) {
                    profile.tags.push(tag.cutomerType)
                });
                profile.birthday = new Date(collectionDate);




                $q.all([
                    scope.CheckExternalUserAvailabilityByField("ssn",profile.ssn,profile),
                    scope.CheckExternalUserAvailabilityByField("email",profile.email,profile),
                    scope.CheckExternalUserAvailabilityByField("phone",profile.phone,profile),
                ]).then(function(value) {
                    // Success callback where value is an array containing the success values

                    if(value.indexOf(false)==-1)
                    {
                        userService.UpdateExternalUser(profile).then(function (response) {
                            if (response) {
                                scope.cutomerTypes=[];
                                scope.showNewProfile = false;
                                scope.editProfile = false;

                                scope.showAlert("Profile", "success", "Update Successfully.");
                                userService.getExternalUserProfileByID(response._id).then(function (resUserData) {

                                    if(resUserData.IsSuccess)
                                    {
                                        scope.profileDetail = resUserData.Result;
                                    }
                                    else
                                    {
                                        scope.showAlert("Profile","error","Failed to load updated profile");

                                    }


                                }, function (errUserData) {
                                    scope.showAlert("Profile","error","Failed to load updated profile");
                                    console.log(errUserData)
                                });
                            }
                            else {
                                scope.showAlert("Profile", "error", "Fail To Save Profile.");
                            }
                        }, function (err) {
                            scope.showAlert("Profile", "error", "Fail To Save Profile.");
                        });
                    }
                    else
                    {
                        scope.showAlert("Profile", "error", "Fail To Save Profile.");
                    }




                }, function(reason) {
                    // Error callback where reason is the value of the first rejected promise
                    alert(value);
                });



            };

            //engagement console
            //image crop deatails
            scope.isShowCrop = false;
            scope.myImage = '';
            scope.myCroppedImage = '';
            scope.cropImageURL = null;
            scope.tenant = 0;
            scope.company = 0;
            scope.getCompanyTenant = function () {
                var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());
                console.info(decodeData);
                scope.company = decodeData.company;
                scope.tenant = decodeData.tenant;
            };
            scope.getCompanyTenant();

            scope.changeAvatarURL = function (fileID) {

                if (fileID) {
                    scope.newProfile.avatar = baseUrls.fileServiceInternalUrl + "File/Download/" + scope.tenant + "/" + scope.company + "/" + fileID + "/ProPic";

                }


            }


            scope.viewCropArea = function () {

                //modal show
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './app/views/profile/partials/profile-picture-modal.html',
                    controller: 'profilePicUploadController',
                    size: 'lg',
                    resolve: {
                        changeUrl: function () {
                            return scope.changeAvatarURL;
                        }
                    }
                });



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


                return {
                    createNewProfile: function () {
                        scope.showMultipleProfile = true;
                        scope.foundProfiles = false;

                        scope.newProfile = scope.profileDetail;
                        var date = moment(scope.profileDetail.birthday);
                        scope.newProfile.dob = {};
                        scope.newProfile.dob.day = date.date();
                        scope.newProfile.dob.month = {
                            'index': date.month(),
                            'name': date.month()
                        };
                        scope.newProfile.dob.year = date.year();

                    },
                    closeNewProfile: function () {

                    },
                    editProfile: function () {

                        userService.getExternalUserProfileByID(scope.profileDetail._id ).then(function (resNewProfile) {

                            if(resNewProfile.IsSuccess)
                            {

                                scope.newProfile = resNewProfile.Result;
                                scope.newProfile.avatar=resNewProfile.Result.avatar;
                                //alert(scope.newProfile.avatar);
                                for(var i=0;i<scope.newProfile.tags.length;i++)
                                {
                                    scope.cutomerTypes[i]={"cutomerType":scope.newProfile.tags[i]};
                                }

                                var date = moment(scope.profileDetail.birthday);
                                scope.newProfile.dob = {};
                                scope.newProfile.dob.day = date.date();
                                scope.newProfile.dob.month = {
                                    'index': date.month()+1,
                                    'name': date.month()+1
                                };
                                scope.newProfile.dob.year = date.year();
                                scope.showNewProfile = true;
                                scope.editProfile = true;
                            }
                            else
                            {
                                scope.showAlert("Error","error","Error in loading profile details");
                            }
                        }, function (errNewProfile) {
                            scope.showAlert("Error","error","Error in loading profile details");
                            console.log(errNewProfile);
                        })

                        // scope.newProfile = scope.profileDetail;



                    },
                    closeProfileSelection: function () {
                        scope.showNewProfile = false;
                        scope.editProfile = false;
                    },
                    openSelectedProfile: function (profile) {
                        scope.profileDetail = profile;
                        scope.showMultiProfile = false;

                        scope.GetProfileHistory(profile._id);

                        if (scope.profileDetail) {
                            scope.addIsolatedEngagementSession(scope.profileDetail._id, scope.sessionId);
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
                    searchProfile: function () {
                        scope.internalControl = scope.searchUsers || {};
                        scope.internalControl.tabReference = scope.tabReference;
                        scope.internalControl.updateProfileTab = function (newProfile) {
                            if (scope.profileDetail) {
                                scope.exProfileId = angular.copy(scope.profileDetail._id);
                            }
                            scope.profileDetail = newProfile;
                            scope.engagementsList = [];
                            scope.ticketList = [];
                            scope.recentTicketList = [];
                            scope.currentTicketPage = 1;
                            scope.currentPage = 1;
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
            /* scope.createNProfile = function () {
             if (scope.profileDetail) {
             scope.exProfileId = angular.copy(scope.profileDetail._id);
             }
             scope.showMultiProfile = false;
             scope.profileLoadin = false;
             scope.showNewProfile = true;
             scope.editProfile = false;
             };*/

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
            };

            //Progressbar random color
            scope.getRandomColor = function ($index) {
                switch ($index) {
                    case 0:
                        return 'warning';
                        break;
                    case 1:
                        return 'success';
                        break;
                    case 2:
                        return 'danger';
                        break;
                    case 3:
                        return 'success';
                        break;
                    case 4:
                        return 'warning';
                    case 5:
                        return 'success';
                    default:
                        return 'success';
                        break;
                }
            }//end

            //update code damith
            scope.isCnfmBoxShow = false;


            var deleteContactObj = {};

            scope.deleteSocialContact = function (contact) {
                deleteContactObj.contact = '';
                deleteContactObj.status = 0;
                scope.isCnfmBoxShow = true;
                deleteContactObj.contact = contact;
                deleteContactObj.status = 2;
            };

            scope.deleteContact = function (contact) {
                deleteContactObj.contact = '';
                deleteContactObj.status = 0;
                scope.isCnfmBoxShow = true;
                deleteContactObj.contact = contact;
                deleteContactObj.status = 1;
            };

            scope.confimOk = function () {
                //delete contact
                if (deleteContactObj.status == 1) {
                    userService.DeleteContact(scope.profileDetail._id, deleteContactObj.contact).then(function (res) {
                        scope.showAlert('Delete Contact', 'success', "Remove External User Contact successfully");
                        scope.profileDetail.contacts.forEach(function (value, key) {
                            if (scope.profileDetail.contacts[key].contact == deleteContactObj.contact) {
                                scope.profileDetail.contacts.splice(key, 1);
                            }
                        });
                        scope.isCnfmBoxShow = false;

                    }, function (err) {
                        console.log(err);
                    });
                }

                //delete social contact details
                if (deleteContactObj.status == 2) {
                    userService.DeleteSocialContact(scope.profileDetail._id, deleteContactObj.contact).then(function (res) {
                        scope.showAlert('Delete Contact', 'success', "Remove External User Contact successfully");
                        scope.profileDetail[deleteContactObj.contact] = '';
                        scope.isCnfmBoxShow = false;
                    }, function (err) {
                        console.log(err);
                    });
                }
            };

            scope.confimCancel = function () {
                scope.isCnfmBoxShow = false;
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

(function () {
    var app = angular.module("veeryAgentApp");

    var profilePicUploadController = function ($scope, $stateParams, $filter, $uibModalInstance, $base64, $http, FileUploader, fileService, authService, jwtHelper,changeUrl) {

        $scope.showModal = true;
        $scope.isUploadDisable = true;

        $scope.myImage = '';
        $scope.myCroppedImage = '';





        $scope.myChannel = {
            // the fields below are all optional
            videoHeight: 400,
            videoWidth: 300,
            video: null // Will reference the video element on success
        };

        var _video = null,
            patData = null;

        $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

        $scope.channel = {};

        $scope.webcamError = false;
        $scope.onError = function (err) {
            $scope.$apply(
                function () {
                    $scope.webcamError = err;
                }
            );
        };
        $scope.onSuccess = function () {
            // The video element contains the captured camera data
            _video = $scope.myChannel.video;
            $scope.$apply(function () {
                $scope.patOpts.w = _video.width;
                $scope.patOpts.h = _video.height;

            });
        };

        $scope.snapURI = "";

        $scope.makeSnapshot = function makeSnapshot() {
            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);


                $scope.snapURI = patCanvas.toDataURL();


                patData = idata;

            }
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };


        $scope.file = {};
        $scope.file.Category = "PROFILE_PICTURES";
        var uploader = $scope.uploader = new FileUploader({
            url: fileService.UploadUrl,
            headers: fileService.Headers
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });


        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (item) {
            console.info('onAfterAddingFile', item);

            if (item.file.type.split("/")[0] == "image") {
                //fileItem.upload();


                item.croppedImage = '';

                var reader = new FileReader();
                reader.onload = function (event) {
                    $scope.$apply(function () {
                        item.image = event.target.result;
                    });
                };
                reader.readAsDataURL(item._file);
                $scope.isUploadDisable = false;

            }
            else {
                new PNotify({
                    title: 'Profile picture upload',
                    text: 'Invalid File type. Retry',
                    type: 'error',
                    styling: 'bootstrap3'
                });
            }

        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            if (!$scope.file.Category) {
                uploader.clearQueue();
                new PNotify({
                    title: 'File Upload!',
                    text: 'Invalid File Category.',
                    type: 'error',
                    styling: 'bootstrap3'
                });
                return;
            }
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            var blob = dataURItoBlob(item.croppedImage);
            item._file = blob;
            item.formData.push({'fileCategory': 'PROFILE_PICTURES'});
        };

        var dataURItoBlob = function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };

        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            console.log("result ", response.Result);
            new PNotify({
                title: 'File Upload!',
                text: "Picture uploaded successfully",
                type: 'success',
                styling: 'bootstrap3'
            });

            changeUrl(response.Result);
            $uibModalInstance.dismiss('cancel');

        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };


        $scope.clearQueue = function () {

            uploader.clearQueue();
            $scope.isUploadDisable = true;
            document.getElementById("cropedArea").src = "";
        }
        $scope.showMe = function () {
            alert("showMe");


            var blob = dataURItoBlob($scope.newConverted);
            var fd = new FormData(document.forms[0]);
            fd.append("file", blob);

            $http.post(fileService.UploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (response) {
                changeUrl(response.Result);
                $uibModalInstance.dismiss('cancel');
            }).error(function (error) {
                alert(error);
                console.log("error")
            });


            /*



             convertURIToImageData($scope.myCroppedImage).then(function (imageData) {
             // Here you can use imageData
             console.log(imageData);
             });
             */

            /*var resultImage= new Image($scope.)*/
        }


        $scope.ok = function () {

            $uibModalInstance.close($scope.password);
        };

        $scope.loginPhone = function () {

            $uibModalInstance.close($scope.password);
        };

        $scope.closeModal = function () {

            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancel = function () {

            $uibModalInstance.dismiss('cancel');
        };

        /*var handleFileSelect=function() {
         var file=evt.currentTarget.files[0];
         var reader = new FileReader();
         reader.onload = function (evt) {
         $scope.$apply(function($scope){
         $scope.myImage="C:/Users/Pawan/Downloads/MyMan(new).jpg";
         });
         };
         //reader.readAsDataURL(file);

         $scope.myImage="https://avatars1.githubusercontent.com/u/10277006?v=3&s=460";

         };
         //angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
         handleFileSelect();*/

        var b64ToUint6 = function (nChr) {
            // convert base64 encoded character to 6-bit integer
            // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
            return nChr > 64 && nChr < 91 ? nChr - 65
                : nChr > 96 && nChr < 123 ? nChr - 71
                : nChr > 47 && nChr < 58 ? nChr + 4
                : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
        }


        var base64DecToArr = function (sBase64, nBlocksSize) {
            // convert base64 encoded string to Uintarray
            // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
            var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
                nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
                taBytes = new Uint8Array(nOutLen);

            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }
            return taBytes;
        }


        $scope.uploadSnap = function (dataURI) {


            var form_elem_name = "mySnap";
            var image_fmt = '';
            if (dataURI.match(/^data\:image\/(\w+)/))
                image_fmt = RegExp.$1;
            else
                throw "Cannot locate image format in Data URI";

            var raw_image_data = dataURI.replace(/^data\:image\/\w+\;base64\,/, '');
            var http = new XMLHttpRequest();

            http.open("POST", fileService.UploadUrl, true);
            http.setRequestHeader('Authorization', authService.GetToken());

            if (http.upload && http.upload.addEventListener) {
                http.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var progress = e.loaded / e.total;
                        // Webcam.dispatch('uploadProgress', progress, e);
                        console.log("Proressing ", progress);
                    }
                }, false);
            }

            // completion handler
            var self = this;
            http.onload = function (text) {

                new PNotify({
                    title: 'Your Profile picture ',
                    text: "Picture has been changed successfully",
                    type: 'success',
                    styling: 'bootstrap3'
                });

                changeUrl(JSON.parse(text.currentTarget.response).Result);
                $uibModalInstance.dismiss('cancel');
            };

            // create a blob and decode our base64 to binary
            var blob = new Blob([base64DecToArr(raw_image_data)], {type: 'image/' + image_fmt});

            // stuff into a form, so servers can easily receive it as a standard file upload
            var form = new FormData();
            form.append(form_elem_name, blob, form_elem_name + "." + image_fmt.replace(/e/, ''));
            form.append('fileCategory', 'PROFILE_PICTURES');

            // send data to server
            http.send(form);


            /*var blobSnap=dataURItoBlob(dataURI);
             var formData = new FormData();
             var snapFile= new File([""], "snapUploadFile");
             snapFile.fileCategory='PROFILE_PICTURES';
             snapFile._file=blobSnap;

             return $http({
             method: 'POST',
             url: fileService.UploadUrl,
             data:snapFile
             }).then(function(response)
             {
             if(response.data.IsSuccess)
             {
             new PNotify({
             title: 'File Upload!',
             text: "Picture uploaded successfully",
             type: 'success',
             styling: 'bootstrap3'
             });

             changeUrl(response.Result);
             $uibModalInstance.dismiss('cancel');
             }
             });*/


        }


        /* var dataURItoBlob = function(dataURI) {
         var binary = atob(dataURI.split(',')[1]);
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
         var array = [];
         for(var i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
         }
         return new Blob([new Uint8Array(array)], {type: mimeString});
         };*/


        var convertURIToImageData = function (URI) {
            return new Promise(function (resolve, reject) {
                if (URI == null) return reject();
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d'),
                    image = new Image();
                image.addEventListener('load', function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
                }, false);
                image.src = URI;
                $scope.newConverted = image.src;


                var imageType = (URI.split(";")[0]).split(":")[1];
                var imagefromat = ((URI.split(";")[0]).split(":")[1]).split("/")[1];
                var imageName = "newProfilePic." + imagefromat;

                var blob = new Blob([URI], {type: imageType});
                //var NewCroppedfile = new File([blob], imageName,{type: imageType,lastModified:new Date()});
                console.log("File date ", blob);


                var fd = new FormData();
                fd.append('file', blob);

                $http.post(fileService.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (response) {
                    changeUrl(response.Result);
                    $uibModalInstance.dismiss('cancel');
                }).error(function (error) {
                    alert(error);
                    console.log("error")
                });


                /* $scope.uploadCropped(NewCroppedfile).then(function (response) {
                 console.log(response);
                 })*/


                /*if( uploader.queue.length>0)
                 {
                 uploader.clearQueue();
                 }


                 var newFile= new FileUploader.FileItem(uploader,file);
                 console.log("new FileData ",newFile);
                 //uploader.queue.push(newFile);
                 newFile.progress = 100;
                 newFile.isUploaded = true;
                 newFile.isSuccess = true;
                 uploader.queue.push(newFile);
                 console.log("New Queue ",uploader.queue);

                 /!*
                 alert(uploader.queue.length);
                 angular.forEach(uploader.queue, function (item) {
                 item.upload();
                 });
                 *!/
                 uploader.queue[0].upload();*/

                //uploader.queue[0].upload();
                //uploader.uploadItem($scope.newConverted);

            });

            //var URI = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAABsiqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/iKC3/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/2uLp///////R2uP/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/////////////////+3w9P+IoLf/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv9siqb/bIqm/2yKpv///////////+3w9P+tvc3/dZGs/2yKpv9siqb/bIqm/2yKpv9siqb/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH////////////0+Pv/erDR/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB//////////////////////96sNH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/TZbB/02Wwf////////////////+Ft9T/TZbB/02Wwf9NlsH/TZbB/02Wwf9NlsH/E4zV/xOM1f8TjNX/E4zV/yKT2P/T6ff/////////////////4fH6/z+i3f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f+m1O/////////////////////////////w+Pz/IpPY/xOM1f8TjNX/E4zV/xOM1f8TjNX/E4zV/xOM1f8TjNX////////////T6ff/Tqng/6bU7////////////3u/5/8TjNX/E4zV/xOM1f8TjNX/AIv//wCL//8Ai///AIv/////////////gMX//wCL//8gmv////////////+Axf//AIv//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL///v+P///////+/4//+Axf//z+n/////////////YLf//wCL//8Ai///AIv//wCL//8Ai///AIv//wCL//8Ai///gMX/////////////////////////////z+n//wCL//8Ai///AIv//wCL//8Ai///AHr//wB6//8Aev//AHr//wB6//+Avf//7/f/////////////v97//xCC//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AHr//wB6//8Aev//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

        };

        $scope.uploadCropped = function (file) {
            return $http({
                method: 'POST',
                url: fileService.UploadUrl,
                data: file
            }).then(function (response) {
                return response;
            });

        }
    };

    app.controller("profilePicUploadController", profilePicUploadController);
}());
