/**
 * Created by Pawan on 9/9/2016.
 */

agentApp.directive("ticketTabView", function (moment,ticketService,$rootScope,authService,myProfileDataParser) {
    return {
        restrict: "EA",
        scope: {
            ticketDetails: "@",
            direction: "@",
            channelFrom: "@",
            channelTo: "@",
            channel: "@",
            skill: "@",
            sessionId: "@"
        },
        templateUrl: 'app/views/ticket/ticket-view.html',
        link: function (scope, element, attributes) {

            scope.oldFormModel = null;
            scope.currentSubmission = null;
            scope.currentForm = null;

            scope.newAssignee={};
            scope.isOverDue=false;
            scope.newComment="";

            scope.showAlert = function (tittle, type, msg) {
                new PNotify({
                    title: tittle,
                    text: msg,
                    type: type,
                    styling: 'bootstrap3',
                    icon: false
                });
            };


            var buildFormSchema = function(schema, form, fields)
            {
                fields.forEach(function (fieldItem)
                {
                    if(fieldItem.field)
                    {
                        var isActive = true;
                        if(fieldItem.active === false)
                        {
                            isActive = false;
                        }

                        //field type parser

                        if(fieldItem.type === 'text')
                        {

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
                        else if(fieldItem.type === 'textarea')
                        {

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
                        else if(fieldItem.type === 'url')
                        {

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
                        else if(fieldItem.type === 'header')
                        {
                            var h2Tag = '<h2>' + fieldItem.title + '</h2>';
                            form.push({
                                "type": "help",
                                "helpvalue": h2Tag
                            });
                        }
                        else if(fieldItem.type === 'radio')
                        {
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


                            if(fieldItem.values && fieldItem.values.length > 0)
                            {

                                schema.properties[fieldItem.field].enum = [];

                                fieldItem.values.forEach(function(enumVal)
                                {
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
                        else if(fieldItem.type === 'date')
                        {

                            schema.properties[fieldItem.field] = {
                                type: 'string',
                                title: fieldItem.title,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive,
                                format: 'date'

                            };

                            form.push({
                                "key": fieldItem.field,
                                "minDate": "2014-06-20"
                            })
                        }
                        else if(fieldItem.type === 'number')
                        {

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
                        else if(fieldItem.type === 'phone')
                        {

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
                        else if(fieldItem.type === 'boolean' || fieldItem.type === 'checkbox')
                        {

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
                        else if(fieldItem.type === 'checkboxes')
                        {

                            schema.properties[fieldItem.field] = {
                                type: 'array',
                                title: fieldItem.title,
                                description: fieldItem.description,
                                required: fieldItem.require ? true : false,
                                readonly: !isActive,
                                items: {
                                    type: "string",
                                    enum:[]
                                }

                            };

                            if(fieldItem.values && fieldItem.values.length > 0)
                            {

                                fieldItem.values.forEach(function(enumVal)
                                {
                                    schema.properties[fieldItem.field].items.enum.push(enumVal.name);
                                })

                            }

                            form.push(fieldItem.field);
                        }
                        else if(fieldItem.type === 'email')
                        {

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
                        else if(fieldItem.type === 'select')
                        {
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

                            if(fieldItem.values && fieldItem.values.length > 0)
                            {

                                schema.properties[fieldItem.field].enum = [];

                                fieldItem.values.forEach(function(enumVal)
                                {
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

             scope.onSubmit = function(form)
             {
                scope.$broadcast('schemaFormValidate');
                if (form.$valid)
                {
                    var arr = [];

                    for (var key in scope.model)
                    {
                        if (scope.model.hasOwnProperty(key))
                        {
                            arr.push({
                                field: key,
                                value: scope.model[key]
                            });

                        }
                    }

                    //save arr
                    if(scope.currentSubmission)
                    {
                        var obj = {
                            fields: arr
                        };
                        ticketService.updateFormSubmissionData(scope.currentSubmission.reference, obj).then(function(response)
                        {
                            scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                        }).catch(function(err)
                        {
                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                        })
                    }
                    else
                    {
                        //create new submission
                        if(scope.ticket)
                        {
                            var obj = {
                                fields: arr,
                                reference: scope.ticket._id,
                                form: scope.currentForm.name
                            };

                            ticketService.getFormSubmissionByRef(scope.ticket._id).then(function(responseFS)
                            {
                                //tag submission to ticket

                                if(responseFS.Result)
                                {
                                    ticketService.updateFormSubmissionData(scope.ticket._id, obj).then(function(responseUpdate)
                                    {
                                        if(responseUpdate.Result)
                                        {
                                            ticketService.mapFormSubmissionToTicket(responseUpdate._id, scope.ticket._id).then(function(responseMap)
                                            {
                                                //tag submission to ticket

                                                scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                                            }).catch(function(err)
                                            {
                                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                            });
                                        }
                                        else
                                        {
                                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');
                                        }


                                    }).catch(function(err)
                                    {
                                        scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                    })
                                }
                                else
                                {
                                    ticketService.createFormSubmissionData(obj).then(function(response)
                                    {
                                        //tag submission to ticket
                                        if(response && response.Result)
                                        {
                                            ticketService.mapFormSubmissionToTicket(response.Result._id, scope.ticket._id).then(function(responseMap)
                                            {
                                                //tag submission to ticket

                                                scope.showAlert('Operation Successful', 'info', 'Data saved successfully');

                                            }).catch(function(err)
                                            {
                                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                            });
                                        }
                                        else
                                        {
                                            scope.showAlert('Operation Failed', 'error', 'Data Save Failed');
                                        }



                                    }).catch(function(err)
                                    {
                                        scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                                    })
                                }

                            }).catch(function(err)
                            {
                                scope.showAlert('Operation Failed', 'error', 'Data Save Failed');

                            });



                        }
                        else
                        {
                            scope.showAlert('Operation Failed', 'error', 'Ticket not found');
                        }

                    }



                }
             };


            var convertToSchemaForm = function(formSubmission, callback)
            {

                //get forms profile

                if (formSubmission && formSubmission.form && formSubmission.form.fields && formSubmission.form.fields.length > 0)
                {
                    var schema = {
                        type: "object",
                        properties: {}
                    };

                    var form = [];

                    var model = {};
                    scope.buildModel = true;

                    ticketService.getFormsForCompany().then(function (response)
                    {
                        if(response && response.Result && response.Result.ticket_form)
                        {
                            //compare two forms
                            if(response.Result.ticket_form._id !== formSubmission.form._id)
                            {
                                scope.currentForm = response.Result.ticket_form;
                                buildFormSchema(schema, form, response.Result.ticket_form.fields);

                                scope.buildModel = false;

                            }
                            else
                            {
                                scope.currentForm = response.Result.ticket_form;
                                buildFormSchema(schema, form, response.Result.ticket_form.fields);
                            }
                        }
                        else
                        {
                            scope.currentForm = formSubmission.form;
                            buildFormSchema(schema, form, formSubmission.form.fields);
                        }

                        form.push({
                            type: "submit",
                            title: "Save"
                        });

                        if(formSubmission.fields && formSubmission.fields.length > 0)
                        {
                            formSubmission.fields.forEach(function (fieldValueItem)
                            {
                                if(fieldValueItem.field)
                                {
                                    model[fieldValueItem.field] = fieldValueItem.value;
                                }

                            });
                        }

                        var schemaResponse = {};

                        if(!scope.buildModel)
                        {
                            scope.oldFormModel = model;
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: {}
                            }
                        }
                        else
                        {
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: model
                            }

                        }

                        callback(schemaResponse);

                    }).catch(function(err)
                    {
                        scope.currentForm = formSubmission.form;
                        buildFormSchema(schema, form, formSubmission.form.fields);

                        form.push({
                            type: "submit",
                            title: "Save"
                        });

                        if(formSubmission.fields && formSubmission.fields.length > 0)
                        {
                            formSubmission.fields.forEach(function (fieldValueItem)
                            {
                                if(fieldValueItem.field)
                                {
                                    model[fieldValueItem.field] = fieldValueItem.value;
                                }

                            });
                        }

                        var schemaResponse = {};

                        if(!scope.buildModel)
                        {
                            scope.oldFormModel = model;
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: {}
                            }
                        }
                        else
                        {
                            schemaResponse = {
                                schema: schema,
                                form: form,
                                model: model
                            }

                        }

                        callback(schemaResponse);

                    });




                }
                else
                {
                    if(!formSubmission)
                    {
                        //create form submission

                        var schema = {
                            type: "object",
                            properties: {}
                        };

                        var form = [];

                        scope.buildModel = true;

                        ticketService.getFormsForCompany().then(function (response)
                        {
                            if(response && response.Result && response.Result.ticket_form)
                            {
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
                            else
                            {
                                callback(null);
                            }



                        }).catch(function(err)
                        {
                            callback(null);

                        });

                    }
                    else
                    {
                        callback(null);
                    }

                }

            };


            scope.subTickets = [];
            scope.relTickets = [];

            scope.ticketID = JSON.parse(scope.ticketDetails).notificationData._id;

            scope.userList=myProfileDataParser.userList;

            scope.loadTicketSummary = function (ticketID) {

                ticketService.getTicket(ticketID).then(function (response) {

                    if (response.data.IsSuccess) {
                        scope.ticket = response.data.Result;

                        if(response.data.Result)
                        {
                            scope.currentSubmission = response.data.Result.form_submission;
                            convertToSchemaForm(response.data.Result.form_submission, function(schemaDetails)
                            {
                                if(schemaDetails)
                                {
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
                            scope.nowDate =moment().local().format("YYYY-MM-DD HH:mm:ss");
                            if((moment(scope.ticket.due_at).diff(moment(scope.nowDate)))<0)
                            {
                                scope.isOverDue=true;
                            };
                        }
                        else {
                            scope.ticket.due_at = "Not specified";
                        }

                        scope.ticket.updated_at = moment(scope.ticket.updated_at).local().format("YYYY-MM-DD HH:mm:ss");

                        scope.relTickets = scope.ticket.related_tickets;
                        scope.subTickets = scope.ticket.sub_tickets;

                        console.log("ticket ", scope.ticket);
                    }
                    else {
                        console.log("Error in picking ticket");
                    }

                }), function (error) {
                    console.log("Error in picking ticket ", error);
                }
            }


            scope.loadTicketSummary(scope.ticketID);


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

            scope.editTicketSt=false;
            scope.editTicketMode = function () {
                scope.editTicketSt=!scope.editTicketSt;
            }


            scope.loadTicketView = function (ticket) {
                $rootScope.$emit('newTicketTab', ticket);
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
                        scrollTop: $(".comment").offset().top
                    },
                    'slow');
            };

            scope.clickShowTickerEditMode = function () {
                scope.editTicketSt = !scope.editTicketSt;
                scope.editTicket = JSON.parse(scope.ticketDetails).notificationData;
            };

            scope.updateTicketDetails = function () {
                ticketService.updateTicket(scope.ticket._id, scope.editTicket).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        scope.ticket.description=scope.editTicket.description;
                        scope.ticket.subject=scope.editTicket.subject;
                        scope.showAlert("Updated","success","Ticket updated successfully");


                        if(scope.ticket.due_at)
                        {
                            scope.ticket.due_at=moment(scope.ticket.due_at).local().format("YYYY-MM-DD HH:mm:ss");


                        }
                        else
                        {
                            scope.ticket.due_at="Not specified";
                        }

                        if(scope.ticket.created_at)
                        {
                            scope.ticket.created_at=moment(scope.ticket.created_at).local().format("YYYY-MM-DD HH:mm:ss");
                        }
                        scope.editTicketSt=false;


                    }
                    else {
                        scope.showAlert("Error", "error", "Ticket updation failed");
                        console.log("Error in updating ", response.data.Exception);
                    }

                }), function (error) {
                    scope.showAlert("Error", "success", "Ticket updation failed");
                    console.log("Error in updating ", error);
                }
            };

            scope.closeTicket = function () {
                $rootScope.$emit('closeTab', scope.ticket._id);

            };

            scope.addComment = function (message,mode) {

                var channel="";
                var eng_session="";
                var reply_session="";
                var reply_chnl_from="";
                var reply_chnl_to="";

                if(scope.ticket.engagement_session)
                {
                    channel=scope.ticket.engagement_session.channel;
                    reply_session=scope.ticket.engagement_session._id;
                    reply_chnl_from=scope.ticket.engagement_session.channel_to;
                    reply_chnl_to=scope.ticket.engagement_session.channel_from;
                }



                var commentObj =
                {
                    "body":  message,
                    "body_type": "text",
                    "type": "comment",
                    "public": mode,
                    "channel":  channel,
                    "engagement_session": eng_session,
                    "reply_session":reply_session


                }

                if(mode=="public")
                {
                    commentObj["channel_from"]=reply_chnl_from;
                    commentObj["channel_to"]=reply_chnl_to;
                }


                ticketService.AddNewCommentToTicket(scope.ticket._id, commentObj).then(function (response) {
                    if (response.data.IsSuccess) {
                        response.data.Result.author=myProfileDataParser.myProfile;
                        scope.ticket.comments.push(response.data.Result);
                        console.log("New comment added ",response);
                        scope.showAlert("New Comment","success","completed");
                        scope.newComment="";
                    }
                    else {
                        console.log("Error new comment ",response);
                        scope.showAlert("New Comment","error","failed");
                    }

                }), function (error) {
                    console.log("Error new comment ",error);
                    scope.showAlert("New Comment","error","failed");
                };

            };


            //edit assignee
            scope.isEditAssignee = false;
            scope.editAssignee = function () {
                scope.isEditAssignee = !scope.isEditAssignee;
            };

            scope.changeAssignee = function () {

                var assigneeObj={};
                if(typeof(scope.newAssignee)=='string')
                {
                    assigneeObj=JSON.parse(scope.newAssignee);
                }
                else
                {
                    assigneeObj=scope.newAssignee;
                }


                if(assigneeObj)
                {
                    ticketService.AssignUserToTicket(scope.ticket._id,assigneeObj._id).then(function (response) {
                        if(response.data.IsSuccess)
                        {
                            scope.showAlert("Ticket assigning","success","Ticket assignee changed successfully");
                            scope.ticket.assignee=assigneeObj;

                            scope.isEditAssignee = false;
                        }
                        else
                        {
                            scope.showAlert("Ticket assigning","error","Ticket assignee changing failed");
                        }
                    }), function (error) {
                        scope.showAlert("Ticket assigning","error","Ticket assignee changing failed");
                    }
                }
                else
                {
                    scope.showAlert("Ticket assigning","error","Invalid assignee details provided");
                }



            };

            scope.assignToMe = function () {
                scope.newAssignee=myProfileDataParser.myProfile;
                scope.changeAssignee();
            };

            scope.loadTickectNextLevel = function () {
                ticketService.getTicketNextLevel(scope.ticket.type,scope.ticket.status).then(function (response) {
                    if(response.data.IsSuccess)
                    {

                    }
                }), function (error) {

                }
            }




        }
    }
});