/**
 * Created by Damith on 8/15/2016.
 */


var agentApp = angular.module('veeryAgentApp',
    ['ui.bootstrap', 'ui.router', 'jkuri.slimscroll','veerySoftPhoneModule','base64','angular-jwt']);

var baseUrls = {
    'authUrl':'http://userservice.app.veery.cloud/oauth/token',
    'userServiceBaseUrl':'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'notification': 'notificationservice.app.veery.cloud',
    'ardsliteserviceUrl': 'http://ardsliteservice.app.veery.cloud/DVP/API/1.0.0.0/ARDS/resource'
};

agentApp.constant('baseUrls', baseUrls);

agentApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/console');
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "app/views/console-view.html"
        }).state("console.ticket", {
            url: "/ticket",
            templateUrl: "app/views/ticket/ticket-inbox.html"
        })
    }]);