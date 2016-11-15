/**
 * Created by team verry on 9/29/2016.
 */


agentApp.factory("dashboradService", function ($http, baseUrls, authService, $state) {

    var getTotalTicketCount = function (status) {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/" + status + "/user_" + authService.GetResourceIss() + "/*"
        }).then(function (response) {
            if (response.status === 200) {
                return response.data;
            } else {
                return 0;
            }
        });

    };

    var getCreatedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/NewTicketByUser/30"
        }).then(function (response) {
            if (response.data && response.data.length > 0 && response.data[0].datapoints) {
                return response.data[0].datapoints;
            } else {

                return {};
            }
        });

    };

    var getResolvedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedTicketByUser/30"
        }).then(function (response) {
            if (response.data && response.data.length > 0 && response.data[0].datapoints) {
                return response.data[0].datapoints;
            } else {

                return {};
            }
        });
    };

    var getDeferenceResolvedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedVsOpenTicketByUser/30"
        }).then(function (response) {
            if (response.data && response.data.length > 0 && response.data[0].datapoints) {
                return response.data[0].datapoints;
            } else {

                return {};
            }
        });

    };

    var productivityByResourceId = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.resourceService + id + "/Productivity"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getQueueDetails = function () {
        return $http({
            method: 'get',
            url: baseUrls.dashBordUrl + "DashboardEvent/QueueDetails"
        }).then(function (response) {
            return response.data
        });
    };

    var getNewTicketCountViaChenal = function (chenal) {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/NEWTICKET/via_" + chenal + "/*"
        }).then(function (response) {
            if (response.data) {
                return response.data;
            } else {
                return 0;
            }
        });

    };

    return {
        ProductivityByResourceId: productivityByResourceId,
        GetCreatedTicketSeries: getCreatedTicketSeries,
        GetResolvedTicketSeries: getResolvedTicketSeries,
        GetTotalTicketCount: getTotalTicketCount,
        GetDeferenceResolvedTicketSeries: getDeferenceResolvedTicketSeries,
        GetQueueDetails: getQueueDetails
    }
});

