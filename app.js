/**
 * Created by Damith on 8/15/2016.
 */


var agentApp = angular.module('veeryAgentApp',
    ['ui.bootstrap', 'ui.router', 'jkuri.slimscroll']);

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