/**
 * Created by Veery Team on 9/8/2016.
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

    // .........................  get all tickets with status .................................

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

    var getClosedTickets= function (page) {
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

    // .........................  get My tickets with status .................................

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

    // .........................  get My group tickets with status .................................

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

    var mapFormSubmissionToTicket= function (formSubId, ticketId) {
        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+'Ticket/' + ticketId + '/FormSubmission',
            headers: {
                'authorization':authToken
            },
            data: JSON.stringify({form_submission: formSubId})
        }).then(function(response)
        {
            return response.data;
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

    var updateTicketByReference = function (cusReference,postData) {
        return $http({
            method: 'put',
            url: baseUrls.ticketUrl+"TicketByReference/"+cusReference+"/Comment",
            headers: {
                'authorization':authService.GetToken()
            },
            data:postData
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return false;
            }
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

    var getTicketCountByView = function (id) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"TicketView/"+id+"/TicketCount",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return "*";
            }
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

    var pickTicket = function (ticketId) {

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketId+"/pick",
            headers: {
                'authorization':authService.GetToken()
            }
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
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

    var AssignUserGroupToTicket = function (ticketId,groupId) {

        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketId+"/AssignGroup/"+groupId,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });

    };

    var getTicketNextLevel= function (ticketType,currentStatus) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"/TicketStatusFlow/NextAvailableStatus/"+ticketType+"/"+currentStatus,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };

    var updateTicketStatus = function (ticketID,newStatus) {
        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"Ticket/"+ticketID+"/Status",
            headers: {
                'authorization':authToken
            },
            data:newStatus
        }).then(function(response)
        {
            return response;
        });
    };

    var AddSubTicket = function (ticketID,subTicket) {
        var authToken = authService.GetToken();

        return $http({
            method: 'POST',
            url: baseUrls.ticketUrl+"Ticket/"+ticketID+"/SubTicket",
            headers: {
                'authorization':authToken
            },
            data:subTicket
        }).then(function(response)
        {
            return response;
        });
    };


    var getExternalUserRecentTickets = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.ticketUrl+"ExternalUserRecentTickets/"+id,
            headers: {
                'authorization':authService.GetToken()
            }
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getFormsForCompany = function () {

        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"FormProfile",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response.data;
        });

    };

    var getFormSubmissionByRef = function (ref) {

        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"FormSubmission/" + ref,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response.data;
        });

    };

    var updateFormSubmissionData = function (refId, updateValues) {

        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"FormSubmission/" + refId,
            headers: {
                'authorization':authToken
            },
            data: JSON.stringify(updateValues)
        }).then(function(response)
        {
            return response.data;
        });

    };

    var createFormSubmissionData = function (saveValues) {

        var authToken = authService.GetToken();

        return $http({
            method: 'POST',
            url: baseUrls.ticketUrl+"FormSubmission",
            headers: {
                'authorization':authToken
            },
            data: JSON.stringify(saveValues)
        }).then(function(response)
        {
            return response.data;
        });

    };

    var createTimer = function (ticketId) {
        var reqData = {ticket: ticketId};
        return $http({
            method: 'Post',
            url: baseUrls.ticketUrl+"Timer",
            headers: {
                'authorization': authService.GetToken()
            },
            data:reqData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var startTimer = function () {
        var reqBody = {note: ""};
        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"MyTimer/start",
            headers: {
                'authorization': authService.GetToken()
            },
            data: reqBody
        }).then(function (response) {
            if(response) {
                return response.data.IsSuccess;
            }else{
                return undefined;
            }
        });
    };

    var pauseTimer = function () {
        var reqBody = {note: ""};
        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"MyTimer/pause",
            headers: {
                'authorization': authService.GetToken()
            },
            data:reqBody
        }).then(function (response) {
            if(response) {
                return response.data.IsSuccess;
            }else{
                return undefined;
            }
        });
    };

    var stopTimer = function () {
        var reqBody = {note: ""};
        return $http({
            method: 'PUT',
            url: baseUrls.ticketUrl+"MyTimer/stop",
            headers: {
                'authorization': authService.GetToken()
            },
            data:reqBody
        }).then(function (response) {
            if(response) {
                return response.data.IsSuccess;
            }else{
                return undefined;
            }
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
        UpdateTicketByReference:updateTicketByReference,
        CreateTicketView:createTicketView,
        GetTicketView:getTicketView,
        GetTicketCountByView:getTicketCountByView,
        GetTicketViews:getTicketViews,
        GetTicketsByView:getTicketsByView,
        AddNewCommentToTicket:AddNewCommentToTicket,
        AssignUserGroupToTicket: AssignUserGroupToTicket,
        getTicketNextLevel:getTicketNextLevel,
        createTimer: createTimer,
        startTimer: startTimer,
        pauseTimer: pauseTimer,
        stopTimer: stopTimer,
        getFormsForCompany: getFormsForCompany,
        AssignUserToTicket:AssignUserToTicket,
        updateTicketStatus:updateTicketStatus,
        updateFormSubmissionData: updateFormSubmissionData,
        AddSubTicket:AddSubTicket,
        GetExternalUserRecentTickets:getExternalUserRecentTickets,
        createFormSubmissionData: createFormSubmissionData,
        mapFormSubmissionToTicket: mapFormSubmissionToTicket,
        getFormSubmissionByRef: getFormSubmissionByRef,
        PickTicket:pickTicket,

    }
});

