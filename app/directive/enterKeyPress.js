/**
 * Created by Rajinda on 08/21/2017.
 */

agentApp.directive('enterKeyPress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterKeyPress);
                });

                event.preventDefault();
            }
        });
    };
});
