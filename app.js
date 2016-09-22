/**
 * Created by Damith on 8/15/2016.
 */


var agentApp = angular.module('veeryAgentApp',
    ['ui.bootstrap', 'ui.router', 'jkuri.slimscroll', 'veerySoftPhoneModule', 'base64',
        'angular-jwt', 'veeryNotificationMod', 'btford.socket-io', 'LocalStorageModule',
        'authServiceModule', 'ngTagsInput', 'schemaForm', 'yaru22.angular-timeago', 'timer', 'ngSanitize']);

agentApp.constant('moment', moment);

var baseUrls = {
    'authUrl': 'http://userservice.app.veery.cloud/oauth/token',
    'userServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'notification': 'http://notificationservice.app.veery.cloud',
    'ardsliteserviceUrl': 'http://ardsliteservice.app.veery.cloud/DVP/API/1.0.0.0/ARDS/resource',
    'engagementUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/',
    'ticketUrl': 'http://liteticket.app.veery.cloud/DVP/API/1.0.0.0/',
    'ivrUrl': 'http://eventservice.app.veery.cloud/DVP/API/1.0.0.0/EventService/Events/SessionId/',
    'mailInboxUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/Inbox/',
    'oauthLogOutUrl': 'http://userservice.app.veery.cloud/oauth/token/revoke/',
    'oauthLoginUrl': 'http://userservice.app.veery.cloud/oauth/token',
};

agentApp.constant('baseUrls', baseUrls);

agentApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "app/views/console-view.html",
            data: {
                requireLogin: true
            }
        }).state("console.ticket", {
            url: "/ticket",
            templateUrl: "app/views/ticket/ticket-inbox.html"
        }).state('login', {
            url: "/login",
            templateUrl: "app/auth/login.html",
            data: {
                requireLogin: false
            }
        })
    }]);

agentApp.constant('config', {
    Auth_API: 'http://userservice.162.243.230.46.xip.io/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048'
});

//Authentication
agentApp.run(function ($rootScope, loginService, $location, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin) {
            if (!loginService.getToken()) {
                event.preventDefault();
                $state.go('login');
            }
            // get me a login modal!
        }
    });

})
