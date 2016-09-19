/**
 * Created by Pawan on 9/9/2016.
 */

agentApp.directive("ticketTabView", function (moment,ticketService,$rootScope,authService) {
    return {
        restrict: "EA",
        scope:{
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
            scope.subTickets=[];
            scope.relTickets=[];

            scope.ticketID=JSON.parse(scope.ticketDetails).notificationData._id;



            scope.loadTicketSummary = function (ticketID) {

                ticketService.getTicket(ticketID).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        scope.ticket=response.data.Result;
                        if(scope.ticket.created_at)
                        {
                            scope.ticket.created_at=moment(scope.ticket.created_at).local().format("YYYY-MM-DD HH:mm:ss");
                        }
                        if(scope.ticket.due_at)
                        {
                            scope.ticket.due_at=moment(scope.ticket.due_at).local().format("YYYY-MM-DD HH:mm:ss");
                        }
                        else
                        {
                            scope.ticket.due_at="Not specified";
                        }

                        scope.ticket.updated_at=moment(scope.ticket.updated_at).local().format("YYYY-MM-DD HH:mm:ss");

                        scope.relTickets= scope.ticket.related_tickets;
                        scope.subTickets=scope.ticket.sub_tickets;

                        console.log("ticket ",scope.ticket);
                    }
                    else
                    {
                        console.log("Error in picking ticket");
                    }

                }), function (error)
                {
                    console.log("Error in picking ticket ",error);
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

            scope.editTicket=false;
            scope.editTicketMode = function () {
                scope.editTicket=!scope.editTicket;
            }



            scope.loadTicketView = function (ticket) {
                $rootScope.$emit('newTicketTab',ticket);
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
            scope.editTicket = false;

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
                scope.editTicket = !scope.editTicket;
                scope.editTicket=JSON.parse(scope.ticketDetails).notificationData;
            };

            scope.updateTicketDetails = function () {
                ticketService.updateTicket(scope.ticket._id,scope.editTicket).then(function (response) {

                    if(response.data.IsSuccess)
                    {
                        scope.ticket=scope.editTicket;
                        scope.showAlert("Updated","success","Ticket updated successfully");
                        scope.editTicket=false;


                    }
                    else
                    {
                        scope.showAlert("Error","error","Ticket updation failed");
                        console.log("Error in updating ",response.data.Exception);
                    }

                }), function (error) {
                    scope.showAlert("Error","success","Ticket updation failed");
                    console.log("Error in updating ",error);
                }
            };

            scope.closeTicket = function () {
                $rootScope.$emit('closeTab', scope.ticket._id);

            };

            scope.addComment = function (comment) {

                var commentObj =
                {
                    body:comment,
                    body_type:"text",
                    type:"web",
                    public: true,
                    channel_from:authService.GetResourceIss()

                }
                ticketService.AddNewCommentToTicket(scope.ticket._id, commentObj).then(function (response) {
                    if(response.data.IsSuccess)
                    {

                    }
                    else
                    {

                    }

                }), then(function (error) {

                });

            }
        }
    }
});