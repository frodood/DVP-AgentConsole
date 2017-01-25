/**
 * Created by Veery Team on 9/9/2016.
 */

agentApp.directive("ticketTabView", function ($filter, $sce, moment, ticketService, $rootScope, authService, profileDataParser, userService, uuid4, FileUploader, baseUrls, fileService) {
    return {
        restrict: "EA",
        scope: {
            ticketDetails: "=",
            callCustomer: "&",
            tagList: "=",
            tagCategoryList: "=",
            loadTags: '&'
        },
        templateUrl: 'app/views/ticket/ticket-view.html',
        link: function (scope, element, attributes) {

            scope.uploadedAttchments = [];
            scope.uploadedCommentAttchments = [];
            scope.timeValidateMessage = "";
            scope.isTimeEdit = false;
            scope.userCompanyData = authService.GetCompanyInfo();
            scope.defaultEstimateTime = 0;

            scope.availableTags = scope.tagCategoryList;
            scope.tabReference = scope.tabReference + "-" + "18705056550";

            scope.oldFormModel = null;
            scope.currentSubmission = null;
            scope.currentForm = null;

            scope.newAssignee = {};
            scope.isOverDue = false;
            scope.newComment = "";
            scope.ticketNextLevels = [];


            scope.reqTicketSlots = [];


            scope.myProfileID = profileDataParser.myProfile._id;


            scope.messageMode = "public";


            scope.internalThumbFileUrl = baseUrls.fileService + "InternalFileService/File/Thumbnail/" + scope.userCompanyData.tenant + "/" + scope.userCompanyData.company + "/";
            scope.FileServiceUrl = baseUrls.fileService + "InternalFileService/File/Download/" + scope.userCompanyData.tenant + "/" + scope.userCompanyData.company + "/";


            scope.file = {};

            var uploader = scope.uploader = new FileUploader({
                url: baseUrls.fileService + "FileService/File/Upload",
                headers: {'Authorization': authService.GetToken()}
            });


            // FILTERS

            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });


            scope.callToCustomer = function (no) {
                var newId = scope.ticketDetails.tabReference;
                scope.ticketDetails.tabReference = newId + "-Call" + no;
                scope.callCustomer({callNumber: no});
            };


            scope.showAlert = function (title, type, msg) {
                new PNotify({
                    title: title,
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
                                            "value": enumVal.id,
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
                                            "value": enumVal.id,
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
                            scope.showAlert('Ticket Other Data', 'success', 'Ticket other data saved successfully');

                        }).catch(function (err) {
                            scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                        })
                    }
                    else {
                        //create new submission
                        if (scope.ticket) {
                            var obj = {
                                fields: arr,
                                reference: scope.ticket._id,
                                form: scope.currentForm.name
                            };

                            ticketService.getFormSubmissionByRef(scope.ticket._id).then(function (responseFS) {
                                //tag submission to ticket

                                if (responseFS.Result) {
                                    ticketService.updateFormSubmissionData(scope.ticket._id, obj).then(function (responseUpdate) {
                                        if (responseUpdate.Result) {
                                            ticketService.mapFormSubmissionToTicket(responseUpdate.Result._id, scope.ticket._id).then(function (responseMap) {
                                                //tag submission to ticket

                                                scope.showAlert('Ticket Other Data', 'success', 'Ticket other data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                                    })
                                }
                                else {
                                    ticketService.createFormSubmissionData(obj).then(function (response) {
                                        //tag submission to ticket
                                        if (response && response.Result) {
                                            ticketService.mapFormSubmissionToTicket(response.Result._id, scope.ticket._id).then(function (responseMap) {
                                                //tag submission to ticket

                                                scope.showAlert('Ticket Other Data', 'success', 'Ticket other data saved successfully');

                                            }).catch(function (err) {
                                                scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                                            });
                                        }
                                        else {
                                            scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
                                        }


                                    }).catch(function (err) {
                                        scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                                    })
                                }

                            }).catch(function (err) {
                                scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');

                            });


                        }
                        else {
                            scope.showAlert('Ticket Other Data', 'error', 'Ticket other data save failed');
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
                        if (response && response.Result && response.Result.ticket_form) {
                            //compare two forms
                            if (response.Result.ticket_form._id !== formSubmission.form._id) {
                                scope.currentForm = response.Result.ticket_form;
                                buildFormSchema(schema, form, response.Result.ticket_form.fields);

                                scope.buildModel = false;

                            }
                            else {
                                scope.currentForm = response.Result.ticket_form;
                                buildFormSchema(schema, form, response.Result.ticket_form.fields);
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

                    //create form submission

                    var schema = {
                        type: "object",
                        properties: {}
                    };

                    var form = [];

                    scope.buildModel = true;

                    ticketService.getFormsForCompany().then(function (response) {
                        if (response && response.Result && response.Result.ticket_form) {
                            //compare two forms
                            buildFormSchema(schema, form, response.Result.ticket_form.fields);
                            scope.currentForm = response.Result.ticket_form;

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


                }

            };


            String.prototype.toDurationFormat = function () {

                var mill_sec_num = parseInt(this, 10); // don't forget the second param
                var sec_num = Math.floor(mill_sec_num / 1000);
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                var days = "";

                if (hours >= 24) {
                    days = Math.floor(hours / 24);
                    hours = Math.floor(hours % 24);
                }


                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                if (days < 10) {
                    days = "0" + days;
                }


                return days + "d:" + hours + "h:" + minutes + "m:" + seconds + "s";


            };


            scope.subTickets = [];
            scope.relTickets = [];
            scope.ticketLoggedTime = 0;
            scope.ticketLoggedTimeFormat = "";
            scope.ticketEstimatedTimeFormat = "";
            scope.ticketRemainingTimeFormat = "";
            scope.ticketEstimatedPrecentage = 0;
            scope.ticketLoggedPrecentage = 0;
            scope.ticketRemainingPrecentage = 0;
            scope.collaboratorLoggedTime = {};
            scope.isWatching = false;
            scope.newTicketEstimatedTimeFormat = "";


            scope.getTicketLoggedTime = function (ticketId) {

                ticketService.PickLoggedTime(ticketId).then(function (response) {

                    if (response.data.IsSuccess) {
                        if (response.data.Result.length > 0) {
                            scope.logedTimes = response.data.Result;
                            for (var i = 0; i < response.data.Result.length; i++) {
                                scope.ticketLoggedTime = scope.ticketLoggedTime + response.data.Result[i].time;
                                if (i == response.data.Result.length - 1) {
                                    if (scope.ticket.time_estimation && Number(scope.ticket.time_estimation) != 0) {
                                        scope.TimePanelMaker();
                                    }


                                }
                            }


                            scope.logedTimes.forEach(function (item) {


                                var result = scope.ticket.collaborators.filter(function (obj) {
                                    return obj._id == item.user;
                                });

                                if (result && result.length > 0) {

                                    if (!result[0].loggedTime)
                                        result[0].loggedTime = 0;

                                    result[0].loggedTime += item.time;
                                }

                            });


                            scope.ticket.collaborators.forEach(function (item) {

                                if (item.loggedTime) {
                                    item.loggedTime = item.loggedTime.toString().toDurationFormat();


                                }
                            });


                        }
                        else {
                            console.log("No logged to this ticket");
                        }
                    }
                    else {
                        console.log("Error in looged time picking");
                    }

                }), function (error) {
                    console.log("Error in looged time picking");
                }

            }


            scope.ticketID = scope.ticketDetails.notificationData._id;


            scope.userList = profileDataParser.userList;
            scope.assigneeList = profileDataParser.assigneeList;


            scope.assigneeUsers = profileDataParser.assigneeUsers;
            scope.assigneeGroups = profileDataParser.assigneeUserGroups;


            scope.loadTicketNextLevel = function () {
                ticketService.getTicketNextLevel(scope.ticket.type, scope.ticket.status).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.ticketNextLevels = response.data.Result;
                    }
                    else {
                        console.log("failed to load next levels of ticket ", response.data.Exception);
                    }
                }), function (error) {
                    console.log("failed to load next levels of ticket ", error);
                }
            };

            scope.contactList = [];

            var fileSlotChecker = function () {

                if (scope.ticket.tags) {
                    angular.forEach(scope.ticket.tags, function (value) {

                    });
                }
            }


            var setContactList = function (ticket) {
                try {
                    if (ticket.requester) {
                        if (ticket.requester.contacts) {
                            var nos = $filter('filter')(ticket.requester.contacts, {type: 'phone'});
                            scope.contactList = nos.map(function (obj) {
                                return obj.contact;
                            });
                        }
                        if (ticket.requester.phone)
                            scope.contactList.push(ticket.requester.phone);
                        if (ticket.requester.landnumber)
                            scope.contactList.push(ticket.requester.landnumber);
                    }
                }
                catch (ex) {
                    console.log("Failed to Set Contact No ", ex);
                }
            };
            scope.loadTicketSummary = function (ticketID) {

                ticketService.getTicket(ticketID).then(function (response) {

                    if (response.data.IsSuccess) {
                        scope.ticket = response.data.Result;


                        fileSlotChecker();

                        setContactList(response.data.Result);
                        if (response.data.Result) {
                            scope.currentSubmission = response.data.Result.form_submission;
                            convertToSchemaForm(response.data.Result.form_submission, function (schemaDetails) {
                                if (schemaDetails) {
                                    scope.schema = schemaDetails.schema;
                                    scope.form = schemaDetails.form;
                                    scope.model = schemaDetails.model;
                                }

                            });


                        }

                        if (scope.ticket.created_at) {

                            scope.ticket.created_at = moment(scope.ticket.created_at).local().format("YYYY-MM-DD HH:mm:ss");

                        }

                        if (scope.ticket.due_at) {
                            scope.ticket.due_at = moment(scope.ticket.due_at).local().format("YYYY-MM-DD HH:mm:ss");
                            scope.nowDate = moment().local().format("YYYY-MM-DD HH:mm:ss");
                            if ((moment(scope.ticket.due_at).diff(moment(scope.nowDate))) < 0) {
                                scope.isOverDue = true;
                            }
                            ;
                        }
                        else {
                            scope.ticket.due_at = "Not specified";
                        }


                        if (scope.ticket.attachments) {
                            scope.uploadedAttchments = scope.ticket.attachments;
                        }

                        if (scope.ticket.watchers.indexOf(profileDataParser.myProfile._id) != -1) {
                            scope.isWatching = true;
                        }

                        scope.ticket.updated_at = moment(scope.ticket.updated_at).local().format("YYYY-MM-DD HH:mm:ss");

                        scope.relTickets = scope.ticket.related_tickets;
                        scope.subTickets = scope.ticket.sub_tickets;

                        console.log("ticket ", scope.ticket);


                        scope.getTicketLoggedTime(ticketID);
                        scope.loadTicketNextLevel();
                        scope.pickCompanyData(scope.ticket.tenant, scope.ticket.company);


                    }
                    else {
                        console.log("Error in picking ticket");
                    }

                }), function (error) {
                    console.log("Error in picking ticket ", error);
                }
            }

            scope.loadTicketSummary(scope.ticketID);


            scope.pickCompanyData = function (tenant, company) {
                ticketService.pickCompanyInfo(tenant, company).then(function (response) {


                    if (response.data.IsSuccess) {

                        scope.ticket.companyName = response.data.Result.companyName;
                    }

                }, function (error) {
                    console.log("Error in loading company info", error)
                });
            }

            scope.showSubCreateTicket = false;
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
                scope.showSubCreateTicket = !scope.showSubCreateTicket;
            };

            scope.editTicketMode = function () {
                scope.editTicketSt = !scope.editTicketSt;
            }


            scope.loadTicketView = function (data) {
                data.tabType = 'ticketView';
                data.index = data.reference;
                $rootScope.$emit('openNewTab', data);
            }


            scope.showAlert = function (tittle, type, msg) {
                new PNotify({
                    title: tittle,
                    text: msg,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            //update code damith
            // add edit modal box
            scope.editTicketSt = false;

            scope.tabs = [
                {
                    title: 'COMMENTS', content: 'Dynamic content 1', icon: 'main-icon-2-communication',
                    type: 'comments'
                },
                {
                    title: 'ACTIVITY', content: 'Dynamic content 2', icon: 'main-icon-2-star',
                    type: 'activity'
                },
                {
                    title: 'OTHER', content: 'Dynamic content 2', icon: 'main-icon-2-star',
                    type: 'other'
                }
            ];

            scope.goToComment = function () {
                $('html,body').animate({
                        scrollTop: $(".comment-goto-div").offset().top
                    },
                    'slow');
            };

            scope.clickShowTickerEditMode = function () {
                scope.editTicketSt = !scope.editTicketSt;
                scope.editTicket = scope.ticketDetails.notificationData;
            };

            scope.updateTicketDetails = function () {
                ticketService.updateTicket(scope.ticket._id, scope.editTicket).then(function (response) {

                    if (response.data.IsSuccess) {
                        scope.ticket.description = scope.editTicket.description;
                        scope.ticket.subject = scope.editTicket.subject;
                        scope.showAlert("Updated", "success", "Ticket updated successfully");


                        if (scope.ticket.due_at) {
                            scope.ticket.due_at = moment(scope.ticket.due_at).local().format("YYYY-MM-DD HH:mm:ss");


                        }
                        else {
                            scope.ticket.due_at = "Not specified";
                        }

                        if (scope.ticket.created_at) {
                            scope.ticket.created_at = moment(scope.ticket.created_at).local().format("YYYY-MM-DD HH:mm:ss");
                        }
                        scope.editTicketSt = false;


                    }
                    else {
                        scope.showAlert("Error", "error", "Ticket updation failed");
                        console.log("Error in updating ", response.data.Exception);
                    }

                }, function (error) {
                    scope.showAlert("Error", "success", "Ticket updation failed");
                    console.log("Error in updating ", error);
                });

                scope.updateTicketByReference();

            };

            scope.updateTicketByReference = function () {
                var notifyData = scope.ticketDetails.notificationData.activeSession;
                if (notifyData) {
                    var ticketRefData = {
                        body: "New Call Session Map To Existing Ticket.",
                        body_type: "text",
                        type: "call incoming",
                        public: "internal",
                        author_external: notifyData.authorExternal,
                        channel: "call",
                        channel_from: notifyData.channelFrom,
                        engagement_session: notifyData.sessionId,
                        meta_data: notifyData.activeSession
                    };

                    ticketService.UpdateTicketByReference(scope.ticket.reference, ticketRefData).then(function (response) {
                        if (response) {
                            scope.ticketDetails.notificationData.activeSession = undefined;
                        }
                    }, function (error) {
                        console.log("Error in updating ", error);
                    });
                }
            };

            scope.closeTicket = function () {
                $rootScope.$emit('closeTab', scope.ticket._id);

            };

            scope.showCommentDrop = false;


            scope.showNewComment = function () {
                scope.isNewComment = !scope.isNewComment;
            };
            scope.newComment = "";

            scope.addComment = function (message, mode) {

                scope.newComment = message;


                if (scope.uploadedComAttchments.length > 0 || scope.newComment != "") {
                    if (scope.newComment == "" && scope.uploadedComAttchments.length > 0) {

                        scope.newComment = "Attachment Comment";
                    }

                    var channel = "";
                    var eng_session = "";
                    var reply_session = "";
                    var reply_chnl_from = "";
                    var reply_chnl_to = "";
                    var comentAttachmentIds = [];

                    angular.forEach(scope.uploadedComAttchments, function (value) {
                        comentAttachmentIds.push(value._id);
                    });


                    if (scope.ticket.engagement_session) {
                        if (scope.ticket.engagement_session.channel != "call") {
                            channel = scope.ticket.engagement_session.channel;
                        }

                        reply_session = scope.ticket.engagement_session._id;
                        reply_chnl_from = scope.ticket.engagement_session.channel_to;
                        reply_chnl_to = scope.ticket.engagement_session.channel_from;
                    }


                    if (scope.messageMode == "public") {

                    }
                    else if (scope.messageMode == "public") {

                    }
                    else {

                    }

                    var commentObj =
                    {
                        "body": scope.newComment,
                        "body_type": "text",
                        "type": "comment",
                        "public": mode,
                        "channel": channel,
                        "engagement_session": eng_session,
                        "reply_session": reply_session,
                        "attachments": comentAttachmentIds


                    }

                    if (mode == "public") {
                        commentObj["channel_from"] = reply_chnl_from;
                        commentObj["channel_to"] = reply_chnl_to;
                    }


                    ticketService.AddNewCommentToTicket(scope.ticket._id, commentObj).then(function (response) {


                        if (response.data.IsSuccess) {
                            scope.newComment = '';
                            response.data.Result.author = profileDataParser.myProfile;
                            response.data.Result.attachments = scope.uploadedComAttchments;
                            scope.ticket.comments.push(response.data.Result);
                            console.log("New comment added ", response);
                            scope.showAlert("New Comment", "success", "completed");
                            scope.uploadedComAttchments = [];
                            scope.isNewComment = false;


                        }
                        else {
                            console.log("Error new comment ", response);
                            scope.showAlert("New Comment", "error", "failed");
                        }

                    }), function (error) {
                        console.log("Error new comment ", error);
                        scope.showAlert("New Comment", "error", "failed");
                    };

                }
                else {
                    scope.showAlert("Invalid Comment", "error", "Invalid Comment data");
                }


            };

            scope.cancelNewComment = function () {
                scope.isNewComment = false;
                scope.uploadedComAttchments = [];
            }

            scope.showCommentDropArea = function () {
                scope.showCommentDrop = !scope.showCommentDrop;
            }


            //edit assignee
            scope.isEditAssignee = false;
            scope.editAssignee = function () {
                scope.isEditAssignee = !scope.isEditAssignee;
            };

            scope.changeAssignee = function () {

                var assigneeObj = {};
                if (typeof(scope.newAssignee) == 'string') {
                    assigneeObj = JSON.parse(scope.newAssignee);
                }
                else {
                    assigneeObj = scope.newAssignee;
                }


                if (assigneeObj && scope.ticket) {
                    if (assigneeObj.listType === "User") {
                        ticketService.AssignUserToTicket(scope.ticket._id, assigneeObj._id).then(function (response) {
                            if (response && response.data.IsSuccess) {
                                scope.showAlert("Ticket assigning", "success", "Ticket assignee changed successfully");
                                scope.ticket.assignee = assigneeObj;

                                scope.isEditAssignee = false;
                            }
                            else {
                                scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                            }
                        }, function (error) {
                            scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                        });
                    } else {
                        ticketService.AssignUserGroupToTicket(scope.ticket._id, assigneeObj._id).then(function (response) {
                            if (response && response.data.IsSuccess) {

                                scope.showAlert("Ticket assigning", "success", "Ticket assignee changed successfully");
                                scope.ticket.assignee = undefined;
                                scope.ticket.assignee_group = assigneeObj;

                                scope.isEditAssignee = false;

                            }
                            else {
                                scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                            }
                        }, function (error) {
                            scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                        });
                    }
                }
                else {
                    scope.showAlert("Ticket assigning", "error", "Invalid assignee details provided");
                }


            };

            scope.setAssigneeAsMe = function () {

                ticketService.AssignUserToTicket(scope.ticket._id, profileDataParser.myProfile._id).then(function (response) {
                    if (response && response.data.IsSuccess) {
                        scope.showAlert("Ticket assigning", "success", "Ticket assignee changed successfully");
                        scope.ticket.assignee = profileDataParser.myProfile;

                        scope.isEditAssignee = false;
                    }
                    else {
                        scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                    }
                }, function (error) {
                    scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                });
            }

            scope.assignToMe = function (id) {
                ticketService.PickTicket(id).then(function (response) {
                    if (response) {

                        scope.showAlert("Ticket assigning", "success", "Successfully assign.");
                        scope.ticket.assignee = profileDataParser.myProfile;

                    }
                    else {
                        scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed");
                    }
                }, function (error) {
                    scope.showAlert("Ticket assigning", "error", "Ticket assignee changing failed", error);
                });
            };

            scope.changeTicketStatus = function (newStatus) {

                var bodyObj =
                {
                    status: newStatus
                };

                ticketService.updateTicketStatus(scope.ticket._id, bodyObj).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.ticket.status = newStatus;
                        scope.loadTicketNextLevel();
                    }
                    else {
                        console.log("Failed to change status of ticket " + scope.ticket._id);
                    }

                }) , function (error) {
                    console.log("Failed to change status of ticket " + scope.ticket._id, error);
                }
            };

// ..............................  new sub ticket .....................

            scope.newSubTicket = {};
            scope.newSubTicket.reference = uuid4.generate();


            scope.setPriority = function (priority) {
                scope.newSubTicket.priority = priority;
            };

            scope.saveSubTicket = function (subTicket) {

                if (scope.ticket.channel) {
                    scope.newSubTicket.channel = scope.ticket.channel;
                }
                if (scope.ticket.custom_fields) {
                    scope.newSubTicket.custom_fields = scope.ticket.custom_fields;
                }

                if (scope.postTags) {
                    scope.newSubTicket.tags = scope.postTags.map(function (obj) {
                        return obj.name;
                    });
                }
                if (subTicket.assignee) {
                    /*var subTicketAssignee=JSON.parse(subTicket.assignee);
                     if(subTicketAssignee.listType == "User")
                     {
                     subTicket.assignee=subTicketAssignee;
                     }
                     else
                     {
                     subTicket.assignee_group=subTicketAssignee
                     }*/
                    subTicket.assignee = JSON.parse(subTicket.assignee);
                    subTicket.assignee_group = subTicket.assignee;
                }

                ticketService.AddSubTicket(scope.ticket._id, subTicket).then(function (response) {

                    if (response.data.IsSuccess) {
                        scope.showAlert("Sub ticket saving", "success", "Sub ticket saved successfully");

                        /*scope.assigneeList.filter(function (assigneeObj) {
                         if(assigneeObj._id==response.data.Result.assignee)
                         {
                         response.data.Result.assignee=assigneeObj;
                         scope.subTickets.push(response.data.Result);
                         }
                         })*/

                        response.data.Result.assignee = subTicket.assignee;
                        scope.subTickets.push(response.data.Result);

                        scope.showSubCreateTicket = false;
                        console.log("Sub ticket added successfully");
                    }
                    else {
                        scope.showAlert("Sub ticket saving", "error", "Sub ticket saving failed");
                        console.log("Sub ticket adding failed");
                    }

                }), function (error) {
                    scope.showAlert("Sub ticket saving", "error", "Sub ticket saving failed");
                    console.log("Sub ticket adding failed", error);
                }
            };


            // tag selection

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
             scope.availableTags = chip.tags;
             return;
             }
             }
             setToDefault();
             }

             };*/
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


            // file upload .........

            scope.file = {};

            var uploader = scope.uploader = new FileUploader({
                url: baseUrls.fileService + "FileService/File/Upload",
                headers: {'Authorization': authService.GetToken()}
            });
            /*  var com_uploader = scope.com_uploader = new FileUploader({
             url: baseUrls.fileService+"FileService/File/Upload",
             headers: {'Authorization':  authService.GetToken()}
             });*/

            // FILTERS

            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    return this.queue.length < 10;
                }
            });
            /*com_uploader.filters.push({
             name: 'customFilter',
             fn: function (item /!*{File|FileLikeObject}*!/, options) {
             return this.queue.length < 10;
             }
             });*/

            /*var com_uploader = scope.uploader = new FileUploader({
             url: baseUrls.fileService+"FileService/File/Upload",
             headers: {'Authorization':  authService.GetToken()}
             });

             // FILTERS

             com_uploader.filters.push({
             name: 'customFilter',
             fn: function (item /!*{File|FileLikeObject}*!/, options) {
             return this.queue.length < 10;
             }
             });*/


            //uploader.formData.push({'DuoType' : 'fax'});

            // CALLBACKS


            scope.file = {};
            scope.file.Category = "TICKET_ATTACHMENTS";
            scope.uploadProgress = 0;
            scope.isTicketAttachment = true;
            scope.isCommentCompleted = true;
            scope.isUploading = false;

            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);

                if (scope.isNewSlot) {
                    if (scope.updationSlot.slot.fileType == fileItem._file.type.split("/")[0]) {
                        fileItem.upload();
                    }
                    else {
                        scope.showAlert("Upload file for Slot", "error", "Invalid file format detected, Uploading failed");
                    }
                }
                else {
                    fileItem.upload();
                }


                /*if( scope.file.Category=="COMMENT_ATTACHMENTS")
                 {
                 scope.file.Category="TICKET_ATTACHMENTS";
                 }
                 else
                 {
                 scope.file.Category="COMMENT_ATTACHMENTS";
                 }*/
            };
            uploader.onAfterAddingAll = function (addedFileItems) {

                if (!scope.file.Category) {
                    uploader.clearQueue();
                    new PNotify({
                        title: 'File Upload!',
                        text: 'Please Select File Category.',
                        type: 'error',
                        styling: 'bootstrap3'
                    });
                    return;
                }
                if (scope.isNewComment) {
                    scope.isCommentCompleted = false;
                    scope.isUploading = true;
                }
                if (scope.isNewSlot) {
                    scope.isUploading = true;
                }


                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {

                item.formData.push({'fileCategory': scope.file.Category});
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function (fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
                scope.uploadProgress = progress;
                if (scope.uploadProgress == 100) {
                    scope.showAlert("Attachment", "success", "Successfully uploaded");
                    /* setTimeout(function () {
                     scope.uploadProgress=0;
                     }, 500);*/

                }
            };
            uploader.onProgressAll = function (progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
                scope.showAlert("Attachment", "error", "Uploading failed");
                scope.uploadProgress = 0;
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                if (response.IsSuccess) {
                    var attchmentData =
                    {
                        file: fileItem._file.name,
                        //url: baseUrls.fileService + "InternalFileService/File/Download/" + scope.userCompanyData.tenant + "/" + scope.userCompanyData.company + "/" + response.Result + "/SampleAttachment",
                        url: response.Result,
                        type: fileItem._file.type,
                        size: fileItem._file.size
                    }


                    ticketService.AddNewAttachmentToTicket(scope.ticket._id, attchmentData).then(function (response) {

                        if (response.data.IsSuccess) {

                            scope.uploadedAttchments.push(response.data.Result);

                            if (scope.isNewComment) {
                                scope.uploadedComAttchments.push(response.data.Result);


                            }
                            if (scope.isNewSlot) {
                                scope.isNewSlot = false;
                                scope.isUploading = false;

                                if (scope.updationSlot.slot) {

                                    ticketService.AddAttachmentToSlot(scope.ticket._id, scope.updationSlot.slot.name, response.data.Result._id).then(function (resSlots) {

                                        if (resSlots.data.IsSuccess) {
                                            for (var i = 0; i < scope.ticket.slot_attachment.length; i++) {
                                                if (scope.ticket.slot_attachment[i].slot.name == scope.updationSlot.slot.name) {
                                                    scope.ticket.slot_attachment[i].attachment = attchmentData;
                                                }
                                            }
                                        }
                                        else {
                                            console.log("Error slot adding")
                                        }

                                    }, function (errSlots) {
                                        console.log("Error slot adding", errSlots);
                                    });


                                }
                                else {
                                    console.log("Invalid Slot");
                                }

                                //
                            }


                        }
                        else {
                            console.log("Invalid attachment");
                        }

                    }).catch(function (error) {
                        console.log("Invalid attachment error", error);
                    });


                }
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
                if (scope.isNewComment) {
                    scope.isCommentCompleted = true;
                    scope.isUploading = false;
                }
            };


            scope.uploadedComAttchments = [];


            scope.isNewComment = false;


            scope.deleteAttachment = function (attchmntID) {

                ticketService.RemoveAttachmentFromTicket(scope.ticket._id, attchmntID).then(function (response) {
                    if (response.data.IsSuccess) {
                        var attachmentItem = $filter('filter')(scope.uploadedAttchments, {
                            _id: attchmntID

                        })[0];

                        scope.uploadedAttchments.splice(scope.uploadedAttchments.indexOf($filter('filter')(scope.uploadedAttchments, {
                            _id: attchmntID

                        })[0]), 1);

                        if (scope.isNewComment) {
                            scope.uploadedComAttchments.splice(scope.uploadedComAttchments.indexOf($filter('filter')(scope.uploadedComAttchments, {
                                _id: attchmntID

                            })[0]), 1);
                        }


                    }
                }), function (error) {
                    console.log(error);
                }
            };

            /*Audio Player*/
            scope.isPlay = false;
            scope.downloadAttachment = function (attachment) {
                fileService.downloadAttachment(attachment);
            };
            scope.config = {
                preload: "auto",
                tracks: [
                    {
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }
                ],
                theme: {
                    url: "bower_components/videogular-themes-default/videogular.css"
                },
                "analytics": {
                    "category": "Videogular",
                    "label": "Main",
                    "events": {
                        "ready": true,
                        "play": true,
                        "pause": true,
                        "stop": true,
                        "complete": true,
                        "progress": 10
                    }
                }
            };

            var videogularAPI = null;
            scope.onPlayerReady = function (API) {
                videogularAPI = API;

            };
            scope.closePlayer = function () {
                videogularAPI.stop();
                scope.isPlay = false;
            };
            scope.onPlayerComplete = function (api) {
                scope.closePlayer();
            };

            scope.playFile = function (id) {

                if (videogularAPI && id) {
                    var info = authService.GetCompanyInfo();
                    var fileToPlay = baseUrls.fileService + 'InternalFileService/File/DownloadLatest/' + info.tenant + '/' + info.company + '/' + id + '.mp3';

                    var arr = [
                        {
                            src: $sce.trustAsResourceUrl(fileToPlay),
                            type: 'audio/mp3'
                        }
                    ];

                    scope.config.sources = arr;
                    videogularAPI.play();
                    scope.isPlay = true;
                }


            };
            scope.playAttachment = function (attachment) {

                if (scope.isImage(attachment.type)) {

                    document.getElementById("image-viewer").href = scope.FileServiceUrl + attachment.url + "/SampleAttachment";

                    $('#image-viewer').trigger('click');


                }
                else {
                    if (videogularAPI && attachment.url) {
                        var info = authService.GetCompanyInfo();

                        var fileToPlay = scope.FileServiceUrl + attachment.url + "/SampleAttachment";

                        var arr = [
                            {
                                src: $sce.trustAsResourceUrl(fileToPlay),
                                type: attachment.type
                            }
                        ];

                        scope.config.sources = arr;
                        videogularAPI.play();
                        scope.isPlay = true;
                    }
                }


            };


            scope.watchTicket = function () {
                ticketService.WatchTicket(scope.ticket._id).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.showAlert("Success", "success", "Ticket is started to watch");
                        scope.isWatching = true;
                        if (scope.ticket.watchers.indexOf(profileDataParser.myProfile._id) == -1) {
                            scope.ticket.watchers.push(profileDataParser.myProfile._id);
                        }

                    }
                }), function (error) {
                    scope.showAlert("Error", "success", "Failed to watch this ticket");
                }
            };
            scope.stopWatchTicket = function () {
                ticketService.StopWatchTicket(scope.ticket._id).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.showAlert("Success", "success", "Ticket watching stoped");
                        if (scope.ticket.watchers.indexOf(profileDataParser.myProfile._id) != -1) {
                            scope.ticket.watchers.splice(scope.ticket.watchers.indexOf(profileDataParser.myProfile._id), 1);
                        }
                        scope.isWatching = false;
                    }
                }), function (error) {
                    scope.showAlert("Error", "success", "Failed to stop watching this ticket");
                }
            };

            scope.isImage = function (fileType) {


                if (fileType && fileType.toString().split("/")[0] == "image") {
                    return true;
                }
                else {
                    return false;
                }


            };

            scope.isViewable = function (fileType) {
                if (fileType && (fileType.toString().split("/")[0] == "video" || fileType.toString().split("/")[0] == "audio")) {
                    return true;
                }
                else {
                    return false;
                }

            }

            scope.isNewSlot = false;
            scope.updationSlot;
            scope.uploadAttachmentToSlot = function (slot) {
                $("#commentUploader").click();
                scope.isNewSlot = true;
                scope.updationSlot = slot;
            }

            /*Audio Player-end*/


            // Estimated time edit
            scope.isValidTime = true;
            scope.TimePanelMaker = function () {
                scope.ticketEstimatedPrecentage = 100;
                try {
                    scope.ticketEstimatedTimeFormat = scope.ticket.time_estimation.toString().toDurationFormat();
                    scope.newTicketEstimatedTimeFormat = scope.ticket.time_estimation.toString().toDurationFormat();
                    scope.ticketLoggedPrecentage = Math.floor((scope.ticketLoggedTime / scope.ticket.time_estimation) * 100);
                    scope.ticketRemainingPrecentage = Math.floor(((scope.ticket.time_estimation - scope.ticketLoggedTime) / scope.ticket.time_estimation) * 100);
                    scope.ticketLoggedTimeFormat = scope.ticketLoggedTime.toString().toDurationFormat();
                    scope.ticketRemainingTimeFormat = (scope.ticket.time_estimation - scope.ticketLoggedTime).toString().toDurationFormat();


                    if (scope.ticketLoggedPrecentage > 100) {
                        scope.ticketRemainingTimeFormat = "00d00h00m00s";
                    }

                    console.log("Estimated " + scope.ticketEstimatedTimeFormat);
                    console.log("Logged " + scope.ticketLoggedTimeFormat);
                    console.log("Remaining " + scope.ticketRemainingTimeFormat);
                    scope.isValidTime = true;
                }
                catch (ex) {
                    scope.showAlert("Error", "error", "Invalid Time format");
                    scope.timeValidateMessage = "Invalid Time format";
                    scope.isValidTime = false;
                }


            }

            scope.updateTicketEstimatedTime = function () {


                var timeArray = scope.newTicketEstimatedTimeFormat.split(":");
                var timeInSeconds = 0;


                for (var i = 0; i < timeArray.length; i++) {
                    var item = timeArray[i];

                    if (item.indexOf("d") != -1) {
                        timeInSeconds = timeInSeconds + Number(item.split("d")[0] * 24 * 60 * 60 * 1000);
                    }
                    if (item.indexOf("h") != -1) {
                        timeInSeconds = timeInSeconds + Number(item.split("h")[0] * 60 * 60 * 1000);
                    }
                    if (item.indexOf("m") != -1) {
                        timeInSeconds = timeInSeconds + Number(item.split("m")[0] * 60 * 1000);
                    }
                    if (item.indexOf("s") != -1) {
                        timeInSeconds = timeInSeconds + Number(item.split("s")[0] * 1000);
                    }
                    if (i == timeArray.length - 1) {
                        //return timeInSeconds;

                        if (isNaN(timeInSeconds)) {
                            scope.timeValidateMessage = "Invalid Time format";
                            scope.isTimeEdit = true;
                            scope.showAlert("Error", "error", "Invalid Time format");
                            scope.isValidTime = false;
                        }
                        else {
                            scope.isTimeEdit = false;
                            scope.isValidTime = true;

                            ticketService.updateTicketEstimateTime(scope.ticket._id, timeInSeconds).then(function (response) {
                                if (response.data.IsSuccess) {
                                    scope.ticket.time_estimation = response.data.Result.time_estimation;
                                    scope.showAlert("Success", "success", "Estimated Time Changed");
                                    scope.TimePanelMaker();

                                } else {
                                    scope.showAlert("Error", "error", "Estimated Time updation failed");
                                    console.log("Estimated Time updation failed");
                                }
                            }, function (error) {
                                scope.showAlert("Error", "error", "Estimated Time updation failed");
                                console.log("Estimated Time updation failed", error);
                            })
                        }


                    }
                }


            }


            scope.checkAttachmentAvailability = function (comment) {
                if (comment.body == 'Attachment Comment' && comment.attachments.length == 0) {
                    return false;
                }
                else {
                    return true;
                }
            }

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

            scope.deleteSlotAttachment = function (slot) {
                ticketService.DeleteAttachmentFromSlot(scope.ticket._id, slot.slot.name, "TestAttachment").then(function (resDelSlot) {

                    if (resDelSlot.data.IsSuccess) {


                        for (var i = 0; i < scope.ticket.slot_attachment.length; i++) {
                            if (scope.ticket.slot_attachment[i].slot.name == slot.slot.name) {
                                scope.ticket.slot_attachment[i].attachment = "";
                            }
                        }
                    }
                    else {
                        scope.showAlert("Delete Slot Attachment", "error", "Failed to delete slot attachment");
                    }

                }, function (errDelSlot) {
                    scope.showAlert("Delete Slot Attachment", "error", "Failed to delete slot attachment");
                })
            }

        }


    }

});