/**
 * Created by Veery Team on 6/17/2016.
 */
(function () {
    'use strict';
    agentApp.factory('loginService', Service);

    function Service($http, $auth, localStorageService, jwtHelper, baseUrls) {
        var service = {};
        service.mynavigations = mynavigations;
        service.Login = Login;
        service.clearCookie = clearCookie;
        service.getToken = getToken;
        service.getTokenDecode = getTokenDecode;
        service.Logoff = Logoff;
        service.VerifyPwd = VerifyPwd;
        service.UpdateMyPwd = UpdateMyPwd;
        service.forgetPassword = forgetPassword;
        return service;
        var mynavigations = {};

        //set cookie
        function setCookie(key, val) {
            localStorageService.set(key, val);
        }

        //get token
        function getToken(appname) {
            //var data = localStorageService.get("@agentConsoleLoginToken");
            //if (data && data.access_token) {
            //    if (!jwtHelper.isTokenExpired(data.access_token)) {
            //        return data.access_token;
            //    }
            //}
            //return undefined;

            var token = $auth.getToken();
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    return token;
                }
            }
            return undefined;
        };

        //check is owner
        function isOwner(appname) {
            var data = localStorageService.get("@agentConsoleLoginToken");
            if (data && data.access_token) {
                if (!jwtHelper.isTokenExpired(data.access_token)) {
                    return data.user_meta.role;
                }
            }
            return undefined;
        };

        //get token decode
        function getTokenDecode() {
            //var data = localStorageService.get("@agentConsoleLoginToken");
            //if (data && data.access_token) {
            //    if (!jwtHelper.isTokenExpired(data.access_token)) {
            //        return jwtHelper.decodeToken(data.access_token);
            //    }
            //}
            //return undefined;

            var token = $auth.getToken();
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    return jwtHelper.decodeToken(token);
                }
            }
            return undefined;
        }

        //remove cookie
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function clearCookie(key) {
            //localStorageService.remove(key);
            $auth.removeToken();
        }

        //logoff
        function Logoff(callback) {
            var decodeToken = getTokenDecode();
            $http.delete(baseUrls.authUrl + '/revoke/' + decodeToken.jti, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            }).success(function (data, status, headers, config) {
                $auth.removeToken();
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }

        // user login
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function Login(parm, callback) {
            $http.post(baseUrls.authUrl, {
                grant_type: "password",
                username: parm.userName,
                password: parm.password,
                scope: "all_all profile_veeryaccount write_ardsresource write_notification read_myUserProfile read_productivity profile_veeryaccount resourceid"
            }, {
                headers: {
                    Authorization: 'Basic ' + parm.clientID
                }
            }).success(function (data, status, headers, config) {
                localStorageService.remove("@navigations");
                clearCookie('@agentConsoleLoginToken');
                setCookie('@agentConsoleLoginToken', data);
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }


        function VerifyPwd(pram, callback) {
            $http.post(baseUrls.pwdVerifyUrl, {
                userName: pram.userName,
                password: pram.password,
            }).success(function (data, status, headers, config) {
                callback(true);
            }).error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }

        function UpdateMyPwd(param, callback) {
            $http.put(baseUrls.userServiceBaseUrl+'Myprofile/Password', param)
                .success(function (data, status, headers, config) {
                    callback(true,data);
                }).error(function (data, status, headers, config) {
                //login error
                callback(false,data);
            });
        }

        //forget password
        function forgetPassword(email, callback) {
            $http.post(baseUrls.userServiceBaseUrl + "auth/forget", {email: email}).success(function (data, status, headers, config) {
                callback(data.IsSuccess);

            }).error(function (data, status, headers, config) {
                callback(data.IsSuccess);
            });
        };
    }
})();


