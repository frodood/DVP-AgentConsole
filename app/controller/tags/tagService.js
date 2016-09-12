/**
 * Created by Rajinda on 9/12/2016.
 */

agentApp.factory("tagService", function ($http, baseUrls,authService) {


    var getAllTags = function () {
        return $http({
            method: 'GET',
            url: baseUrls.ticketUrl+"Tags",
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
        GetAllTags: getAllTags
    }
});

