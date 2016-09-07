/**
 * Created by Rajinda on 9/5/2016.
 */

agentApp.factory("engagementService", function ($http, baseUrls,authService) {


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
        return $http({
            method: 'get',
            params: ids,
            url: baseUrls.engagementUrl+"Engagement/"+engagementId+"/EngagementSessions",
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

    return {
        GetEngagementIdsByProfile: getEngagementIdsByProfile,
        GetEngagementSession:getEngagementSession,
        GetEngagementSessions:getEngagementSessions
    }
});

