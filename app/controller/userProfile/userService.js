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
    var getUserList= function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"Users",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var getUserGroupList= function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"UserGroups",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };
    var searchExternalUsers= function (searchText) {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"ExternalUser/Search/"+searchText,
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response.data;
        });
    };

    var getMyProfileDetails= function () {
        var authToken = authService.GetToken();

        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"Myprofile",
            headers: {
                'authorization':authToken
            }
        }).then(function(response)
        {
            return response;
        });
    };


    return {
        GetExternalUserProfileByContact:getExternalUserProfileByContact,
        LoadUser:loadUser,
        getUserList:getUserList,
        getUserGroupList:getUserGroupList,
        searchExternalUsers:searchExternalUsers,
        getMyProfileDetails:getMyProfileDetails

    }
});

