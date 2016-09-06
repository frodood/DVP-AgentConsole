/**
 * Created by Damith on 9/5/2016.
 */

agentApp.directive("engagementTemp", function () {
    return {
        restrict: "EA",
        templateUrl: 'app/views/profile/engagement-call.html',
        link: function (scope, element, attributes) {
            scope.test = Math.floor((Math.random() * 6) + 1);
            console.log(scope.test);
        }
    }
});