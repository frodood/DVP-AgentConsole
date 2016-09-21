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

            //ticket dynamic forms//

            scope.newAssignee={};
            scope.isOverDue=false;
            scope.newComment="";

            scope.schema = {
                type: "object",
                properties: {
                    name: {type: "string", minLength: 2, title: "Name", description: "Name or alias"},
                    title: {
                        type: "string",
                        enum: ['dr', 'jr', 'sir', 'mrs', 'mr', 'NaN', 'dj']
                    }
                }
            };

            scope.form = [
                "*",
                {
                    type: "submit",
                    title: "Save"
                }
            ];

            scope.model = {
                name: 'ffdfdfd',
                title: 'sir'
            };

            //ticket dynamic forms//


            scope.subTickets = [];
            scope.relTickets = [];

            scope.ticketID = JSON.parse(scope.ticketDetails).notificationData._id;

            scope.userList=myProfileDataParser.userList;

            scope.loadTicketSummary = function (ticketID) {

                ticketService.getTicket(ticketID).then(function (response) {

                    if (response.data.IsSuccess) {
                        scope.ticket = response.data.Result;
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