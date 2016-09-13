/**
 * Created by Rajinda on 9/8/2016.
 */

agentApp.factory("ticketService", function ($http, baseUrls,authService) {


    var getAllTicketsByRequester = function (requester,page) {
        return $http({
            method: 'get',
            url: baseUrls.ticketUrl+"Tickets/Requester/"+requester+"/10/"+page,
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
    var getNewTickets = function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/50/1?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getOpenTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/50/1?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var  getClosedTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tickets/50/1?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyNewTickets= function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/50/1?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyOpenTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/50/1?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyClosedTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyTickets/50/1?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };

    var getMyGroupTickets= function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/50/1?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyGroupOpenTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/50/1?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyGroupClosedTickets= function () {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"MyGroupTickets/50/1?status=parked&status=solved&status=closed",
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
            url: baseUrls.ticketUrl+"Ticket/"+ticketID,
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
        GetAllTicketsByRequester: getAllTicketsByRequester,
        getNewTickets:getNewTickets,
        getOpenTickets:getOpenTickets,
        getClosedTickets:getClosedTickets,
        getMyNewTickets:getMyNewTickets,
        getMyOpenTickets:getMyOpenTickets,
        getMyClosedTickets:getMyClosedTickets,
        getMyGroupTickets:getMyGroupTickets,
        getMyGroupOpenTickets:getMyGroupOpenTickets,
        getMyGroupClosedTickets:getMyGroupClosedTickets,
        getTicket:getTicket
    }
});

