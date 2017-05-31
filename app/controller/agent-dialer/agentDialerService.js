/**
 * Created by Waruna on 5/22/2017.
 */

agentApp.factory('agentDialerService', function ($http, baseUrls) {

    var getAllContacts = function (resourceId,pageNo) {
        return $http({
            method: 'GET',
            url: baseUrls.agentDialerUrl + "Resource/"+resourceId+"/Numbers",
            params: {
                StartDate: new Date(),
                pageNo: pageNo,
                rowCount: 20
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

    return {
        GetAllContacts: getAllContacts,
        UpdateContact:updateContact
    }
});