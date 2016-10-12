/**
 * Created by Veery Team on 9/9/2016.
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

    var mapFormSubmissionToProfile= function (formSubId, profileId) {
        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.userServiceBaseUrl+'ExternalUser/' + profileId + '/FormSubmission',
            headers: {
                'authorization':authToken
            },
            data: JSON.stringify({form_submission: formSubId})
        }).then(function(response)
        {
            return response.data;
        });
    };

    var createExternalUser = function (profile) {
        return $http({
            method: 'Post',
            url: baseUrls.userServiceBaseUrl+"ExternalUser",
            headers: {
                'authorization': authService.GetToken()
            },
            data:profile
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var updateExternalUser = function (profile) {
        return $http({
            method: 'put',
            url: baseUrls.userServiceBaseUrl+"ExternalUser/"+profile._id,
            headers: {
                'authorization': authService.GetToken()
            },
            data:profile
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var UpdateExternalUserProfileContact= function (profileId, contactInfo) {
        var authToken = authService.GetToken();

        return $http({
            method: 'PUT',
            url: baseUrls.userServiceBaseUrl+'ExternalUser/' + profileId + '/Contact/'+contactInfo.contact,
            headers: {
                'authorization':authToken
            },
            data: JSON.stringify(contactInfo)
        }).then(function(response)
        {
            return response.data;
        });
    };

    var getExternalUserProfileByField = function (field,value) {
        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"ExternalUser/ByField/"+field+"/"+value,
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response.data;
        });
    };

    var getExternalUserProfileBySsn = function (ssn) {
        return $http({
            method: 'GET',
            url: baseUrls.userServiceBaseUrl+"ExternalUser/BySSN/"+ssn,
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response.data;
        });
    };


    return {
        GetExternalUserProfileByContact:getExternalUserProfileByContact,
        LoadUser:loadUser,
        getUserList:getUserList,
        getUserGroupList:getUserGroupList,
        searchExternalUsers:searchExternalUsers,
        getMyProfileDetails:getMyProfileDetails,
        mapFormSubmissionToProfile:mapFormSubmissionToProfile,
        CreateExternalUser:createExternalUser,
        UpdateExternalUser:updateExternalUser,
        UpdateExternalUserProfileContact:UpdateExternalUserProfileContact,
        getExternalUserProfileByField:getExternalUserProfileByField,
        getExternalUserProfileBySsn:getExternalUserProfileBySsn
    }
});

