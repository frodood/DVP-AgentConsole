/**
 * Created by Damith on 8/15/2016.
 */


var agentApp = angular.module('veeryAgentApp',
    ['ui.bootstrap', 'ui.router', 'jkuri.slimscroll', 'veerySoftPhoneModule', 'base64',
        'angular-jwt', 'veeryNotificationMod', 'btford.socket-io', 'LocalStorageModule',
        'authServiceModule', 'ngTagsInput']);

agentApp.constant('moment', moment);

var baseUrls = {
    'authUrl': 'http://userservice.app.veery.cloud/oauth/token',
    'userServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'notification': 'http://notificationservice.app.veery.cloud',
    'ardsliteserviceUrl': 'http://ardsliteservice.app.veery.cloud/DVP/API/1.0.0.0/ARDS/resource',
    'engagementUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/',
    'ticketUrl': 'http://localhost:3636/DVP/API/1.0.0.0/',
    'ivrUrl': 'http://eventservice.app.veery.cloud/DVP/API/1.0.0.0/EventService/Events/SessionId/',
    'mailInboxUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/Inbox/'
};

agentApp.constant('baseUrls', baseUrls);

agentApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "app/views/console-view.html"
        }).state("console.ticket", {
            url: "/ticket",
            templateUrl: "app/views/ticket/ticket-inbox.html"
        }).state('login', {
            url: "/login",
            templateUrl: "app/auth/login.html"
        })
    }]);