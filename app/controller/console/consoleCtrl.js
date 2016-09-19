/**
 * Created by Damith on 8/16/2016.
 */

agentApp.controller('consoleCtrl', function ($filter, $rootScope, $scope, $http, $base64, $timeout,
                                             jwtHelper, resourceService, baseUrls, dataParser,
                                             veeryNotification, authService, userService, tagService, $interval,myProfileDataParser) {

    $scope.notifications = [];
    $scope.agentList = [];
    getJSONData($http, 'notification', function (data) {
        $scope.notifications = data;
    });

    getJSONData($http, 'userList', function (data) {
        $scope.agentList = data;
    });

    $scope.status = {
        isopen: false
    };

    /*# console top menu */
    $scope.consoleTopMenu = {
        openTicket: function () {
            $('#mainTicketWrapper').addClass(' display-block fadeIn').
                removeClass('display-none zoomOut');
        },
        Register: function () {
            if ($scope.isRegistor) {
                $scope.ShowHidePhone(!$scope.showPhone);
            } else {
                $scope.veeryPhone.Register('duoarafath', 'DuoS123');
            }
        },
        openTicketViews: function () {
            divModel.model('#ticketFilterWrap', 'display-block');
        }

    };
    /*--------------------------Veery Phone---------------------------------------*/

    $scope.ShowIncomeingNotification = function (status) {
        if (status) {
            $('#incomingNotification').addClass('display-block fadeIn').
                removeClass('display-none zoomOut');
        } else {
            $('#incomingNotification').addClass('display-none fadeIn').
                removeClass('display-block  zoomOut');
        }
    };

    $scope.ShowHidePhone = function (value) {
        $scope.showPhone = value;
        if (value) {
            // is show phone
            $('#isOperationPhone').addClass('display-block ').
                removeClass('display-none');
        } else {
            //is hide phone
            $('#isOperationPhone').addClass('display-none ').
                removeClass('display-block');
        }
    };

    $scope.PhoneOnline = function () {
        //is loading done
        $('#isLoadingRegPhone').addClass('display-none').
            removeClass('display-block active-menu-icon ');
        $('#isBtnReg').addClass('display-block active-menu-icon   ').
            removeClass('display-none  ');
        $scope.ShowHidePhone(true);
    };

    $scope.PhoneOffline = function () {

        $('#isLoadingRegPhone').addClass('display-block').
            removeClass('display-none');
        $('#isBtnReg').addClass('display-none ').
            removeClass('display-block active-menu-icon');
        /*IsRegisterPhone: function (status) {
         if (!status) {
         //is loading
         $('#isLoadingRegPhone').addClass('display-block').
         removeClass('display-none');
         $('#isBtnReg').addClass('display-none ').
         removeClass('display-block active-menu-icon');
         } else {
         //is loading done
         $('#isLoadingRegPhone').addClass('display-none').
         removeClass('display-block active-menu-icon ');
         $('#isBtnReg').addClass('display-block active-menu-icon   ').
         removeClass('display-none  ');
         }
         }*/
    };


    $scope.isRegistor = false;
    $scope.showPhone = false;
    $scope.phoneStatus = "Offline";

    $scope.showAlert = function (tittle, type, msg) {
        new PNotify({
            title: tittle,
            text: msg,
            type: type,
            styling: 'bootstrap3',
            icon: false
        });
    };

    $scope.profile = {};
    $scope.profile.displayName = "";
    $scope.profile.authorizationName = "";
    $scope.profile.publicIdentity = "";//sip:bob@159.203.160.47
    $scope.profile.server = {};
    $scope.profile.server.domain = "";
    $scope.profile.server.websocketUrl = "";//wss://159.203.160.47:7443
    $scope.profile.server.outboundProxy = "";
    $scope.profile.server.enableRtcwebBreaker = false;
    $scope.profile.server.password = null;
    $scope.profile.server.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3YXJ1bmFAZHVvc29mdHdhcmUuY29tIiwianRpIjoiMTk2N2E5MjItNmIyOS00NDgxLWI2MWUtOTMwZjVmMDA3ZDM3Iiwic3ViIjoiZTBlNTNhOWUtZjNkZi00MTZjLWFmZWItYzI2ZDVhZWIwYWY2IiwiZXhwIjoxNDY1MzEyMTQ2LCJ0ZW5hbnQiOiIxIiwiY29tcGFueSI6IjMiLCJjbGllbnQiOiIxIiwic2NvcGUiOlt7InJlc291cmNlIjoiYXJkc3Jlc291cmNlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InJlYWQifSx7InJlc291cmNlIjoid3JpdGUifSx7InJlc291cmNlIjoiZGVsZXRlIn0seyJyZXNvdXJjZSI6InJlc291cmNlIiwiYWN0aW9ucyI6WyJhcmRzcmVzb3VyY2UiLCJyZWFkIiwid3JpdGUiLCJkZWxldGUiLCJyZXNvdXJjZSJdfV0sImlhdCI6MTQ2NDcwNzM0Nn0.brIo8b6per6a1Djm4armChkS4L2O6T40HSrlj-scwcg";

    $scope.veeryPhone = {
        sipSendDTMF: function (dtmf) {
            sipSendDTMF(dtmf);
            $scope.call.number = $scope.call.number + dtmf;
        },
        makeAudioCall: function (callNumber) {
            if (callNumber == "") {
                return
            }
            sipCall('call-audio', callNumber);
        },
        endCall: function () {
            sipHangUp();
        },
        answerCall: function () {
            answerCall();
            $scope.ShowIncomeingNotification(false);
        },
        rejectCall: function () {
            //UIStateChange.inIdleState();
            rejectCall();
            $scope.ShowIncomeingNotification(false);
        },
        registerWithArds: function (userProfile) {
            resourceService.RegisterWithArds(userProfile.id, userProfile.veeryFormat).then(function (response) {
                $scope.registerdWithArds = response;
                $scope.userName = userProfile.userName;


                preInit(userEvent, userProfile);// initialize Soft phone

            }, function (error) {
                $scope.showAlert("Soft Phone", "error", "Fail To Register With Resource Server.");
            });
        },
        Register: function (userName, password) {
            $scope.PhoneOffline();
            $scope.phoneStatus = "Registering With Servers";
            var url = baseUrls.authUrl;
            var encoded = $base64.encode("ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048");
            var config = {
                headers: {
                    'Authorization': 'Basic ' + encoded
                }
            };
            var data = {
                "grant_type": "password",
                "username": userName,
                "password": password,
                "scope": "write_ardsresource write_notification read_myUserProfile profile_veeryaccount resourceid"
            };
            $http.post(url, data, config)
                .success(function (data, status, headers, config) {
                    $scope.PostDataResponse = data;
                    console.log(data);

                    if (data) {
                        var decodeData = jwtHelper.decodeToken(data.access_token);

                        var values = decodeData.context.veeryaccount.contact.split("@");
                        $scope.profile.id = decodeData.context.resourceid;
                        $scope.profile.displayName = values[0];
                        $scope.profile.authorizationName = values[0];
                        $scope.profile.publicIdentity = "sip:" + decodeData.context.veeryaccount.contact;//sip:bob@159.203.160.47
                        $scope.profile.password = password;
                        $scope.profile.server.token = data.access_token;
                        $scope.profile.server.domain = values[1];
                        $scope.profile.server.websocketUrl = "wss://" + values[1] + ":7443";//wss://159.203.160.47:7443
                        $scope.profile.server.outboundProxy = "";
                        $scope.profile.server.enableRtcwebBreaker = false;
                        dataParser.userProfile = $scope.profile;
                        if (!decodeData.context.resourceid) {
                            $scope.showAlert("Soft Phone", "error", "Fail to Get Resource Information's.");
                            return;
                        }
                        resourceService.GetContactVeeryFormat(userName).then(function (response) {
                            if (response.IsSuccess) {
                                if ($scope.profile.server.password)
                                    $scope.profile.password = $scope.profile.server.password;
                                $scope.profile.veeryFormat = response.Result;
                                dataParser.userProfile = $scope.profile;
                                $scope.veeryPhone.registerWithArds($scope.profile);
                            }
                            else {
                                $scope.showAlert("Soft Phone", "error", "Fail to Get Contact Details.");
                            }
                        }, function (error) {
                            $scope.showAlert("Soft Phone", "error", "Fail to Communicate with servers");
                        });


                    }
                });
        },
        unregisterWithArds: function () {
            resourceService.UnregisterWithArds(dataParser.userProfile.id).then(function (response) {
                $scope.registerdWithArds = !response;
            }, function (error) {
                $scope.showAlert("Soft Phone", "error", "Unregister With ARDS Fail");
            });
        },
        fullScreen: function (b_fs) {
            bFullScreen = b_fs;
            if (tsk_utils_have_webrtc4native() && bFullScreen && videoRemote.webkitSupportsFullscreen) {
                if (bFullScreen) {
                    videoRemote.webkitEnterFullScreen();
                }
                else {
                    videoRemote.webkitExitFullscreen();
                }
            }
            else {
                if (tsk_utils_have_webrtc4npapi()) {
                    try {
                        if (window.__o_display_remote) window.__o_display_remote.setFullScreen(b_fs);
                    }
                    catch (e) {
                        document.getElementById("divVideo").setAttribute("class", b_fs ? "full-screen" : "normal-screen");
                    }
                }
                else {
                    document.getElementById("divVideo").setAttribute("class", b_fs ? "full-screen" : "normal-screen");
                }
            }
        },
        onSipEventSession: function (e) {
            try {
                console.info("onSipEventSession : " + e);
                $scope.$apply(function () {
                    $scope.callStatus = e;
                });

                //document.getElementById("lblSipStatus").innerHTML = e;
                //Notification.info({message: e, delay: 500, closeOnClick: true});
                if (e == 'Session Progress') {
                    //document.getElementById("lblSipStatus").innerHTML = 'Session Progress';
                    //document.getElementById("lblStatus").innerHTML = 'Session Progress';
                    $scope.showAlert("Soft Phone", "info", 'Session Progress');
                }
                else if (e.toString().toLowerCase() == 'in call') {
                    /*UIStateChange.inCallConnectedState();*/
                }
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        notificationEvent: function (description) {
            try {
                $scope.$apply(function () {
                    $scope.phoneStatus = description;
                });
                if (description == 'Connected') {
                    /*UIStateChange.inIdleState();*/
                    $scope.PhoneOnline();
                    $scope.isRegistor = true;
                    $scope.showAlert("Soft Phone", "info", description);
                }
                else if (description == 'Forbidden') {
                    console.error(description);
                    $scope.showAlert("Soft Phone", "error", description);
                }
            }
            catch (ex) {
                console.error(ex.message);
            }

        },
        onerrorCallback: function (e) {
            //document.getElementById("lblStatus").innerHTML = e;
            $scope.showAlert("Soft Phone", "error", e);
            console.error(e);
        },
        uiOnConnectionEvent: function (b_connected, b_connecting) {
            try {
                if (!b_connected && !b_connecting) {
                    $scope.isRegistor = false;
                    $scope.PhoneOffline();
                    $scope.showAlert("Soft Phone", "error", "Fail To Register");
                }

                /* document.getElementById("btnCall").disabled = !(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
                 document.getElementById("btnAudioCall").disabled = document.getElementById("btnCall").disabled;
                 document.getElementById("btnHangUp").disabled = !oSipSessionCall;*/
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        uiVideoDisplayShowHide: function (b_show) {
            if (b_show) {
                document.getElementById("divVideo").style.height = '340px';
                document.getElementById("divVideo").style.height = navigator.appName == 'Microsoft Internet Explorer' ? '100%' : '340px';
            }
            else {
                document.getElementById("divVideo").style.height = '0px';
                document.getElementById("divVideo").style.height = '0px';
            }
            //btnFullScreen.disabled = !b_show;
        },
        uiVideoDisplayEvent: function (b_local, b_added) {
            var o_elt_video = b_local ? videoLocal : videoRemote;

            if (b_added) {
                o_elt_video.style.opacity = 1;
                $scope.veeryPhone.uiVideoDisplayShowHide(true);
            }
            else {
                o_elt_video.style.opacity = 0;
                $scope.veeryPhone.fullScreen(false);
            }
        },
        onIncomingCall: function (sRemoteNumber) {
            try {
                /*UIStateChange.inIncomingState();*/
                $scope.call.number = sRemoteNumber;
                $scope.ShowIncomeingNotification(true);
                /*addCallToHistory(sRemoteNumber, 2);*/
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        uiCallTerminated: function (msg) {
            try {

                /* UIStateChange.disableTimer();
                 UIStateChange.inIdleState();*/
                console.log("uiCallTerminated");
                if (window.btnBFCP) window.btnBFCP.disabled = true;


                stopRingbackTone();
                stopRingTone();

                //document.getElementById("lblSipStatus").innerHTML = msg;
                //Notification.info({message: msg, delay: 500, closeOnClick: true});
                $scope.veeryPhone.uiVideoDisplayShowHide(false);
                //document.getElementById("divCallOptions").style.opacity = 0;


                $scope.veeryPhone.uiVideoDisplayEvent(false, false);
                $scope.veeryPhone.uiVideoDisplayEvent(true, false);

                //setTimeout(function () { if (!oSipSessionCall) txtCallStatus.innerHTML = ''; }, 2500);
            }
            catch (ex) {
                console.error(ex.message)
            }
        }

    };

    var userEvent = {
        onSipEventSession: $scope.veeryPhone.onSipEventSession,
        notificationEvent: $scope.veeryPhone.notificationEvent,
        onErrorCallback: $scope.veeryPhone.onErrorCallback,
        uiOnConnectionEvent: $scope.veeryPhone.uiOnConnectionEvent,
        uiVideoDisplayShowHide: $scope.veeryPhone.uiVideoDisplayShowHide,
        uiVideoDisplayEvent: $scope.veeryPhone.uiVideoDisplayEvent,
        onIncomingCall: $scope.veeryPhone.onIncomingCall,
        uiCallTerminated: $scope.veeryPhone.uiCallTerminated
    };

    /*--------------------------Veery Phone---------------------------------------*/

    /*--------------------------      Notification  ---------------------------------------*/
    $scope.agentFound = function (data) {
        var values = data.Message.split("|");
        var notifyData = {
            company: data.Company,
            direction: values[7],
            channelFrom: values[3],
            channelTo: values[5],
            channel: 'Call',
            skill: values[6],
            sessionId: values[1]
        };
        $scope.addTab('Engagement' + values[3], 'Engagement', 'engagement', notifyData);
    };

    $scope.veeryNotification = function () {
        veeryNotification.connectToServer(authService.TokenWithoutBearer(), baseUrls.notification, $scope.agentFound);
    };

    $scope.veeryNotification();


    /*--------------------------      Notification  ---------------------------------------*/

    /*---------------main tab panel----------------------- */

    $scope.tabs = [
        {title: 'A526420-Ticket view', content: 'Engagement1', viewType: 'ticketView'},
        {title: 'A526455-Ticket view', content: 'A526455-Ticket view', viewType: 'engagement'},
        //{title: 'Engagement2', content: 'Engagement2', viewType: 'engagement'},
        // {title: 'Ticket Filter', content: 'Ticket Filter', viewType: 'filter'},
        //{title: 'Mail Inbox', content: 'Mail Inbox', viewType: 'mail-inbox'}
    ];

    $scope.activeTabIndex = 0;
    $scope.tabs = [];

    var data = {
        company: "weweqw",
        direction: "ewq",
        channelFrom: "eqweqw",
        channelTo: "eqw",
        channel: "weweqweqw"
    };

    $scope.addTab = function (title, content, viewType, notificationData) {
        var newTab = {title: title, content: content, viewType: viewType, notificationData: notificationData};
        $scope.tabs.push(newTab);
        $timeout(function () {
            $scope.activeTabIndex = ($scope.tabs.length - 1);
        });

    };


    $scope.addTabTest = function () {
        $scope.addTab('engagement', 'Engagement', 'engagement', {
            company: "123",
            direction: "333",
            channelFrom: "33",
            channelTo: "33",
            channel: "555"
        });
    };


    // load User List
    $scope.users = [];
    $scope.loadUsers = function () {
        userService.LoadUser().then(function (response) {
            $scope.users = response;
        }, function (err) {
            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });
    };
    $scope.loadUsers();

    // load tag List
    $scope.tags = [];
    $scope.loadTags = function () {
        tagService.GetAllTags().then(function (response) {
            $scope.tags = response;
        }, function (err) {
            $scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
        });
    };
    $scope.loadTags();

    $scope.loadTagCategories = function () {
        tagService.GetTagCategories().then(function (response) {
            $scope.tagCategories = response;
        }, function (err) {
            $scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
        });
    };
    $scope.loadTagCategories();

    $scope.reloadTagAndCategories = function () {
        $scope.loadTags();
        $scope.loadTagCategories();
    };

    $scope.addFilterTab = function () {
        $scope.addTab('Ticket Filter', 'Filter', 'filter', {
            company: "123",
            direction: "333",
            channelFrom: "33",
            channelTo: "33",
            channel: "555"
        });
    };
    var addMailInbox = function () {
        $scope.addTab('Mail Inbox', 'Mail Inbox', 'mail-inbox', {
            company: "123",
            direction: "333",
            channelFrom: "33",
            channelTo: "33",
            channel: "555"
        });

    };
    addMailInbox();


    $rootScope.$on('INBOX_NewEngagementTab', function (events, args) {
        var notifyData = {
            company: args.company,
            direction: args.direction,
            channelFrom: args.channel_from,
            channelTo: args.channel_to,
            channel: args.channel,
            skill: '',
            sessionId: args.engagement_id
        };
        $scope.addTab('Engagement' + args.channel_from, 'Engagement', 'engagement', notifyData);


        /*if ($scope.tabs.length > 0) {
         /!*var assigneeData = $filter('filter')($scope.tabs, {
         notificationData._id: args._id
         });*!/
         var isOpened = $scope.tabs.filter(function (item) {
         if (item.notificationData._id == args._id) {
         return true
         }
         else {
         return false
         }
         });

         if (isOpened.length == 0) {
         var tabTopic = "Ticket" + args.reference;
         $scope.addTab(tabTopic, tabTopic, 'ticketView', args);
         }
         }
         else {
         var tabTopic = "Ticket" + args.reference;
         $scope.addTab(tabTopic, tabTopic, 'ticketView', args);
         }
         resizeDiv();
         */
    });


    $rootScope.$on('newTicketTab', function (events, args) {

        var tabTopic = "Ticket - " + args.reference;
        if ($scope.tabs.length > 0) {
            /*var assigneeData = $filter('filter')($scope.tabs, {
             notificationData._id: args._id
             });*/
            var isOpened = $scope.tabs.filter(function (item) {
                if (item.notificationData._id == args._id) {
                    return true
                }
                else {
                    return false
                }
            });

            if (isOpened.length == 0) {

                $scope.addTab(tabTopic, tabTopic, 'ticketView', args);
            }
        }
        else {

            $scope.addTab(tabTopic, tabTopic, 'ticketView', args);
        }
        resizeDiv();

    });

    $rootScope.$on('closeTab', function (events, args) {


        $scope.tabs.filter(function (item) {
            if (item.notificationData._id == args) {

                $scope.tabs.splice($scope.tabs.indexOf(item), 1);

            }

        });


    });

    //nav bar main search box
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

    //###time tracker option
    var _intervalId;
    $scope.status.active = false;
    function init() {
        $scope.counter = "00:00:00";
    }

    init();


    $scope.stopTime = function () {
        $interval.cancel(_intervalId);
        $scope.counter = "00:00:00";
        $scope.status.active = false;
    };
    $scope.pauseTime = function () {
        $interval.pause(_intervalId);
    };

    function updateTime() {
        var seconds = moment().diff(moment($scope.dateStart, 'x'), 'seconds');
        var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
        $scope.counter = elapsed;
    }

    $scope.startTracker = function () {
        //$scope.status.active = true;
        $scope.dateStart = moment().format('x');
        _intervalId = $interval(updateTime, 1000);
        $scope.status.active = true;
    };
    //end time tracker function


    //----------------------SearchBar-----------------------------------------------------

    $scope.searchResult = [];

    $scope.searchExternalUsers = function ($query) {
        return userService.searchExternalUsers($query).then(function (response) {
            if (response.IsSuccess) {
                return response.Result;
            }
            else {
                return [];
            }
        });
    };

    $scope.clearSearchResult = function () {
        $scope.searchResult = [];
    };

    //----------------------------------------------------------------------------------------


    $scope.getMyProfile = function () {


        userService.getMyProfileDetails().then(function (response) {

            if(response.data.IsSuccess)
            {

                myProfileDataParser.myProfile=response.data.Result;
            }
            else
            {

                myProfileDataParser.myProfile={};
            }
        }), function (error) {


            myProfileDataParser.myProfile={};
        }



    };

    $scope.getMyProfile();


});
