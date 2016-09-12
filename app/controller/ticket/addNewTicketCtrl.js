/**
 * Created by Damith on 8/25/2016.
 */

agentApp.controller('addNewTicketCtrl', function ($scope, $http) {


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

        $scope.tags = [
            {text: 'just'},
            {text: 'some'},
            {text: 'cool'},
            {text: 'tags'}
        ];
        $scope.related = [
            {text: '8975622'}
        ];
        $scope.loadTags = function (query) {
            return $http.get('/tags?query=' + query);
        };

        $scope.users = [];
        $scope.loadUser = function ($query) {
            return $http.get('assets/json/assigneeUsers.json', {cache: true}).then(function (response) {
                var countries = response.data;
                console.log(countries);
                return countries.filter(function (country) {
                    return country.profileName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        };

        $scope.clickAddNewTicket = function (id, className) {
            modalEvent.ticketModel(id, className);
        }


    }
);