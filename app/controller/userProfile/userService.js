/**
 * Created by Rajinda on 9/9/2016.
 */


agentApp.factory("userService", function ($http, baseUrls,authService) {


    var getExternalUserProfileByContact = function (category,contact) {
        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"ExternalUser/ByContact/"+category+"/"+contact,
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

    var loadUser = function ($query) {

        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"Users",
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


    return {
        GetExternalUserProfileByContact:getExternalUserProfileByContact,
        LoadUser:loadUser
    }
});

