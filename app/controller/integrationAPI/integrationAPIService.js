/**
 * Created by dinusha on 11/17/2016.
 */

(function () {

    var integrationAPIService = function ($http, baseUrls) {

        var getIntegrationURLMetaData = function (refName) {

            var url = baseUrls.integrationapi + 'IntegrationInfo/Reference/' + refName;

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getIntegrationAPIData = function (id, inputObject) {

            var url = baseUrls.integrationapi + 'CallAPI/' + id;

            return $http({
                method: 'POST',
                url: url,
                data: JSON.stringify(inputObject)
            }).then(function (resp) {
                return resp.data;
            })
        };

        return {
            getIntegrationURLMetaData: getIntegrationURLMetaData,
            getIntegrationAPIData: getIntegrationAPIData
        };
    };

    var module = angular.module("veeryAgentApp");
    module.factory("integrationAPIService", integrationAPIService);

}());


