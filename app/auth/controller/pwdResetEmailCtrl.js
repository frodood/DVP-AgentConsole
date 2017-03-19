/**
 * Created by damith on 3/15/17.
 */

agentApp.controller('pwdResetEmailCtrl', function ($rootScope, $scope, $state, $http,
                                           loginService,
                                           config, $base64, $auth) {


    $scope.BackToLogin = function () {
        $state.go('login');
    };

    $scope.ResetPassword = function () {
        loginService.forgetPassword($scope.recoverEmail, function (isSuccess) {
            if (isSuccess) {
                showAlert('Success', 'success', "Please check email");
                $state.go('login');
            } else {
                showAlert('Error', 'error', "reset failed");
            }
        })
    };



});