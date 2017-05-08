/**
 * Created by damith on 5/3/17.
 */

agentApp.directive('queueDetailsDirective', function () {
    return {
        restrict: "EA",
        scope: {
            queueDetails: "="
        },
        templateUrl: 'app/directive/queueDetails/temp/temp-queue-details.html',
        link: function (scope) {

            //Max Wait Time
            //scope.startTime = scope.queueDetails.CurrentMaxWaitTime;





            console.log(scope.queueDetails);


            //test event
            scope.testCLickEvent = function () {
                console.log(scope.queueDetails);
            };
        }
    }
});