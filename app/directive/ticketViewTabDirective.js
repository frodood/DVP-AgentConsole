/**
 * Created by Pawan on 9/9/2016.
 */

agentApp.directive("ticketTabView", function (moment,ticketService,$rootScope) {
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

            scope.ticket=JSON.parse(scope.ticketDetails).notificationData;
            scope.x="dbafdsfsbmfsd";


            console.log("ticket ",scope.ticket);


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



            scope.pickSubTicketDetails = function (subTicketArray) {

                for(var i=0;i<subTicketArray.length;i++)
                {
                    ticketService.getTicket(subTicketArray[i]).then(function (response) {
                        if(response.data.IsSuccess)
                        {
                            scope.subTickets.push(response.data.Result);
                            console.log("Ticket ",scope.subTickets);
                        }
                        else
                        {
                            console.log("No ticket found");
                        }

                    }), function (error) {
                        console.log("Error found searching ticket  ",error);
                    }
                }

            };

            scope.pickRelatedTicketDetails = function (relTicketArray) {

                for(var i=0;i<relTicketArray.length;i++)
                {
                    ticketService.getTicket(relTicketArray[i]).then(function (response) {
                        if(response.data.IsSuccess)
                        {
                            scope.relTickets.push(response.data.Result);
                            console.log("Ticket ",scope.relTickets);
                        }
                        else
                        {
                            console.log("No ticket found");
                        }

                    }), function (error) {
                        console.log("Error found searching ticket  ",error);
                    }
                }

            };


            scope.pickSubTicketDetails(scope.ticket.sub_tickets);
            scope.pickRelatedTicketDetails(scope.ticket.related_tickets);

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


            }
        }
    }
});