/**
 * Created by Veery Team on 8/15/2016.
 */


var agentApp = angular.module('veeryAgentApp',
    ['ngRoute', 'ui.bootstrap', 'ui.router', 'jkuri.slimscroll', 'veerySoftPhoneModule', 'base64',
        'angular-jwt', 'veeryNotificationMod', 'btford.socket-io', 'LocalStorageModule',
        'authServiceModule', 'ngTagsInput', 'schemaForm', 'yaru22.angular-timeago', 'timer', 'ngSanitize',
        'uuid', 'angularFileUpload', 'download', 'fileServiceModule',
        'com.2fdevs.videogular',
        'ui.tab.scroll', 'ngAnimate', 'mgcrea.ngStrap', 'gridster', 'ui.bootstrap.datetimepicker', 'moment-picker', 'angular.filter', 'satellizer', 'mdo-angular-cryptography'
        , 'ui.bootstrap.accordion', 'jsonFormatter', 'bw.paging', 'pubnub.angular.service', 'ui.slimscroll',
        'ngImgCrop','jkAngularRatingStars','rzModule'
    ]);


agentApp.constant('moment', moment);

var baseUrls = {
    'authUrl': 'http://userservice.app.veery.cloud/oauth/token',
    'userServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'notification': 'http://notificationservice.app.veery.cloud',
    'ardsliteserviceUrl': 'http://ardsliteservice.app.veery.cloud/DVP/API/1.0.0.0/ARDS/',//ardsliteservice.app.veery.cloud
    'engagementUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/',//interactions.app.veery.cloud
    'ticketUrl': 'http://liteticket.app.veery.cloud/DVP/API/1.0.0.0/',//liteticket.app.veery.cloud
    'ivrUrl': 'http://eventservice.app.veery.cloud/DVP/API/1.0.0.0/EventService/Events/SessionId/',
    'mailInboxUrl': 'http://interactions.app.veery.cloud/DVP/API/1.0.0.0/Inbox/',
    'ardsMonitoringServiceUrl': 'http://ardsmonitoring.app.veery.cloud/DVP/API/1.0.0.0/ARDS/MONITORING',
    'fileService': 'http://fileservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'fileServiceInternalUrl': 'http://fileservice.app.veery.cloud/DVP/API/1.0.0.0/InternalFileService/',
    'resourceService': 'http://resourceservice.app.veery.cloud/DVP/API/1.0.0.0/ResourceManager/',
    'dashBordUrl': 'http://dashboardservice.app.veery.cloud/',
    'toDoUrl': 'http://todolistservice.app.veery.cloud/DVP/API/1.0.0.0/',
    //todolistservice.app.veery.cloud
    'monitorrestapi': 'http://monitorrestapi.app.veery.cloud/DVP/API/1.0.0.0/',
    'integrationapi': 'http://localhost:4334/DVP/API/1.0.0.0/IntegrationAPI/',
    'sipuserUrl': 'http://sipuserendpointservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'pwdVerifyUrl': 'http://userservice.app.veery.cloud/auth/verify',
    'ipMessageURL': 'http://ipmessagingservice.app.veery.cloud',
    'qaModule':'http://qamodule.app.veery.cloud/DVP/API/1.0.0.0/QAModule/',
    'contactUrl': 'http://contacts.app.veery.cloud//DVP/API/1.0.0.0/ContactManager/' //campaignmanager.app.veery.cloud

};

agentApp.constant('baseUrls', baseUrls);

agentApp.constant('dashboardRefreshTime', 60000);
agentApp.constant('turnServers', [{url: "stun:stun.l.google.com:19302"}, {url: "stun:stun.counterpath.net:3478"}, {url: "stun:numb.viagenie.ca:3478"}]);
//{url:"stun:stun.l.google.com:19302"},{url:"stun:stun.counterpath.net:3478"},{url:"stun:numb.viagenie.ca:3478"}
//{url:"turn:turn@172.16.11.133:80",credential:"DuoS123"}

var phoneSetting = {
    'TransferPhnCode': '*6',
    'TransferExtCode': '*3',
    'TransferIvrCode': '*9',
    'EtlCode': '#',
    'SwapCode': '1',
    'ConferenceCode': '0',
    'ExtNumberLength':5
};
agentApp.constant('phoneSetting', phoneSetting);

agentApp.config(function (scrollableTabsetConfigProvider) {
    scrollableTabsetConfigProvider.setShowTooltips(true);
    scrollableTabsetConfigProvider.setTooltipLeftPlacement('bottom');
    scrollableTabsetConfigProvider.setTooltipRightPlacement('left');
});

agentApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider", "$authProvider", "gridsterConfig",
    function ($httpProvider, $stateProvider, $urlRouterProvider, $authProvider) {


        var authProviderUrl = 'http://userservice.app.veery.cloud/';
        $authProvider.loginUrl = authProviderUrl + 'auth/login';
        $authProvider.signupUrl = authProviderUrl + 'auth/signup';

        $urlRouterProvider.otherwise('/login');
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "app/views/console-view.html",
            data: {
                requireLogin: true
            }
        }).state('login', {
            url: "/login",
            templateUrl: "app/auth/login.html",
            data: {
                requireLogin: false
            }
        })
    }], function (scrollableTabsetConfigProvider) {
    scrollableTabsetConfigProvider.setShowTooltips(true);
    scrollableTabsetConfigProvider.setTooltipLeftPlacement('bottom');
    scrollableTabsetConfigProvider.setTooltipRightPlacement('left');
});

