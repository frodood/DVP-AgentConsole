

agentApp.factory('userBackendService', function ($http, authService,baseUrls)
{
    return {

        getUserList: function () {
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
        },
        getUserGroupList: function () {
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
        },
        searchExternalUsers: function (searchText) {
            var authToken = authService.GetToken();

            return $http({
                method: 'GET',
                url: baseUrls.userServiceBaseUrl+"ExternalUser/Search/"+searchText,
                headers: {
                    'authorization':authToken
                }
            }).then(function(response)
            {
                return response;
            });
        }

    }
});
