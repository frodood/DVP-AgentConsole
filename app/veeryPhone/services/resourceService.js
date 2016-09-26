/**
 * Created by Veery Team on 12/31/2015.
 */

var resourceModule = angular.module("veerySoftPhoneModule", []);
resourceModule.factory("resourceService", function ($http, $log, baseUrls, dataParser, authService) {
//Format is Authorization: Bearer [token]
    var breakRequest = function (resourceId, reason) {
        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId + "/state/NotAvailable/reason/" + reason,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var endBreakRequest = function (resourceId, reason) {

        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId + "/state/Available/reason/EndBreak",
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };
//{"ResourceId":resourceId,"HandlingTypes":["CALL"]}
    var registerWithArds = function (resourceId,contact) {

        return $http({
            method: 'post',
            url: baseUrls.ardsliteserviceUrl,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            },
            data: {
                "ResourceId": resourceId,
                "HandlingTypes": [{
                    "Type": "CALL",
                    "Contact": contact
                }]
            }

        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    var unregisterWithArds = function (resourceId) {

        return $http({
            method: 'delete',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            },
            data: {"ResourceId": resourceId, "HandlingTypes": ["CALL"]}
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    var getContactVeeryFormat = function (userName) {

        return $http({
            method: 'get',
            url: baseUrls.userServiceBaseUrl + "Myprofile/veeryformat/veeryaccount",
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data;
        });

    };

    var getOnlineAgentList = function () {

        return $http({
            method: 'get',
            url: baseUrls.ardsMonitoringServiceUrl + "/resources",
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response.data;
        });

    };

    return {
        BreakRequest: breakRequest,
        EndBreakRequest: endBreakRequest,
        RegisterWithArds: registerWithArds,
        UnregisterWithArds: unregisterWithArds,
        GetContactVeeryFormat: getContactVeeryFormat,
        getOnlineAgentList: getOnlineAgentList
    }

});

resourceModule.factory('dataParser', function(){
    var userProfile = {};

    return userProfile;
});
