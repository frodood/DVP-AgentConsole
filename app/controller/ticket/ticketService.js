/**
 * Created by Rajinda on 9/8/2016.
 */

agentApp.factory("ticketService", function ($http, baseUrls,authService) {


    var getAllTicketsByRequester = function (requester,page) {
        return $http({
            method: 'get',
            url: baseUrls.ticketUrl+"Tickets/Requester/"+requester+"/5/"+page,
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var saveTicket = function (ticket) {
        return $http({
            method: 'Post',
            url: baseUrls.ticketUrl+"Ticket",
            headers: {
                'authorization': authService.GetToken()
            },
            data:ticket
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getResourceIss = function () {
        return authService.GetResourceIss();
    };
    var getNewTickets = function (page) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/10/"+page+"?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getOpenTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/10/"+page+"?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var  getClosedTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/6/"+page+"?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyNewTickets= function (page) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/10/"+page+"?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyOpenTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/10/"+page+"?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyClosedTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/6/"+page+"?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };

    var getMyGroupTickets= function (page) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/10/"+page+"?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyGroupOpenTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/10/"+page+"?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyGroupClosedTickets= function (page) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/6/"+page+"?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getTicket = function (ticketID) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Ticket/"+ticketID+"/Details",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var updateTicket = function (ticketID,ticketObject) {
        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketID,
            headers: {
                'authorization':authToken
            },
            data:ticketObject
        }).then(function(response)
        {
            return response;
        });
    };
    var createTicketView = function (ticketView) {
        var authToken = authService.GetToken();

        return $http({
            method: 'POST',
            url: baseUrls.ticketUrl+"TicketView",
            headers: {
                'authorization':authToken
            },
            data:ticketView
        }).then(function(response)
        {
            return response;
        });
    };

    var getTicketView = function (id) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"TicketView/"+id,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };

    var getTicketViews = function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"TicketViews",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response.data.Result;
        });
    };

    var getTicketsByView = function (id) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"TicketView/"+id+"/Tickets",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response.data.Result;
        });
    };

    var AddNewCommentToTicket = function (ticketId,commentObject) {

        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketId+"/Comment",
            headers: {
                'authorization':authToken
            },
            data:commentObject
        }).then(function(response)
        {
            return response;
        });

    };
    var AssignUserToTicket = function (ticketId,userId) {

        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketId+"/AssignUser/"+userId,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });

    };



    return {
        GetAllTicketsByRequester: getAllTicketsByRequester,
        SaveTicket:saveTicket,
        GetResourceIss:getResourceIss,
        getNewTickets:getNewTickets,
        getOpenTickets:getOpenTickets,
        getClosedTickets:getClosedTickets,
        getMyNewTickets:getMyNewTickets,
        getMyOpenTickets:getMyOpenTickets,
        getMyClosedTickets:getMyClosedTickets,
        getMyGroupTickets:getMyGroupTickets,
        getMyGroupOpenTickets:getMyGroupOpenTickets,
        getMyGroupClosedTickets:getMyGroupClosedTickets,
        getTicket:getTicket,
        updateTicket:updateTicket,
        CreateTicketView:createTicketView,
        GetTicketView:getTicketView,
        GetTicketViews:getTicketViews,
        GetTicketsByView:getTicketsByView,
        AddNewCommentToTicket:AddNewCommentToTicket,
        AssignUserToTicket:AssignUserToTicket
    }
});

