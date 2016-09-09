/**
 * Created by Rajinda on 9/8/2016.
 */

agentApp.factory("ivrService", function ($http, baseUrls,authService) {


    var getIvrDetailsByEngagementId = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.ivrUrl+""+id,
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
        GetIvrDetailsByEngagementId: getIvrDetailsByEngagementId
    }
});