agentApp.config(['$cryptoProvider', function ($cryptoProvider) {
    $cryptoProvider.setCryptographyKey('1111111111111111');
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
    var decodeToken = loginService.getTokenDecode();
    if (!decodeToken) {
        $state.go('login');
        return
    }
});


//agentApp.directive('scrollable', function ($document, $interval, $timeout, $window) {
//    return {
//        restrict: 'A',
//        link: function ($scope, wrappedElement, attributes) {
//            var element = wrappedElement[0],
//                navTabsElement,
//                scrollTimer,
//                dragInfo = {};
//
//            init();
//
//            function startScroll($event) {
//                if ($event.target == element) {
//                    // TODO should use requestAnimationFrame
//                    scrollTimer = $interval(function () {
//                        navTabsElement.scrollLeft += ($event.clientX > 200) ? 5 : -5;
//                    }, 1000 / 60);
//                }
//            };
//
//            function stopScroll($event) {
//                $interval.cancel(scrollTimer);
//            }
//
//            function onDocumentMouseMove($event) {
//                var differenceX = $event.pageX - dragInfo.lastPageX;
//
//                dragInfo.lastPageX = $event.pageX;
//                dragInfo.moved = true;
//
//                navTabsElement.scrollLeft -= differenceX;
//            }
//
//            function onDocumentMouseUp($event) {
//                //$event.preventDefault();
//                //$event.stopPropagation();
//                //$event.cancelBubble = true;
//
//                $document.off('mousemove', onDocumentMouseMove);
//                $document.off('mouseup', onDocumentMouseUp);
//
//                // wow
//                if (dragInfo.moved === true) {
//                    [].forEach.call(navTabsElement.querySelectorAll('li a'), function (anchor) {
//                        var anchorScope = angular.element(anchor).scope();
//                        anchorScope.oldDisabled = anchorScope.disabled;
//                        anchorScope.disabled = true;
//                    });
//                    $timeout(function () {
//                        [].forEach.call(navTabsElement.querySelectorAll('li a'), function (anchor) {
//                            var anchorScope = angular.element(anchor).scope();
//                            anchorScope.disabled = anchorScope.oldDisabled;
//                            delete anchorScope.oldDisabled;
//                        });
//                    });
//                }
//            }
//
//            function onNavTabsMouseDown($event) {
//                var currentlyScrollable = element.classList.contains('scrollable');
//
//                if (currentlyScrollable === true) {
//                    $event.preventDefault();
//
//                    dragInfo.lastPageX = $event.pageX;
//                    dragInfo.moved = false;
//
//                    $document.on('mousemove', onDocumentMouseMove);
//                    $document.on('mouseup', onDocumentMouseUp);
//                }
//            }
//
//            function onWindowResize() {
//                checkForScroll();
//            }
//
//            function checkForScroll() {
//                console.log('checking tabs for scroll');
//                var currentlyScrollable = element.classList.contains('scrollable'),
//                    difference = 1;
//
//                // determine whether or not it should actually be scrollable
//                // the logic is different if the tabs are currently tagged as scrollable
//                if (currentlyScrollable === true) {
//                    difference = navTabsElement.scrollWidth - navTabsElement.clientWidth;
//                } else {
//                    difference = navTabsElement.clientHeight - navTabsElement.querySelector('.nav-tabs > li').clientHeight;
//                }
//                console.log(difference);
//
//                if (difference > 2) {
//                    element.classList.add('scrollable');
//                } else {
//                    element.classList.remove('scrollable');
//                }
//            }
//
//            function bindEventListeners() {
//                wrappedElement.on('mousedown', function ($event) {
//                    startScroll($event);
//                });
//
//                wrappedElement.on('click', function ($event) {
//                    console.log(this);
//                    $(this)
//                    console.log('CLICK', $event.defaultPrevented);
//                });
//
//                wrappedElement.on('mouseup mouseleave', function ($event) {
//                    stopScroll($event);
//                });
//
//                angular.element(navTabsElement).on('mousedown', onNavTabsMouseDown);
//
//                $window.addEventListener('resize', onWindowResize);
//
//                $scope.$on('$destroy', function () {
//                    wrappedElement.off('mousedown mouseup mouseleave');
//                    angular.element(navTabsElement).off('mousedown', onNavTabsMouseDown);
//                    $window.removeEventListener('resize', onWindowResize);
//                });
//            }
//
//            $scope.$on('checkTabs', function () {
//                $timeout(checkForScroll, 10);
//            });
//
//            function init() {
//                // wait for tabs, sucks
//                $timeout(function () {
//                    navTabsElement = element.querySelector('.nav-tabs');
//
//                    bindEventListeners();
//                    onWindowResize();
//                });
//            }
//        }
//    }
//});
