/**
 * Created by Damith on 6/17/2016.
 */
(function () {
    'use strict';
    agentApp.factory('loginService', Service);

    function Service($http, localStorageService, jwtHelper,baseUrls) {
        var service = {};
        service.mynavigations = mynavigations;
        service.Login = Login;
        service.clearCookie = clearCookie;
        service.getToken = getToken;
        service.getTokenDecode = getTokenDecode;
        service.Logoff = Logoff;
        return service;
        var mynavigations = {};

        //set cookie
        function setCookie(key, val) {
            localStorageService.set(key, val);
        }

        //get token
        function getToken(appname) {
            var data = localStorageService.get("@loginToken");
            if (data && data.access_token) {
                if (!jwtHelper.isTokenExpired(data.access_token)) {
                    return data.access_token;
                }
            }
            return undefined;
        };

        //check is owner
        function isOwner(appname) {
            var data = localStorageService.get("@loginToken");
            if (data && data.access_token) {
                if (!jwtHelper.isTokenExpired(data.access_token)) {
                    return data.user_meta.role;
                }
            }
            return undefined;
        };

        //get token decode
        function getTokenDecode() {
            var data = localStorageService.get("@loginToken");
            if (data && data.access_token) {
                if (!jwtHelper.isTokenExpired(data.access_token)) {
                    return jwtHelper.decodeToken(data.access_token);
                }
            }
            return undefined;
        }

        //remove cookie
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function clearCookie(key) {
            localStorageService.remove(key);
        }

        //logoff
        function Logoff(callback) {
            var decodeToken = getTokenDecode();
            $http.delete(baseUrls.oauthLogOutUrl + decodeToken.jti, {
                headers: {
                    Authorization: 'Bearer ' + getToken()
                }
            }).
            success(function (data, status, headers, config) {
                clearCookie('@loginToken');
                callback(true);
            }).
            error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }

        // user login
        //http://userservice.app.veery.cloud
        //http://192.168.5.103:3636
        function Login(parm, callback) {
            $http.post(baseUrls.oauthLoginUrl, {
                grant_type: "password",
                username: parm.userName,
                password: parm.password,
                scope: "all_all profile_veeryaccount"
            }, {
                headers: {
                    Authorization: 'Basic ' + parm.clientID
                }
            }).
            success(function (data, status, headers, config) {
                localStorageService.remove("@navigations");
                clearCookie('@loginToken');
                setCookie('@loginToken', data);
                callback(true);
            }).
            error(function (data, status, headers, config) {
                //login error
                callback(false);
            });
        }
    }
})();


