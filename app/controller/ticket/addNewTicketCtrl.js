/**
 * Created by Damith on 8/25/2016.
 */

agentApp.controller('addNewTicketCtrl', function ($scope) {


        var modalEvent = function () {
            return {
                ticketModel: function (id, className) {
                    if (className == 'display-block') {
                        $(id).removeClass('display-none').addClass(className);
                    } else if (className == 'display-none') {
                        $(id).removeClass('display-block').addClass(className);
                    }
                }
            }
        }();

        $scope.clickAddNewTicket = function (id, className) {
            modalEvent.ticketModel(id, className);
        }
    }
);