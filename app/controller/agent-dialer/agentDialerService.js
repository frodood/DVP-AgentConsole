/**
 * Created by Waruna on 5/22/2017.
 */

agentApp.factory('agentDialerService', function ($http, baseUrls) {

    var getAllContacts = function (resourceId,batchName,pageNo) {
        return $http({
            method: 'GET',
            url: baseUrls.agentDialerUrl + "Resource/"+resourceId+"/Numbers",
            params: {
                StartDate: new Date().toISOString(),
                pageNo: pageNo,
                rowCount: 20,
                BatchName:batchName
            }
        }).then(function (response) {
            if (response.data && response.data.IsSuccess)  {
                return response.data.Result;
            } else {
                return [];
            }
        });
    };



    var updateContact = function (obj) {
        return $http({
            method: 'PUT',
            data: obj,
            url: baseUrls.agentDialerUrl + "Number/"+obj.AgentDialNumberId+"/Status"
        }).then(function (response) {
            return !!(response.data && response.data.IsSuccess);
        });
    };

    var updateContactStatus = function (obj) {
        return $http({
            method: 'PUT',
            data: obj,
            url: baseUrls.agentDialerUrl + "Number/"+obj.AgentDialNumberId+"/OnlyStatus"
        }).then(function (response) {
            return !!(response.data && response.data.IsSuccess);
        });
    };

    var headerDetails = function (resid) {
        var data = {};
        data.ResourceId = resid;
        return $http({
            method: 'GET',
            url:  baseUrls.agentDialerUrl+"HeaderDetails",
            params:data
        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    return {
        GetAllContacts: getAllContacts,
        UpdateContact:updateContact,
        UpdateContactStatus:updateContactStatus,
        HeaderDetails:headerDetails
    }
});