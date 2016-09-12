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
            url: baseUrls.liteticket+"Tickets/50/1?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getOpenTickets= function (recordCount,pageCount) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.liteticket+"Tickets/50/1?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var  getClosedTickets= function (recordCount,pageCount) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.liteticket+"Tickets/50/1?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyNewTickets= function (recordCount,pageCount) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.liteticket+"MyTickets/50/1?status=new",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyOpenTickets= function (recordCount,pageCount) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.liteticket+"MyTickets/50/1?status=open&status=progressings",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getMyClosedTickets= function (recordCount,pageCount) {
        var authToken = authService.GetToken();
        return $http({
            method: 'GET',
            url: baseUrls.liteticket+"MyTickets/50/1?status=parked&status=solved&status=closed",
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
            url: baseUrls.liteticket+"MyGroupTickets/50/1?status=new",
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
            url: baseUrls.liteticket+"MyGroupTickets/50/1?status=open&status=progressings",
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
            url: baseUrls.liteticket+"MyGroupTickets/50/1?status=parked&status=solved&status=closed",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    }

    return {
        GetAllTicketsByRequester: getAllTicketsByRequester,
        SaveTicket:saveTicket,
        GetResourceIss:getResourceIss
        GetAllTicketsByRequester: getAllTicketsByRequester,
        getNewTickets:getNewTickets,
        getOpenTickets:getOpenTickets,
        getClosedTickets:getClosedTickets,
        getMyNewTickets:getMyNewTickets,
        getMyOpenTickets:getMyOpenTickets,
        getMyClosedTickets:getMyClosedTickets,
        getMyGroupTickets:getMyGroupTickets,
        getMyGroupOpenTickets:getMyGroupOpenTickets,
        getMyGroupClosedTickets:getMyGroupClosedTickets
    }
});

