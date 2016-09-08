/**
 * Created by Rajinda on 9/8/2016.
 */

agentApp.factory("ivrService", function ($http, baseUrls,authService) {


    var getIvrDetailsByEngagementId = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.ivrUrl+""+id,
            headers: {
                'authorization': authService.GetToken(),
                'companyinfo':'1:103'
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

