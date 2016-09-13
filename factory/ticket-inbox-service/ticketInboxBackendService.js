

agentApp.factory('ticketInboxService', function ($http, authService,baseUrls)
{
    return {

        getNewTickets: function () {
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
        },
        getOpenTickets: function (recordCount,pageCount) {
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
        },
        getClosedTickets: function (recordCount,pageCount) {
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
        },
        getMyNewTickets: function (recordCount,pageCount) {
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
        },
        getMyOpenTickets: function (recordCount,pageCount) {
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
        },
        getMyClosedTickets: function (recordCount,pageCount) {
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
        },

        getMyGroupTickets: function () {
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
        },
        getMyGroupOpenTickets: function () {
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
        },
        getMyGroupClosedTickets: function () {
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


    }
});