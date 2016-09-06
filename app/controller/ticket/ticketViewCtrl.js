/**
 * Created by Damith on 9/5/2016.
 */
agentApp.controller('ticketViewCtrl', function ($scope) {
    $scope.tabs = [
        {title: 'COMMENTS', content: 'Dynamic content 1', icon: 'main-icon-2-communication', type: 'comments'},
        {title: 'ACTIVITY', content: 'Dynamic content 2', icon: 'main-icon-2-communication', type: 'activity'}
    ];
});