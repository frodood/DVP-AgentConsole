/**
 * Created by Veery Team on 8/16/2016.
 */

agentApp.controller('consoleCtrl', function ($filter, $rootScope, $scope, $http, $base64, $timeout,
                                             jwtHelper, resourceService, baseUrls, dataParser, veeryNotification, authService, userService, tagService, ticketService, mailInboxService, $interval, myProfileDataParser, loginService, $state, uuid4) {

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
    $scope.profile.server.token = authService.TokenWithoutBearer();

    $scope.call = {};
    $scope.call.number = {};

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

                $scope.callStatus = e;
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

                $scope.phoneStatus = description;
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
        onErrorEvent: function (e) {
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

                console.log("uiCallTerminated");
                $scope.ShowIncomeingNotification(false);
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
        onErrorCallback: $scope.veeryPhone.onErrorEvent,
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
        $scope.addTab('Engagement - ' + values[3], 'Engagement', 'engagement', notifyData);
    };

    $scope.veeryNotification = function () {
        veeryNotification.connectToServer(authService.TokenWithoutBearer(), baseUrls.notification, $scope.agentFound);
    };

    $scope.veeryNotification();


    /*--------------------------      Notification  ---------------------------------------*/

    /*---------------main tab panel----------------------- */


    $scope.activeTabIndex = 0;
    $scope.tabs = [];

    var data = {
        company: "weweqw",
        direction: "ewq",
        channelFrom: "eqweqw",
        channelTo: "eqw",
        channel: "weweqweqw"
    };

    $scope.addTab = function (title, content, viewType, notificationData,index) {
        var newTab = {
            disabled: false,
            active: true,
            title: title,
            content: content,
            viewType: viewType,
            notificationData: notificationData,
            tabReference:index
        };

        if($scope.tabs.indexOf(newTab)==-1)
        {
            $scope.tabs.push(newTab);
            $timeout(function () {
                $scope.activeTabIndex = ($scope.tabs.length - 1);
            });
        }
        else
        {
            $scope.tabSelected(newTab.tabReference);
        }




    };

    $scope.tabSelected = function (tabIndex) {

        $scope.tabs.filter(function (item) {
            if (item.tabReference == tabIndex) {

                $scope.activeTab=item;

                $scope.activeTabIndex = $scope.tabs.indexOf(item);
            }

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

    var openNewTicketTab =function (ticket,index){
        var tabTopic = "Ticket - " + ticket.reference;
        $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket,index);
        /*var selectedTabs = $scope.tabs.filter(function (item) {
         return item.notificationData._id == ticket._id;
         });
         if (selectedTabs.length == 0) {

         $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket);
         }
         resizeDiv();*/
    };


    $scope.addMailInbox =function (){
        $scope.addTab('mail-inbox', 'mail-inbox', 'mail-inbox', null);
        resizeDiv();
    };


    var openNewEngagementTab = function(args,index){
        var notifyData = {
            company: args.company,
            direction: args.direction,
            channelFrom: args.channel_from,
            channelTo: args.channel_to,
            channel: args.channel,
            skill: '',
            sessionId: args.engagement_id
        };
        $scope.addTab('Engagement ' + args.channel_from, 'Engagement', 'engagement', notifyData,index);
    };

    $rootScope.$on('openNewTab', function (events, args) {


        var index="";

        if(args.index)
        {
            index=args.index;
        }
        else
        {
            index=uuid4.generate();
        }

        switch (args.tabType) {
            case 'ticketView':
                openNewTicketTab(args,index);
                break;
            case 'engagement':
                openNewEngagementTab(args,index);
                break;
            case 'inbox':
                openEngagementTabForMailReply(args.data);
                break;
            default:

        }
    });

    $rootScope.$on('closeTab', function (events, args) {
        $scope.tabs.filter(function (item) {
            if (item.notificationData._id == args) {

                $scope.tabs.splice($scope.tabs.indexOf(item), 1);

            }

        });
    });


    var openEngagementTabForMailReply = function(args)
    {
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
    };

    /*use Common Method to open New Tab*/
    /*$scope.ticketTabCreater = function (ticket) {

     var tabTopic = "Ticket - " + ticket.reference;
     if ($scope.tabs.length > 0) {

     var isOpened = $scope.tabs.filter(function (item) {
     return item.notificationData._id == ticket._id;
     });

     if (isOpened.length == 0) {

     $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket);
     }
     }
     else {

     $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket);
     }
     resizeDiv();
     };


     $rootScope.$on('newTicketTab', function (events, args) {

     $scope.ticketTabCreater(args);

     });*/


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
    //var _intervalId;
    //$scope.status.active = false;
    //function init() {
    //    $scope.counter = "00:00:00";
    //}
    //
    //init();
    $scope.unreadMailCount = 0;
    $scope.activeTicketTab = {};
    $scope.ttimer = {};
    $scope.ttimer.active = false;
    $scope.ttimer.pause = false;
    $scope.ttimer.startTime = {};
    $scope.ttimer.ticketRef = "Start";

    $scope.stopTime = function () {
        ticketService.stopTimer().then(function (response) {
            if (response) {

                document.getElementById('clock-timer').getElementsByTagName('timer')[0].stop();
                $scope.status.active = false;
                $scope.ttimer.active = false;
                $scope.ttimer.ticketRef = "Start";

            }
            else {
                $scope.showError("Error", "Error", "ok", "Timer failed to stop timer ");
            }
        }, function (error) {
            console.log(error);
            $scope.showError("Error", "Error", "ok", "Timer failed to stop timer ");
        });
    };

    $scope.pauseTime = function () {
        ticketService.pauseTimer().then(function (response) {
            if (response) {

                $scope.ttimer.pause = true;
                document.getElementById('clock-timer').getElementsByTagName('timer')[0].clear();

            }
            else {
                $scope.showError("Error", "Error", "ok", "Timer failed to pause timer ");
            }
        }, function (error) {
            console.log(error);
            $scope.showError("Error", "Error", "ok", "Timer failed to pause timer ");
        });
        //$interval.pauseTime(_intervalId);
    };

    //function updateTime() {
    //    var seconds = moment().diff(moment($scope.dateStart, 'x'), 'seconds');
    //    var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
    //    $scope.counter = elapsed;
    //}

    $scope.startTracker = function () {
        if ($scope.ttimer.pause) {
            ticketService.startTimer().then(function (response) {
                if (response) {

                    document.getElementById('clock-timer').getElementsByTagName('timer')[0].resume();
                    $scope.ttimer.pause = false;
                    $scope.status.active = true;

                }
                else {
                    $scope.showError("Error", "Error", "ok", "Timer failed to resume timer ");
                }
            }, function (error) {
                console.log(error);
                $scope.showError("Error", "Error", "ok", "Timer failed to resume timer ");
            });
        } else {

            if ($scope.activeTab && $scope.activeTab.viewType === "ticketView") {
                ticketService.createTimer($scope.activeTab.notificationData._id).then(function (response) {
                    if (response) {
                        var timeNow = moment.utc();
                        if (response.last_event === "pause" || response.last_event === "start") {
                            var lastTimeStamp = moment.utc(response.last_event_date);
                            var timeDiff = timeNow.diff(lastTimeStamp, 'seconds');

                            if (timeDiff > 0) {
                                var startTime = timeNow.subtract(timeDiff, 'seconds');
                                $scope.ttimer.startTime = parseInt(startTime.format('x'));
                            } else {
                                $scope.ttimer.startTime = parseInt(timeNow.format('x'));
                            }
                        } else {
                            $scope.ttimer.startTime = parseInt(timeNow.format('x'));

                        }

                        $scope.status.active = true;
                        $scope.ttimer.active = true;

                        $scope.ttimer.ticketId = $scope.activeTab.notificationData._id;
                        $scope.ttimer.ticketRef = $scope.activeTab.content;

                        document.getElementById('clock-timer').getElementsByTagName('timer')[0].start();
                    }
                    else {
                        $scope.showError("Error", "Error", "ok", "Timer failed to start ");
                    }
                }, function (error) {
                    console.log(error);
                    $scope.showError("Error", "Error", "ok", "Timer failed to start ");
                });
            }
        }

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


    var getUnreadMailCounters = function(profileId){

        try
        {
            mailInboxService.getMessageCounters(profileId)
                .then(function (data)
                {
                    if (data.IsSuccess)
                    {
                        if(data.Result && data.Result.UNREAD)
                        {
                            $scope.unreadMailCount = data.Result.UNREAD;
                        }
                    }
                    else
                    {
                        var errMsg = data.CustomMessage;

                        if (data.Exception)
                        {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }


                },
                function (err) {
                    console.log(err);

                })

        }
        catch(ex)
        {
            console.log(ex);

        }

    };


    $scope.getMyProfile = function () {


        userService.getMyProfileDetails().then(function (response) {

            if (response.data.IsSuccess) {

                myProfileDataParser.myProfile = response.data.Result;
                $scope.loginAvatar=myProfileDataParser.myProfile.avatar;
                getUnreadMailCounters(myProfileDataParser.myProfile._id);
            }
            else {

                myProfileDataParser.myProfile = {};
            }
        }), function (error) {


            myProfileDataParser.myProfile = {};
        }


    };
    $scope.getMyProfile();

    $scope.loginName = authService.GetResourceIss();


    //Time base create message
    var myDate = new Date();
    /* hour is before noon */
    if (myDate.getHours() < 12) {
        $scope.timeBaseMsg = "Good Morning";
    }
    else  /* Hour is from noon to 5pm (actually to 5:59 pm) */
    if (myDate.getHours() >= 12 && myDate.getHours() <= 17) {
        $scope.timeBaseMsg = "Good Afternoon";
    }
    else  /* the hour is after 5pm, so it is between 6pm and midnight */
    if (myDate.getHours() > 17 && myDate.getHours() <= 24) {
        $scope.timeBaseMsg = "Good Evening";
    }
    else  /* the hour is not between 0 and 24, so something is wrong */
    {
        document.write("I'm not sure what time it is!");
        $scope.timeBaseMsg = "-";
    }

    //logOut
    $scope.logOut = function () {
        loginService.Logoff(function (data) {
            if (data) {
                $state.go('login');
            }
        });
    }


    $scope.reserveTicketTab = function (key, obj) {

        reservedTicket.key = key;//phone number
        reservedTicket.session_obj = obj;

    };




});
