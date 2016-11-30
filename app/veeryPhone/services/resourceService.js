/**
 * Created by Veery Team on 12/31/2015.
 */

var resourceModule = angular.module("veerySoftPhoneModule", []);
resourceModule.factory("resourceService", function ($http, $log, baseUrls, dataParser, authService) {
//Format is Authorization: Bearer [token]
    var breakRequest = function (resourceId, reason) {
        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId + "/state/NotAvailable/reason/" + reason
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var endBreakRequest = function (resourceId, reason) {

        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId + "/state/Available/reason/EndBreak"
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };
//{"ResourceId":resourceId,"HandlingTypes":["CALL"]}
    var registerWithArds = function (resourceId, contact) {

        return $http({
            method: 'post',
            url: baseUrls.ardsliteserviceUrl + "resource",
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
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId,
            data: {"ResourceId": resourceId, "HandlingTypes": ["CALL"]}
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    var getContactVeeryFormat = function () {

        return $http({
            method: 'get',
            url: baseUrls.userServiceBaseUrl + "Myprofile/veeryformat/veeryaccount"
        }).then(function (response) {
            return response.data;
        });

    };

    var getOnlineAgentList = function () {
        return $http({
            method: 'get',
            url: baseUrls.ardsMonitoringServiceUrl + "/resources"
        }).then(function (response) {
            return response.data;
        });

    };

    var changeRegisterStatus = function (resourceId, type, contactName) {
        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "resource/share",
            data: {
                "ResourceId": resourceId,
                "HandlingTypes": [{
                    "Type": type,
                    "Contact": contactName
                }]
            }
        }).then(function (response) {
            return response.data;
        });
    };

    var getResourceState = function (resourceId) {
        return $http({
            method: 'get',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId + "/state"
        }).then(function (response) {
            return response.data;
        });
    };

    var getResource = function (resourceId) {
        return $http({
            method: 'get',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId
        }).then(function (response) {
            return response.data;
        });
    };

    var getAcwTime = function () {
        return $http({
            method: 'get',
            url: baseUrls.ardsliteserviceUrl + "requestmeta/CALLSERVER/CALL"
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var freezeAcw = function (callSessionId, endFreeze) {
        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "resource/" + authService.GetResourceId() + "/concurrencyslot/session/" + callSessionId,
            data: {
                "RequestType": "CALL",
                "State": endFreeze ? "Freeze" : "EndFreeze",
                "Reason": "",
                "OtherInfo": ""
            }
        }).then(function (response) {
            return response.data.Result;
        });
    };
    var mapResourceToVeery = function (publicIdentity) {
        /*dynamic data = new JObject();
         data.SipURI = profile.publicIdentity.Replace("sip:", "");
         data.ResourceId = profile.id;*/
        return $http({
            method: 'post',
            url: baseUrls.monitorrestapi + "MonitorRestAPI/BindResourceToVeeryAccount",
            data: {
                "SipURI": publicIdentity.replace("sip:", ""),
                "ResourceId": authService.GetResourceId()
            }
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var sipUserPassword = function (userName) {
        return $http({
            method: 'get',
            url: baseUrls.sipuserUrl + "SipUser/User/" + userName + "/Password"
        }).then(function (response) {
            return response.data.Result;
        });
    };

    var getResourceTasks = function (resourceId) {
        return $http({
            method: 'get',
            url: baseUrls.resourceService + "Resource/" + resourceId + "/Tasks"
        }).then(function (response) {
            return response.data;
        });
    };

    var getCurrentRegisterTask = function (resourceId) {
        return $http({
            method: 'get',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId
        }).then(function (response) {
            return response.data;
        });
    };

    var removeSharing = function (resourceId, task) {
        return $http({
            method: 'DELETE',
            url: baseUrls.ardsliteserviceUrl + "resource/" + resourceId + "/removesSharing/" + task
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
        getOnlineAgentList: getOnlineAgentList,
        ChangeRegisterStatus: changeRegisterStatus,
        GetResourceState: getResourceState,
        GetResource: getResource,
        GetAcwTime: getAcwTime,
        FreezeAcw: freezeAcw,
        MapResourceToVeery: mapResourceToVeery,
        SipUserPassword: sipUserPassword,
        GetResourceTasks: getResourceTasks,
        GetCurrentRegisterTask: getCurrentRegisterTask,
        RemoveSharing: removeSharing
    }

});

resourceModule.factory('dataParser', function () {
    var userProfile = {};

    return userProfile;
});
