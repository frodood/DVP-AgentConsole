/**
 * Created by Damith on 10/21/2016.
 */

agentApp.directive("myNoteEditDirective", function (myNoteServices) {
    return {
        restrict: "EA",
        scope: {
            myNote: "=",
            delete: '&',
            reminder: '&'
        },
        templateUrl: 'app/views/myNote/temp/my-note.html',
        link: function (scope, element, attributes) {


            scope.myDate = new Date();

            scope.isMyNote = false;
            scope.reminderMeDate = null;


            //scope.closeRemindMe = function () {
            //    scope.isMyNote = false;
            //};


            scope.picker = {
                date: new Date()
            };

            scope.openCalendar = function (e) {
                scope.picker.open = true;
            };

            scope.checkMyNote = function (note) {
                myNoteServices.CheckMyNote(note).then(function (res) {
                    if (res.data.IsSuccess) {
                        note.check = true;
                        showAlert('Reminder Note', 'success', res.data.CustomMessage);
                    }

                }, function (err) {

                });
            }

        }
    }
});






agentApp.directive("gridsterDynamicHeight", function (myNoteServices){

    var directive = {
        scope: {
            item: "=" //gridster item
        },
        link: link,
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {

        scope.$watch(function() {

                return element[0].scrollHeight;
            },
            function(newVal, oldVal) {

                var rowHeightOption = 75; // Change this value with your own rowHeight option
                var height = rowHeightOption * scope.item.sizeY;
                if(newVal > height){

                    var div = Math.floor(newVal / rowHeightOption);
                    div++;
                    scope.item.sizeY = div;
                }
            });
    }
});
