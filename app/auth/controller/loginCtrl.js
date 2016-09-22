/**
 * Created by Veery Team on 6/1/2016.
 */

agentApp.controller('loginCtrl', function ($rootScope, $scope, $state, $http,
                                           loginService,
                                           config, $base64) {
        var para = {
            userName: null,
            password: null,
            clientID: $base64.encode(config.client_Id_secret),
        };

        var showAlert = function (title, type, content) {
            new PNotify({
                title: title,
                text: content,
                type: type,
                styling: 'bootstrap3',
                animate: {
                    animate: true,
                    in_class: "bounceIn",
                    out_class: "bounceOut"
                }
            });
        };


        $scope.isLogin = false;
        $scope.onClickLogin = function () {
            $('#usersName').removeClass('shake');
            $('#pwd').removeClass('shake');
            para.userName = $scope.userNme;
            para.password = $scope.pwd;
            //parameter option
            //username
            //password
            //decode clientID
            $scope.isLogin = true;
            $scope.loginFrm.$invalid = true;
            loginService.Login(para, function (result) {
                if (result) {
                    $state.go('console');
                } else {

                    $('#usersName').addClass('shake');
                    $('#pwd').addClass('shake');
                    showAlert('Error', 'error', 'Please check login details...');
                    $scope.isLogin = false;
                    $scope.loginFrm.$invalid = false;
                }
            });
        }
    }
);