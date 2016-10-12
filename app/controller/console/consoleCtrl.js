/**
 * Created by Veery Team on 8/16/2016.
 */

agentApp.controller('consoleCtrl', function ($filter, $rootScope, $scope, $http, $base64, $timeout, jwtHelper, resourceService, baseUrls, dataParser, veeryNotification, authService, userService, tagService, ticketService, mailInboxService, $interval, profileDataParser, loginService, $state, uuid4, notificationService, filterFilter, engagementService, $q) {


    $scope.notifications = [];
    $scope.agentList = [];


    $scope.status = {
        isopen: false
    };

    /*# console top menu */
    $scope.consoleTopMenu = {
        openTicket: function () {
            $('#mainTicketWrapper').addClass(' display-block fadeIn').removeClass('display-none zoomOut');
            if (profileDataParser.isInitiateLoad) {
                profileDataParser.isInitiateLoad = false;
            }
            else {
                $rootScope.$emit('reloadInbox', true);
            }

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
            $('#incomingNotification').addClass('display-block fadeIn').removeClass('display-none zoomOut');
        } else {
            $('#incomingNotification').addClass('display-none fadeIn').removeClass('display-block  zoomOut');
        }
    };

    $scope.ShowHidePhone = function (value) {
        $scope.showPhone = value;
        if (value) {
            // is show phone
            $('#isOperationPhone').addClass('display-block ').removeClass('display-none');
        } else {
            //is hide phone
            $('#isOperationPhone').addClass('display-none ').removeClass('display-block');
        }
    };
    $scope.ShowHidePhone();

    var showHideDialpad = undefined;
    $scope.ShowHideDialpad = function () {
        if (showHideDialpad) {
            // is show phone
            $('#phoneDialpad').addClass('phone-dialpad ').removeClass('display-none');
            showHideDialpad = undefined;
        } else {
            //is hide phone
            $('#phoneDialpad').addClass('display-none ').removeClass('display-block');
            showHideDialpad = {};
        }
    };
    $scope.ShowHideDialpad();

    $scope.PhoneOnline = function () {
        //is loading done
        $('#isLoadingRegPhone').addClass('display-none').removeClass('display-block active-menu-icon ');
        $('#isBtnReg').addClass('display-block active-menu-icon   ').removeClass('display-none  ');
        $scope.ShowHidePhone(true);
    };

    $scope.PhoneOffline = function () {

        $('#isLoadingRegPhone').addClass('display-block').removeClass('display-none');
        $('#isBtnReg').addClass('display-none ').removeClass('display-block active-menu-icon');
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
    $scope.call.number = "";

    $scope.veeryPhone = {
        sipSendDTMF: function (dtmf) {
            sipSendDTMF(dtmf);
            //$scope.call.number = $scope.call.number + dtmf;
        },
        makeCall: function (callNumber, tabReference) {
            $scope.veeryPhone.makeAudioCall(callNumber);

            //  var nos = $filter('filter')(ticket.requester.contacts, {type: 'phone'});

            $scope.tabReference = tabReference;
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
        muteCall: function () {
            /*btnMute.value = bMute ? "Unmute" : "Mute";*/
            if (sipToggleMute()) {
                $('#muteButton').addClass('veery-font-1-muted').removeClass('veery-font-1-mute');
            } else {
                $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
            }
        },
        holdResumeCall: function () {
            var h = sipToggleHoldResume();
            if (h === '0') { //connect
                $('#holdResumeButton').addClass('veery-phone-icon-1-phone-call-1').removeClass('veery-phone-icon-1-phone-call-2');
            }
            else if (h === '1') {//hold
                $('#holdResumeButton').addClass('veery-phone-icon-1-phone-call-2').removeClass('veery-phone-icon-1-phone-call-1');
            } else {
//error
            }
        },
        registerWithArds: function (userProfile) {
            preInit(userEvent, userProfile);
            /*resourceService.RegisterWithArds(userProfile.id, userProfile.veeryFormat).then(function (response) {
             $scope.registerdWithArds = response;
             $scope.userName = userProfile.userName;
             preInit(userEvent, userProfile);// initialize Soft phone

             }, function (error) {
             $scope.showAlert("Soft Phone", "error", "Fail To Register With Resource Server.");
             });*/
        },
        Register: function (userName, password) {
            $scope.PhoneOffline();
            $scope.phoneStatus = "Registering With Servers";


            var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());

            var values = decodeData.context.veeryaccount.contact.split("@");
            $scope.profile.id = decodeData.context.resourceid;
            $scope.profile.displayName = values[0];
            $scope.profile.authorizationName = values[0];
            $scope.profile.publicIdentity = "sip:" + decodeData.context.veeryaccount.contact;//sip:bob@159.203.160.47
            $scope.profile.password = password;
            $scope.profile.server.token = authService.GetToken();
            $scope.profile.server.domain = values[1];
            $scope.profile.server.websocketUrl = "wss://" + values[1] + ":7443";//wss://159.203.160.47:7443
            $scope.profile.server.outboundProxy = "";
            $scope.profile.server.enableRtcwebBreaker = false;
            dataParser.userProfile = $scope.profile;
            if (!decodeData.context.resourceid) {
                $scope.showAlert("Soft Phone", "error", "Fail to Get Resource Information's.");
                return;
            }
            resourceService.GetContactVeeryFormat().then(function (response) {
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

            /*var url = baseUrls.authUrl;
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
             resourceService.GetContactVeeryFormat().then(function (response) {
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
             });*/
        },
        unregisterWithArds: function () {
            resourceService.UnregisterWithArds(authService.GetResourceId()).then(function (response) {
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
                    $scope.startCallTime();
                    phoneFuncion.showHoldButton();
                    phoneFuncion.showMuteButton();
                    phoneFuncion.showEndButton();
                    $scope.ShowIncomeingNotification(false);
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
                phoneFuncion.showEndButton();
                phoneFuncion.hideHoldButton();
                phoneFuncion.hideMuteButton();
                /*addCallToHistory(sRemoteNumber, 2);*/
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        uiCallTerminated: function (msg) {
            try {

                console.log("uiCallTerminated");
                $scope.stopCallTime();
                $scope.ShowIncomeingNotification(false);
                phoneFuncion.hideHoldButton();
                phoneFuncion.hideMuteButton();
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

    var phoneFuncion = {
        showAnswerButton: function () {
            $('#answerButton').addClass('phone-btn ').removeClass('display-none');
        },
        hideAnswerButton: function () {
            $('#answerButton').addClass('display-none ').removeClass('display-block');
        },
        showHoldButton: function () {
            $('#holdResumeButton').addClass('phone-btn ').removeClass('display-none');
            $('#holdResumeButton').addClass('veery-phone-icon-1-phone-call-1').removeClass('veery-phone-icon-1-phone-call-2');
        },
        hideHoldButton: function () {
            $('#holdResumeButton').addClass('display-none ').removeClass('display-block');
        },
        showEndButton: function () {
            $('#endButton').addClass('phone-btn ').removeClass('display-none');
        },
        hideEndButton: function () {
            $('#endButton').addClass('display-none ').removeClass('display-block');
        },
        showMuteButton: function () {
            $('#muteButton').addClass('phone-btn ').removeClass('display-none');
            $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
        },
        hideMuteButton: function () {
            $('#muteButton').addClass('display-none ').removeClass('display-block');
        },
        showSpeakerButton: function () {
            $('#speakerButton').addClass('phone-btn ').removeClass('display-none');
        },
        hideSpeakerButton: function () {
            $('#speakerButton').addClass('display-none ').removeClass('display-block');
        }
    };

    phoneFuncion.hideHoldButton();
    phoneFuncion.hideMuteButton();
    phoneFuncion.hideSpeakerButton();


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


    $('#phoneDialpad input').click(function () {
        var values = $(this).data('values');
        var chr = values[0];
        $scope.call.number = $scope.call.number + chr;
        $scope.veeryPhone.sipSendDTMF(chr)
    });

    //dont remove this code
    /*var prev, $result = $('#result'),
     counter = 0,
     timer;
     $('#phoneDialpad input').click(function () {
     var values = $(this).data('values'),
     result = $result.text();
     if (this == prev) {
     result = result.slice(0, -1);
     counter = values.length == counter + 1 ? 0 : counter + 1;
     } else {
     counter = 0;
     }

     $scope.call.number = $scope.call.number + values[counter];

     prev = this;

     //timer to reset
     clearTimeout(timer)
     timer = setTimeout(function () {
     prev = undefined;
     }, 1000)
     });*/
    /*--------------------------Veery Phone---------------------------------------*/

    /*--------------------------      Notification  ---------------------------------------*/
    $scope.agentFound = function (data) {
        var values = data.Message.split("|");
        var notifyData = {
            company: data.Company,
            direction: values[7],
            channelFrom: values[3],
            channelTo: values[5],
            channel: 'call',
            skill: values[6],
            sessionId: values[1]
        };

        var index = notifyData.sessionId;
        if (notifyData.direction.toLowerCase() === 'outbound') {
            $scope.tabs.filter(function (item) {
                var substring = "-Call" + notifyData.channelFrom;
                if (item.tabReference.indexOf(substring) !== -1) {
                    index = item.tabReference;
                }
            });
        }

        $scope.addTab('Engagement - ' + values[3], 'Engagement', 'engagement', notifyData, index);
        collectSessions(index);
    };


    $scope.unredNotifications = 0;

    $scope.OnMessage = function (data) {
        var objMessage = {
            "id": data.TopicKey,
            "header": data.Message,
            "type": "menu",
            "icon": "main-icon-2-speech-bubble",
            "time": new Date(),
            "read": false
        };
        if (data.TopicKey) {
            var audio = new Audio('assets/sounds/notification-1.mp3');
            audio.play();
            $scope.notifications.unshift(objMessage);
            $('#notificationAlarm').addClass('animated swing');
            $scope.unredNotifications = $scope.getCountOfUnredNotifications()
            setTimeout(function () {
                $('#notificationAlarm').removeClass('animated swing');
            }, 500);
        }
    };

    $scope.readNotification = function (id) {

        var index = -1;
        for (var i = 0, len = $scope.notifications.length; i < len; i++) {
            if ($scope.notifications[i].id === id) {
                index = i;
                break;
            }
        }
        if (index >= 0)
            $scope.notifications.splice(index, 1);
        $scope.unredNotifications = $scope.getCountOfUnredNotifications();
    };


    $scope.getCountOfUnredNotifications = function () {
        return filterFilter($scope.notifications, {read: false}).length;
    };


    var notificationEvent = {
        onAgentFound: $scope.agentFound,
        OnMessageReceived: $scope.OnMessage
    };

    $scope.veeryNotification = function () {
        veeryNotification.connectToServer(authService.TokenWithoutBearer(), baseUrls.notification, notificationEvent);
    };

    $scope.veeryNotification();

    /*--------------------------      Notification  ---------------------------------------*/

    /*---------------main tab panel----------------------- */


    $scope.activeTabIndex = 0;
    $scope.tabReference = "";
    $scope.tabs = [];

    $scope.scrlTabsApi = {};

    $scope.reCalcScroll = function () {
        if ($scope.scrlTabsApi.doRecalculate) {
            $scope.scrlTabsApi.doRecalculate();
        }
    };

    $scope.addTab = function (title, content, viewType, notificationData, index) {

        var isOpened = false;

        var newTab = {
            disabled: false,
            active: true,
            title: title,
            content: content,
            viewType: viewType,
            notificationData: notificationData,
            tabReference: index ? index : uuid4.generate()
        };

        $scope.tabs.filter(function (item) {
            if (item.tabReference == index) {
                isOpened = true;
            }
        });


        if (!isOpened) {
            $scope.tabs.push(newTab);
            $timeout(function () {
                //$scope.tabSelected(newTab.tabReference);
                $scope.activeTabIndex = $scope.tabs.length - 1;
                document.getElementById("tab_view").active = $scope.tabs.length - 1;
                $scope.$broadcast("checkTabs");
                $scope.reCalcScroll();
            });
        }
        else {
            $scope.tabSelected(index);
        }

    };
    $scope.isForceFocused = false;
    $scope.currTab = 0;

    $scope.closeTab = function (title) {

        $scope.tabs.filter(function (item) {
            if (item.title == title) {

                $scope.tabs.splice($scope.tabs.indexOf(item), 1);
                $scope.reCalcScroll();
                $scope.searchExternalUsers = {};
            }

        });

    };

    $scope.isForceFocused = false;
    $scope.currTab = 0;
    $scope.tabSelected = function (tabIndex) {


        $scope.tabs.filter(function (item) {
            if (item.tabReference == tabIndex) {

                currTab = $scope.tabs.indexOf(item);
                $scope.activeTab = item;

                $scope.activeTabIndex = currTab;
                document.getElementById("tab_view").active = currTab;
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

    //load userGroup list
    $scope.userGroups = [];
    $scope.loadUserGroups = function () {
        userService.getUserGroupList().then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.userGroups = response.data.Result;
            }
        }, function (err) {
            $scope.showAlert("Load User Groups", "error", "Fail To Get User Groups.")
        });
    };
    $scope.loadUserGroups();

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
        }, 'ticketFilter');
    };

    var openNewTicketTab = function (ticket, index) {
        var tabTopic = "Ticket - " + ticket.reference;
        $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket, index);
        /*var selectedTabs = $scope.tabs.filter(function (item) {
         return item.notificationData._id == ticket._id;
         });
         if (selectedTabs.length == 0) {

         $scope.addTab(tabTopic, tabTopic, 'ticketView', ticket);
         }
         resizeDiv();*/
    };

    var collectSessions = function (id) {
        if (profileDataParser.RecentEngagements.length >= 10) {
            profileDataParser.RecentEngagements.splice(-1, 1)
        }
        profileDataParser.RecentEngagements.push(id);
    };

    var openNewUserProfileTab = function (profile, index) {
        var engUuid = uuid4.generate();
        var engSessionObj = {
            engagement_id: engUuid,
            channel: "api",
            channel_from: "direct",
            channel_to: "direct",
            direction: "direct",
            has_profile: true
        };
        engagementService.createEngagementSession(profile._id, engSessionObj).then(function (response) {
            if (response) {
                if (response.IsSuccess) {
                    console.log("Create Engagement Session success :: " + response);

                    var notifyData = {
                        company: profile.company,
                        direction: "direct",
                        channelFrom: "direct",
                        channelTo: "direct",
                        channel: "api",
                        skill: '',
                        sessionId: engUuid,
                        userProfile: profile
                    };
                    $scope.addTab('UserProfile ' + profile._id, 'Engagement', 'engagement', notifyData, index);
                    collectSessions(engUuid);
                } else {
                    var errMsg1 = "Create Engagement Session Failed";

                    if (response.CustomMessage) {

                        errMsg1 = response.CustomMessage;

                    }

                    $scope.showAlert('Error', 'error', errMsg1);
                }
            } else {
                var errMsg = "Engagement Session Undefined";
                $scope.showAlert('Error', 'error', errMsg);
            }

        }, function (err) {

            var errMsg = "Create Engagement Session Failed";

            if (err.statusText) {

                errMsg = err.statusText;

            }

            $scope.showAlert('Error', 'error', errMsg);

        });
    };


    $scope.addMailInbox = function () {
        $scope.addTab('mail-inbox', 'mail-inbox', 'mail-inbox', null, 'mailinbox_agentconsole');
        resizeDiv();
    };

    //add dashboard inside tab

    $scope.addDashBoard = function () {
        $scope.addTab('dashboard', 'dashboard', 'dashboard', "dashborad","dashborad");
    };
    $scope.addDashBoard();


    var openNewEngagementTab = function (args, index) {
        var notifyData = {
            company: args.company,
            direction: args.direction,
            channelFrom: args.channel_from,
            channelTo: args.channel_to,
            channel: args.channel,
            skill: '',
            sessionId: args.engagement_id,
            userProfile: undefined
        };
        $scope.addTab('Engagement ' + args.channel_from, 'Engagement', 'engagement', notifyData, index);
    };

    $rootScope.$on('openNewTab', function (events, args) {

        switch (args.tabType) {
            case 'ticketView':
                openNewTicketTab(args, args.index);
                break;
            case 'engagement' || 'userProfile':
                openNewEngagementTab(args, args.index);
                break;
            case 'inbox':
                openEngagementTabForMailReply(args.data, args.index);
                break;
            case 'userProfile':
                openNewUserProfileTab(args, args.index);
                break;
            default:

        }
    });

    $rootScope.$on('closeTab', function (events, args) {
        $scope.tabs.filter(function (item) {
            if (item.notificationData._id == args) {

                $scope.tabs.splice($scope.tabs.indexOf(item), 1);
                $scope.searchExternalUsers = {};

            }

        });
    });


    var openEngagementTabForMailReply = function (args, index) {
        var notifyData = {
            company: args.company,
            direction: args.direction,
            channelFrom: args.channel_from,
            channelTo: args.channel_to,
            channel: args.channel,
            skill: '',
            sessionId: args.engagement_id,
            userProfile: undefined
        };
        $scope.addTab('Engagement' + args.channel_from, 'Engagement', 'engagement', notifyData, index);
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
    $scope.ttimer.pausedTime = {};
    $scope.ttimer.ticketRef = "Start";
    $scope.ttimer.ticket = undefined;

    $scope.openTimerTicket = function(){
        if($scope.ttimer.ticket) {
            $scope.ttimer.ticket.tabType = 'ticketView';
            $scope.ttimer.ticket.index = $scope.ttimer.ticket.reference;
            $rootScope.$emit('openNewTab', $scope.ttimer.ticket);
        }
    };

    $scope.stopTime = function () {
        ticketService.stopTimer($scope.ttimer.trackerId).then(function (response) {
            if (response) {

                document.getElementById('clock-timer').getElementsByTagName('timer')[0].stop();
                $scope.status.active = false;
                $scope.ttimer.active = false;
                $scope.ttimer.pause = false;
                $scope.ttimer.ticketRef = "Start";
                $scope.ttimer.trackerId = undefined;
                $scope.ttimer.ticket = undefined;

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
        ticketService.pauseTimer($scope.ttimer.trackerId).then(function (response) {
            if (response) {

                $scope.ttimer.pause = true;
                $scope.ttimer.pausedTime = moment.utc();
                document.getElementById('clock-timer').getElementsByTagName('timer')[0].stop();

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
                    var timeNow = moment.utc();
                    var timeDiff = timeNow.diff($scope.ttimer.pausedTime, 'seconds');
                    if (timeDiff > 0) {
                        $scope.ttimer.startTime = $scope.ttimer.startTime + (timeDiff * 1000);
                    }

                    document.getElementById('clock-timer').getElementsByTagName('timer')[0].resume();
                    $scope.ttimer.pause = false;
                    $scope.status.active = true;
                    $scope.ttimer.pausedTime = {};

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

                        $scope.ttimer.ticket = $scope.activeTab.notificationData;
                        $scope.ttimer.ticketId = $scope.activeTab.notificationData._id;
                        $scope.ttimer.ticketRef = $scope.activeTab.content;
                        $scope.ttimer.trackerId = response._id;

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


    $scope.checkTimerOnLogin = function(){
        ticketService.getMyTimer().then(function (response) {
            if (response && response.ticket) {
                ticketService.getTicket(response.ticket).then(function (ticketResponse) {

                    if(ticketResponse && ticketResponse.data && ticketResponse.data.IsSuccess) {
                        var ticket = ticketResponse.data.Result;
                        var timeNow = moment.utc();
                        if (response.last_event === "pause" || response.last_event === "start") {

                            var currentTime = Math.ceil(response.time / 1000);
                            if (response.last_event === "pause") {
                                if(currentTime) {
                                    var pauseTime = timeNow.subtract(currentTime, 'seconds');
                                    $scope.ttimer.startTime = parseInt(pauseTime.format('x'));
                                }
                            } else {
                                var lastTimeStamp = moment.utc(response.last_event_date);
                                var timeDiff = timeNow.diff(lastTimeStamp, 'seconds');
                                if(currentTime) {
                                    timeDiff = timeDiff + currentTime;
                                }
                                if (timeDiff > 0) {
                                    var startTime = timeNow.subtract(timeDiff, 'seconds');
                                    $scope.ttimer.startTime = parseInt(startTime.format('x'));
                                } else {
                                    $scope.ttimer.startTime = parseInt(timeNow.format('x'));
                                }
                            }


                            $scope.status.active = true;
                            $scope.ttimer.active = true;

                            $scope.ttimer.ticket = ticket;
                            $scope.ttimer.ticketId = response.ticket;
                            $scope.ttimer.ticketRef = ticket.reference;
                            $scope.ttimer.trackerId = response._id;

                            document.getElementById('clock-timer').getElementsByTagName('timer')[0].start();

                            if (response.last_event === "pause") {
                                $timeout(function () {
                                    $scope.ttimer.pause = true;
                                    $scope.ttimer.pausedTime = moment.utc();
                                    document.getElementById('clock-timer').getElementsByTagName('timer')[0].stop();
                                }, 1000);
                            }
                        }
                    }

                }, function (error) {
                    console.log(error);
                    $scope.showError("Error", "Error", "ok", "Timer failed to load ticket details ");
                });
            }
        }, function (error) {
            console.log(error);
            $scope.showError("Error", "Error", "ok", "Timer failed to start ");
        });
    };
    $scope.checkTimerOnLogin();
    //end time tracker function


    //----------------------SearchBar-----------------------------------------------------
    //Main serch bar option

    $scope.searchText = "";
    $scope.commonSearchQuery = "";
    $scope.searchTabReference = "";
    $scope.states = [{obj: {}, type: "searchKey", value: "#ticket:search:"}, {
        obj: {},
        type: "searchKey",
        value: "#ticket:channel:"
    }, {obj: {}, type: "searchKey", value: "#ticket:groupId:"}, {
        obj: {},
        type: "searchKey",
        value: "#ticket:tid:"
    }, {obj: {}, type: "searchKey", value: "#ticket:priority:"},
        {obj: {}, type: "searchKey", value: "#ticket:reference:"}, {
            obj: {},
            type: "searchKey",
            value: "#ticket:requester:"
        }, {obj: {}, type: "searchKey", value: "#ticket:status:"}, {
            obj: {},
            type: "searchKey",
            value: "#profile:search:"
        }, {
            obj: {},
            type: "searchKey",
            value: "#profile:email:"
        }, {
            obj: {},
            type: "searchKey",
            value: "#profile:firstname:"
        }, {
            obj: {},
            type: "searchKey",
            value: "#profile:lastname:"
        }, {
            obj: {},
            type: "searchKey",
            value: "#profile:phone:"
        }, {
            obj: {},
            type: "searchKey",
            value: "#profile:ssn:"
        }];

    //$scope.searchResult = [];

    $scope.bindSearchData = function (item) {
        if ($scope.searchExternalUsers && $scope.searchExternalUsers.tabReference && item && item.obj && item.type === "profile") {
            console.log("search from engagement");
            var tabItem = {};
            $scope.tabs.filter(function (item) {
                if (item.tabReference == $scope.searchExternalUsers.tabReference) {
                    tabItem = item;
                }
            });

            if (tabItem) {
                tabItem.notificationData.userProfile = item.obj;
                $scope.searchExternalUsers.updateProfileTab(item.obj);
            }

            $scope.searchExternalUsers = {};
            $scope.searchText = "";
        }
        else if (item && item.obj && item.type === "ticket") {
            item.obj.tabType = 'ticketView';
            item.obj.index = item.obj.reference;
            $rootScope.$emit('openNewTab', item.obj);

            $scope.searchText = "";
        } else if (item && item.obj && item.type === "profile") {
            item.obj.tabType = 'userProfile';
            item.obj.index = item.obj._id;
            $rootScope.$emit('openNewTab', item.obj);

            $scope.searchText = "";
        }
    };


    $scope.searchExternalUsers = {};

    function getDefaultState($query) {
        return $q(function (resolve) {
            if ($query) {
                var resultList = [];
                for (var i = 0; i < $scope.states.length; i++) {
                    var state = $scope.states[i];
                    if (state.value.startsWith($query)) {
                        resultList.push(state);
                    }
                }
                resolve(resultList);
            } else {
                resolve($scope.states);
            }
        });
    }


    $scope.commonSearch = function ($query) {
        $scope.commonSearchQuery = $query;
        return getDefaultState($query).then(function (state) {
            if ($query) {
                var searchItems = $query.split(":");
                if (searchItems && searchItems.length > 2) {
                    var queryText = searchItems.pop();
                    var queryPath = searchItems.join(":");
                    if (queryText) {
                        switch (queryPath) {
                            case "#ticket:tid":
                                var queryFiledTid = searchItems.pop();
                                return ticketService.searchTicketByField(queryFiledTid, queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:reference":
                                var queryFiled = searchItems.pop();
                                return ticketService.searchTicketByField(queryFiled, queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:search":
                                return ticketService.searchTicket(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:channel":
                                return ticketService.searchTicketByChannel(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:groupId":
                                return ticketService.searchTicketByGroupId(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:priority":
                                return ticketService.searchTicketByPriority(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:requester":
                                return ticketService.searchTicketByRequester(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#ticket:status":
                                return ticketService.searchTicketByStatus(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#profile:search":
                                return userService.searchExternalUsers(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            //case "#eng:profile:search":
                            //    return userService.searchExternalUsers(queryText).then(function (response) {
                            //        if (response.IsSuccess) {
                            //            var searchResult = [];
                            //            for (var i = 0; i < response.Result.length; i++) {
                            //                var result = response.Result[i];
                            //                searchResult.push({
                            //                    obj: result,
                            //                    type: "profile",
                            //                    value: result.firstname + " " + result.lastname
                            //                });
                            //            }
                            //            return searchResult;
                            //        }
                            //    });
                            //    break;
                            case "#profile:firstname":
                                return userService.getExternalUserProfileByField("firstname", queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#profile:lastname":
                                return userService.getExternalUserProfileByField("lastname", queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#profile:phone":
                                return userService.GetExternalUserProfileByContact("phone", queryText).then(function (response) {
                                    if (response) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.length; i++) {
                                            var result = response[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#profile:email":
                                return userService.GetExternalUserProfileByContact("email", queryText).then(function (response) {
                                    if (response) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.length; i++) {
                                            var result = response[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            case "#profile:ssn":
                                return userService.getExternalUserProfileBySsn(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "profile",
                                                value: result.firstname + " " + result.lastname
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                            default :
                                return ticketService.searchTicketByStatus(queryText).then(function (response) {
                                    if (response.IsSuccess) {
                                        var searchResult = [];
                                        for (var i = 0; i < response.Result.length; i++) {
                                            var result = response.Result[i];
                                            searchResult.push({
                                                obj: result,
                                                type: "ticket",
                                                value: result.tid + ":" + result.subject
                                            });
                                        }
                                        return searchResult;
                                    }
                                });
                                break;
                        }
                    } else {
                        return state;
                    }
                } else {
                    return state;
                }
            } else {
                if(!document.getElementById("commonSearch").value){
                    $scope.searchExternalUsers = {};
                }
                return state;
            }
        });

    };

    $scope.clearSearchResult = function () {
        $scope.searchResult = [];
    };

    //----------------------------------------------------------------------------------------


    var getUnreadMailCounters = function (profileId) {

        try {
            mailInboxService.getMessageCounters(profileId)
                .then(function (data) {
                    if (data.IsSuccess) {
                        if (data.Result && data.Result.UNREAD) {
                            $scope.unreadMailCount = data.Result.UNREAD;
                        }
                    }
                    else {
                        var errMsg = data.CustomMessage;

                        if (data.Exception) {
                            errMsg = data.Exception.Message;
                        }
                        console.log(errMsg);
                    }


                },
                function (err) {
                    console.log(err);

                })

        }
        catch (ex) {
            console.log(ex);

        }

    };

    $scope.getMyProfile = function () {


        userService.getMyProfileDetails().then(function (response) {

            if (response.data.IsSuccess) {

                profileDataParser.myProfile = response.data.Result;
                $scope.loginAvatar = profileDataParser.myProfile.avatar;
                getUnreadMailCounters(profileDataParser.myProfile._id);
            }
            else {

                profileDataParser.myProfile = {};
            }
        }, function (error) {


            profileDataParser.myProfile = {};
        });


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
        $scope.veeryPhone.unregisterWithArds();
        loginService.Logoff(function () {
            $state.go('login');
        });
    };


    $scope.reserveTicketTab = function (key, obj) {

        reservedTicket.key = key;//phone number
        reservedTicket.session_obj = obj;

    };


    //-------------------------------OnlineAgent/ Notification-----------------------------------------------------

    $scope.naviSelectedUser = {};
    $scope.notificationMsg = {};
    var getAllRealTimeTimer = {};

    $scope.showMessageBlock = function (selectedUser) {
        $scope.naviSelectedUser = selectedUser;
        divModel.model('#sendMessage', 'display-block');
    };
    $scope.closeMessage = function () {
        divModel.model('#sendMessage', 'display-none');
    };

    /* Set the width of the side navigation to 250px */

    $scope.isUserListOpen=false;
    $scope.openNav = function () {

        if($scope.isUserListOpen)
        {
            $scope.closeNav();
        }
        else
        {
            getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
            document.getElementById("mySidenav").style.width = "300px";
            document.getElementById("main").style.marginRight = "285px";
        }

        $scope.isUserListOpen=!$scope.isUserListOpen;


        // document.getElementById("navBar").style.marginRight = "300px";
    };


    /* Set the width of the side navigation to 0 */
    $scope.closeNav = function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
        //  document.getElementById("navBar").style.marginRight = "0";
    };

    $scope.sendNotification = function () {
        if ($scope.naviSelectedUser) {

            $scope.notificationMsg.From = $scope.loginName;
            $scope.notificationMsg.Direction = "STATELESS";
            if ($scope.naviSelectedUser.listType === "Group") {
                if ($scope.naviSelectedUser.users) {
                    var clients = [];
                    for (var i = 0; i < $scope.naviSelectedUser.users.length; i++) {
                        var gUser = $scope.naviSelectedUser.users[i];
                        if (gUser && gUser.username && gUser.username != $scope.loginName) {
                            clients.push(gUser.username);
                        }
                    }
                    $scope.notificationMsg.clients = clients;

                    notificationService.broadcastNotification($scope.notificationMsg).then(function (response) {
                        $scope.notificationMsg = {};
                        console.log("send notification success :: " + JSON.stringify(clients));
                    }, function (err) {
                        var errMsg = "Send Notification Failed";
                        if (err.statusText) {
                            errMsg = err.statusText;
                        }
                        $scope.showAlert('Error', 'error', errMsg);
                    });
                } else {
                    $scope.showAlert('Error', 'error', "Send Notification Failed");
                }

            } else {

                $scope.notificationMsg.To = $scope.naviSelectedUser.username;

                notificationService.sendNotification($scope.notificationMsg, "message", "").then(function (response) {
                    console.log("send notification success :: " + $scope.notificationMsg.To);
                    $scope.notificationMsg = {};
                }, function (err) {
                    var errMsg = "Send Notification Failed";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }

        } else {
            $scope.showAlert('Error', 'error', "Send Notification Failed");
        }
    };

    var FilterByID = function (array, field, value) {
        if (array) {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].hasOwnProperty(field)) {
                    if (array[i][field] == value) {
                        return array[i];
                    }
                }
            }
            return null;
        } else {
            return null;
        }
    };

    var loadOnlineAgents = function () {
        resourceService.getOnlineAgentList().then(function (response) {
            if (response.IsSuccess) {
                var onlineAgentList = [];
                var offlineAgentList = [];
                $scope.agentList = [];
                var onlineAgents = response.Result;

                if ($scope.users) {
                    for (var i = 0; i < $scope.users.length; i++) {
                        var user = $scope.users[i];
                        user.listType = "User";

                        if (user.resourceid) {
                            var resource = FilterByID(onlineAgents, "ResourceId", user.resourceid);
                            if (resource) {
                                user.status = resource.Status.State;
                                if (user.status === "NotAvailable") {
                                    offlineAgentList.push(user);
                                } else {
                                    onlineAgentList.push(user);
                                }
                            } else {
                                user.status = "NotAvailable";
                                offlineAgentList.push(user);
                            }
                        } else {
                            user.status = "NotAvailable";
                            offlineAgentList.push(user);
                        }
                    }

                    onlineAgentList.sort(function (a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });
                    offlineAgentList.sort(function (a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });

                    $scope.agentList = onlineAgentList.concat(offlineAgentList);
                }

                if ($scope.userGroups) {
                    var userGroupList = [];

                    for (var j = 0; j < $scope.userGroups.length; j++) {
                        var userGroup = $scope.userGroups[j];

                        userGroup.status = "Available";
                        userGroup.listType = "Group";
                        userGroupList.push(userGroup);
                    }

                    userGroupList.sort(function (a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });

                    $scope.agentList = userGroupList.concat($scope.agentList)
                }
            }
            else {
                var errMsg = response.CustomMessage;

                if (response.Exception) {
                    errMsg = response.Exception.Message;
                }
                $scope.showAlert('Error', 'error', errMsg);
            }
        }, function (err) {
            var errMsg = "Error occurred while loading online agents";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);
        });
    };

    var getAllRealTime = function () {
        loadOnlineAgents();
        getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
    };


    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
    });

    /* update code damith
     ARDS break option */
    var breakList = ['#Available', '#OfficialBreak', '#MealBreak'];
    $scope.breakOption = {
        changeBreakOption: function (requestOption) {
            dataParser.userProfile = $scope.profile;
            breakList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });
            resourceService.BreakRequest(authService.GetResourceId(), requestOption).then(function (res) {
                if (res) {
                    $('#userStatus').addClass('offline').removeClass('online');
                    $scope.showAlert(requestOption, "success", 'update resource state success');
                    $('#' + requestOption).addClass('font-color-green bold');
                }
            }, function (error) {
                $scope.showAlert("Break Request", "error", "Fail To Register With" + requestOption);
            });
        },
        endBreakOption: function () {
            dataParser.userProfile = $scope.profile;
            breakList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });
            resourceService.EndBreakRequest(authService.GetResourceId()).then(function (data) {
                if (data) {
                    $scope.showAlert("Available", "success", "Update resource state success.");
                }
                $('#userStatus').addClass('online').removeClass('offline');
                $('#Available').addClass('font-color-green bold');
            });
        }
    }//end

    //change agent Register status
    $scope.changeRegisterStatus = {
        changeStatus: function (type) {
            dataParser.userProfile = $scope.profile;
            //get veery format
            resourceService.GetContactVeeryFormat().then(function (res) {
                if (res.IsSuccess) {
                    resourceService.ChangeRegisterStatus(authService.GetResourceId(), type, res.Result).then(function (data) {
                        console.log(data);
                    })
                } else {
                    console.log(data);
                }
            }, function (error) {
                $scope.showAlert("Change Register", "error", "Fail To Register..!");
            });
            //
        }
    };//end

    var getCurrentState = (function () {
        return {
            breakState: function () {
                resourceService.GetResourceState(authService.GetResourceId()).then(function (data) {
                    if (data && data.IsSuccess) {
                        if (data.Result.State == "Available") {
                            $('#userStatus').addClass('online').removeClass('offline');
                            $('#Available').addClass('font-color-green bold');
                        } else {
                            $('#userStatus').addClass('offline').removeClass('online');
                            switch (data.Result.Reason) {
                                case 'OfficialBreak' :
                                    $('#OfficialBreak').addClass('font-color-green bold');
                                    break;
                                case 'MealBreak' :
                                    $('#MealBreak').addClass('font-color-green bold');
                                    break;
                            }
                        }
                    }
                }, function (error) {
                    $scope.showAlert("Agent State", "error", "Fail To load get current state..");
                });
            },
            getResourceState: function () {
                resourceService.GetResource(authService.GetResourceId()).then(function (data) {
                    console.log(data);
                }, function (error) {
                    $scope.showAlert("Agent State", "error", "Fail To load get current state..");
                });
            }
        }
    })();
    getCurrentState.breakState();
    getCurrentState.getResourceState();


    // Phone Call Timers
    $scope.counter = 0;
    var callDurationTimeout = {};
    $scope.duations = '';
    $scope.onTimeout = function () {
        $scope.counter++;
        $scope.duations = $scope.counter.toString().toHHMMSS();
        callDurationTimeout = $timeout($scope.onTimeout, 1000);
    };


    $scope.stopCallTime = function () {
        $timeout.cancel(callDurationTimeout);
    };
    $scope.startCallTime = function () {
        $scope.counter = 0;
        callDurationTimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.goToTopScroller = function () {
        $('html, body').animate({scrollTop: 0}, 'fast');
    };


}).directive("mainScroll", function ($window) {
    return function (scope, element, attrs) {
        scope.isFiexedTab = false;
        angular.element($window).bind("scroll", function () {
            if (this.pageYOffset >= 20) {
                scope.isFiexedTab = true;
            } else {
                scope.isFiexedTab = false;
            }
            scope.$apply();
        });
    };
});
