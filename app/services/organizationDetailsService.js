/**
 * Created by Pawan on 7/19/2017.
 */
agentApp.factory("orgDetailService", function ($http, baseUrls, authService) {


    var getOrganizationDetails = function () {
        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl +"Mylanguages"

        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };
    var updateUserMeta = function (user,usermeta) {
        return $http({
            method: 'PUT',
            url: baseUrls.userServiceBaseUrl +"Users/"+user+"/UserMeta",
            data:usermeta

        }).then(function(response)
        {
            if (response.data && response.data.IsSuccess) {
                return response.data.IsSuccess;
            } else {
                return false;
            }
        });
    };




    return {
        getOrganizationDetails: getOrganizationDetails,
        updateUserMeta:updateUserMeta

    }
});