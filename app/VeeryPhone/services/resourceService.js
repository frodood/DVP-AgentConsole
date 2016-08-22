/**
 * Created by Rajinda on 12/31/2015.
 */

var resourceModule = angular.module("veerySoftPhoneModule", []);
resourceModule.factory("resourceService", function ($http, $log, baseUrls, dataParser) {
//Format is Authorization: Bearer [token]
    var breakRequest = function (resourceId, reason) {
        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId + "/state/NotAvailable/reason/" + reason,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });
    };

    var endBreakRequest = function (resourceId, reason) {

        return $http({
            method: 'put',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId + "/state/Available/reason/EndBreak",
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };
//{"ResourceId":resourceId,"HandlingTypes":["CALL"]}
    var registerWithArds = function (resourceId,contact) {

        return $http({
            method: 'post',
            url: baseUrls.ardsliteserviceUrl,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            },
            data: {
                "ResourceId": resourceId,
                "HandlingTypes": [{
                    "Type": "CALL",
                    "Contact": contact
                }]
            }

        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    var unregisterWithArds = function (resourceId) {

        return $http({
            method: 'delete',
            url: baseUrls.ardsliteserviceUrl + "/" + resourceId,
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            },
            data: {"ResourceId": resourceId, "HandlingTypes": ["CALL"]}
        }).then(function (response) {
            return response.data.IsSuccess;
        });

    };

    var getContactVeeryFormat = function (userName) {

        return $http({
            method: 'get',
            url: baseUrls.userServiceBaseUrl + "Myprofile/veeryformat/veeryaccount",
            headers: {
                'authorization': "Bearer " + dataParser.userProfile.server.token
            }
        }).then(function (response) {
            return response.data;
        });

    };

    return {
        BreakRequest: breakRequest,
        EndBreakRequest: endBreakRequest,
        RegisterWithArds: registerWithArds,
        UnregisterWithArds: unregisterWithArds,
        GetContactVeeryFormat: getContactVeeryFormat
    }

});

resourceModule.factory('dataParser', function(){
    var userProfile = {};

    return userProfile;
});

resourceModule.factory('socketAuth', function(socket, $q) {
        return {
            getAuthenticatedAsPromise:function(){

                var listenForAuthentication = function(){
                    console.log('listening for socket authentication');
                    var listenDeferred = $q.defer();
                    var authCallback = function(){
                        console.log('listening for socket authentication - done');
                        listenDeferred.resolve(true);
                    };
                    socket.socket.on('authenticated', authCallback);
                    return listenDeferred.promise;
                };

                if(!socket.socket){
                    socket.initialize();
                    return listenForAuthentication();
                }else{
                    if(socket.getAuthenticated()){
                        return $q.when(true);
                    }else{
                        return listenForAuthentication();
                    }
                }
            }
        };
    });

resourceModule.factory('socket', function (socketFactory, dataParser,baseUrls) {

    var showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3'
        });
    };

        var socket, ioSocket, isAuthenticated,
            self = {
                getAuthenticated: function () {
                    return isAuthenticated;
                }
            };
        // by default the socket property is null and is not authenticated
        self.socket = socket;
        // initializer function to connect the socket for the first time after logging in to the app
        self.initialize = function () {

            try {
                console.log('initializing socket');

                isAuthenticated = false;

                // socket.io now auto-configures its connection when we omit a connection url
                ioSocket = io(baseUrls.notification, {
                    path: ''
                });

                //call btford angular-socket-io library factory to connect to server at this point
                self.socket = socket = socketFactory({
                    ioSocket: ioSocket
                });

                //---------------------
                //these listeners will only be applied once when socket.initialize is called
                //they will be triggered each time the socket connects/re-connects (e.g. when logging out and logging in again)
                //----------------------
                socket.on('authenticated', function () {
                    isAuthenticated = true;
                    console.log('socket is jwt authenticated');
                    //document.getElementById("lblNotification").innerHTML = "socket is jwt authenticated";
                    showAlert("Notifications","success","Register With Notification Provider.");
                });
                //---------------------
                socket.on('connect', function () {
                    //Notification.info({message: "sending JWT", delay: 500, closeOnClick: true});
                    //send the jwt
                    socket.emit('authenticate', {token: dataParser.userProfile.server.token});
                });

                socket.on('clientdetails', function (data) {
                    //Notification.info({message: data, delay: 500, closeOnClick: true});
                    console.log(data);
                });

                socket.on('disconnect', function (reason) {
                    //Notification.info({message: reason, delay: 500, closeOnClick: true});
                    console.log(reason);
                });

                socket.on('message', function (reason) {
                    //Notification.info({message: reason, delay: 500, closeOnClick: true});
                    console.log(reason);
                });

                socket.on('broadcast', function (data) {
                    //document.getElementById("lblNotification").innerHTML = data;
                    //Notification.info({message: data, delay: 500, closeOnClick: true});
                    console.log(data);
                });

                socket.on('publish', function (data) {
                    //document.getElementById("lblNotification").innerHTML = data;
                    //Notification.info({message: data, delay: 500, closeOnClick: true});
                    console.log(data);
                });

                socket.on('agent_connected', function (data) {
                    //document.getElementById("lblNotification").innerHTML = data.Message;

                    //Notification.primary({message: data.Message, delay: 5000, closeOnClick: true});
                    console.log(data);
                });
                socket.on('agent_found', function (data) {

                    var values = data.Message.split("|");
                    var displayMsg = "Company : " + data.Company + "<br> Company No : " + values[5] + "<br> Caller : " + values[3] + "<br> Skill : " + values[6];
                    //document.getElementById("lblNotification").innerHTML = displayMsg;
                    showAlert("Notifications","success",displayMsg);
                    console.log(data);
                });
                socket.on('agent_disconnected', function (data) {
                    // document.getElementById("lblNotification").innerHTML = data.Message;
                    //Notification.primary({message: data.Message, delay: 5000, closeOnClick: true});
                    console.log(data);
                });
            } catch (ex) {
                console.log("Error In socket.io");
            }
        };

        return self;

    });