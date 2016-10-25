/**
 * Created by Damith on 10/21/2016.
 */

agentApp.directive("myNoteEditDirective", function (myNoteServices) {
    return {
        restrict: "EA",
        scope: {
            myNote: "=",
            delete: '&'

        },
        templateUrl: 'app/views/myNote/temp/my-note.html',
        link: function (scope, element, attributes) {
            scope.isMyNote = false;
            scope.reminderMeDate = null;
            scope.remindMe = function () {
                console.log('event fire');
                scope.isMyNote = true;
            };

            scope.closeRemindMe = function () {
                scope.isMyNote = false;
            };


            scope.picker = {
                date: new Date()
            };

            scope.openCalendar = function (e) {
                scope.picker.open = true;
            };

            scope.checkMyNote = function (note) {
                myNoteServices.CheckMyNote(note).then(function (res) {

                }, function (err) {

                });
            }

        }
    }
});