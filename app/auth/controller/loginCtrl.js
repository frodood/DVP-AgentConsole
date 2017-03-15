/**
 * Created by Veery Team on 6/1/2016.
 */

agentApp.controller('loginCtrl', function ($rootScope, $scope, $state, $http,
                                           loginService,
                                           config, $base64, $auth) {
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
        para.scope = ["all_all", "profile_veeryaccount", "write_ardsresource", "write_notification", "read_myUserProfile", "read_productivity", "profile_veeryaccount", "resourceid"];

        if (para.userName == null || para.userName.length == 0) {
            showAlert('Error', 'error', 'Please check user name..');
            return;
        }
        if (para.password == null || para.password.length == 0) {
            showAlert('Error', 'error', 'Please check login password..');
            return;
        }

        //parameter option
        //username
        //password
        //decode clientID
        $scope.isLogin = true;
        $scope.loginFrm.$invalid = true;

        /*

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
         */

        $auth.login(para)
            .then(function () {
                $state.go('console');
            })
            .catch(function (error) {
                $('#usersName').addClass('shake');
                $('#pwd').addClass('shake');
                showAlert('Error', 'error', 'Please check login details...');
                $scope.isLogin = false;
                $scope.loginFrm.$invalid = false;
            });

    };

    $scope.CheckLogin = function () {
        if ($auth.isAuthenticated()) {
            $state.go('console');
        }
    };

    $scope.CheckLogin();


    //Recover email forget password
    $scope.onClickRecoverEmail = function () {

    };

}).directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});