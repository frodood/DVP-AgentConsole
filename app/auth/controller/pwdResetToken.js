/**
 * Created by damith on 3/15/17.
 */
agentApp.controller('pwdResetToken', function ($rootScope, $scope, $state, $http,
                                              loginService,
                                              config, $base64, $auth) {


    $scope.token = undefined;
    $scope.password = undefined;
    $scope.confirmPwd = undefined;

    $scope.ResetPassword = function(){

        loginService.resetPassword($scope.token, $scope.password, function (isSuccess) {
            if (isSuccess) {
                showAlert('Success', 'success', "Please check email");
                $state.go('login');
            } else {
                showAlert('Error', 'error', "reset failed");
            }
        })

    }


});