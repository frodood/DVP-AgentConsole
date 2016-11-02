/**
 * Created by Veery Team on 9/5/2016.
 */

agentApp.factory("engagementService", function ($http, baseUrls,authService) {


    var getEngagementIdsByProfile = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.engagementUrl+"EngagementByProfile/"+id
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
            url: baseUrls.engagementUrl+"Engagement/"+id
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
            url: baseUrls.engagementUrl+"Engagement/"+engagementId+"/EngagementSessions"+q
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getEngagementSessionNote = function (engagementId) {

        return $http({
            method: 'get',
           // params: ids,
            url: baseUrls.engagementUrl+"EngagementSession/"+engagementId+"/Note"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var appendNoteToEngagementSession = function (engagementId,note) {

        return $http({
            method: 'post',
            data: note,
            url: baseUrls.engagementUrl+"EngagementSession/"+engagementId+"/Note"
        }).then(function (response) {
            if (response.data) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };

    var createEngagementSession = function (userId, engagementSession) {

        return $http({
            method: 'post',
            data: engagementSession,
            url: baseUrls.engagementUrl+"Engagement/"+userId+"/EngagementSession"
        }).then(function (response) {
            if (response.data) {
                return response.data;
            } else {
                return undefined;
            }
        });
    };

    var engagementCount = function (userId) {

        return $http({
            method: 'get',
            url: baseUrls.engagementUrl+"EngagementSessionCount/"+userId
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
        GetEngagementSessions:getEngagementSessions,
        GetEngagementSessionNote:getEngagementSessionNote,
        AppendNoteToEngagementSession:appendNoteToEngagementSession,
        createEngagementSession: createEngagementSession,
        EngagementCount:engagementCount
    }
});

