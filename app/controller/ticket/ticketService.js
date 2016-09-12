/**
 * Created by Rajinda on 9/8/2016.
 */

agentApp.factory("ticketService", function ($http, baseUrls,authService) {


    var getEngagementIdsByProfile = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.engagementUrl+"EngagementByProfile/"+id,
            headers: {
                'authorization': authService.GetToken(),
                'companyinfo':'1:103'
            }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getEngagementSession = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.engagementUrl+"Engagement/"+id,
            headers: {
                'authorization':authService.GetToken(),'companyinfo':'1:103'
            }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getEngagementSessions = function (engagementId, ids) {
        var q='?';
        angular.forEach(ids,function(item){
            q = q + 'session='+item+'&';
        });

        return $http({
            method: 'get',
            // params: ids,
            url: baseUrls.engagementUrl+"Engagement/"+engagementId+"/EngagementSessions"+q,
            headers: {
                'authorization':authService.GetToken(),'companyinfo':'1:103'
            }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
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
        GetEngagementIdsByProfile: getEngagementIdsByProfile,
        GetEngagementSession:getEngagementSession,
        GetEngagementSessions:getEngagementSessions,
        getNewTickets:getNewTickets,
        getOpenTickets:getOpenTickets,
        getClosedTickets:getClosedTickets,
        getMyNewTickets:getMyNewTickets,
        getMyOpenTickets:getMyOpenTickets,
        getMyClosedTickets:getMyClosedTickets,
        getMyGroupTickets:getMyGroupTickets,
        getMyGroupOpenTickets:getMyGroupTickets,
        getMyGroupClosedTickets:getMyGroupTickets
    }
});

