/**
 * Created by Veery Team on 8/16/2016.
 */


agentApp.controller('consoleCtrl', function ($filter, $rootScope, $scope, $http,
                                             $base64, $timeout, $q, $crypto, jwtHelper,
                                             resourceService, baseUrls, dataParser, veeryNotification, authService,
                                             userService, tagService, ticketService, mailInboxService, $interval,
                                             profileDataParser, loginService, $state, uuid4, notificationService,
                                             filterFilter, engagementService, phoneSetting, toDoService, turnServers,
                                             Pubnub, $uibModal, notificationConnector, agentSettingFact, chatService) {


    $scope.isReadyToSpeak = false;
    $scope.sayIt = function (text) {
        if (!$scope.isReadyToSpeak) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
        }
    };

    $scope.usercounts = 0;

    $scope.showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3',
        });
    };


    function startRingTone() {
        try {
            ringtone.play();
        }
        catch (e) {
        }
    }

    function stopRingTone() {
        try {
            ringtone.pause();
        }
        catch (e) {
        }
    }


    $scope.notifications = [];
    $scope.agentList = [];
    $scope.isFreezeReq = false;
    $scope.isEnableSoftPhoneDrag = false;

    //
    $('#softPhoneDragElem').draggable({
        preventCollision: true,
        containment: "window",
        start: function (event, ui) {
            $scope.isEnableSoftPhoneDrag = true;
        },
        stop: function (event, ui) {
        }
    });


    $scope.status = {
        isopen: false
    };

    $scope.countdownVal = 10;
    $scope.GetAcwTime = function () {
        resourceService.GetAcwTime().then(function (response) {
            $scope.countdownVal = parseInt(JSON.parse(response).MaxAfterWorkTime) - 5;
        }, function (err) {
            $scope.countdownVal = 10;
            authService.IsCheckResponse(err);
            $scope.showAlert('Phone', 'error', "Fail To Get ACW Time");
        });
    };
    $scope.GetAcwTime();

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
            $scope.veeryPhone.Register('DuoS123');
            /*if ($scope.isRegistor) {
             $scope.ShowHidePhone(!$scope.showPhone);
             } else {
             $scope.veeryPhone.Register('DuoS123');
             }*/
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
            $('.isOperationPhone').addClass('display-block ').removeClass('display-none');
            $('#softPhone').addClass('display-block ').removeClass('display-none');
        } else {
            //is hide phone
            $('.isOperationPhone').addClass('display-none ').removeClass('display-block');
            $('#softPhone').addClass('display-none ').removeClass('display-block');
        }
    };
    $scope.ShowHidePhone();

    $scope.ShowHideDialpad = function () {

        var $wrapper = $('.dial-pad-wrapper'),
            animateTime = 500,
            height = 310;
        if ($wrapper.height() === 0 || $wrapper.height() === 90 || $wrapper.height() === 88) {
            phoneAnimation.autoHeightAnimate($wrapper, animateTime, height, function (res) {
                if (res) {
                    $('#phoneDialpad').removeClass('display-none').addClass('display-block');
                    disablePin();
                }
            });

        } else {

            $wrapper.stop().animate({height: '90'}, animateTime);
            $('#phoneDialpad').removeClass('display-block').addClass('display-none');
            enablePin();
        }
    };
    // $scope.ShowHideDialpad();

    //update code damith
    $scope.contactList = function () {
        $('#phoneBook').animate({
            left: '0'
        }, 500);
    };

    $scope.PhoneOffline = function () {
        //is loading done
        $('#isLoadingRegPhone').addClass('display-none').removeClass('display-block active-menu-icon');
        $('#isBtnReg').addClass('display-none').removeClass('display-block active-menu-icon');
        $('#isCallOnline').addClass('display-block deactive-menu-icon').removeClass('display-none');
        $('#softPhoneDragElem').addClass('display-none ').removeClass('display-block');
        phoneFuncion.idle();
        $scope.ShowHidePhone(false);
    };

    $scope.PhoneOnline = function () {
        //is loading done
        $('#isLoadingRegPhone').addClass('display-none').removeClass('display-block active-menu-icon');
        $('#isBtnReg').addClass('display-block active-menu-icon').removeClass('display-none');
        $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
        $('#softPhoneDragElem').addClass('display-block').removeClass('display-none ');
        $scope.ShowHidePhone(true);
        phoneFuncion.idle();


    };

    $scope.PhoneLoading = function () {
        $('#isCallOnline').addClass('display-none deactive-menu-icon').removeClass('display-block');
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


    $scope.FreezeAcw = function (callSessionId, endFreeze) {
        resourceService.FreezeAcw(callSessionId, endFreeze).then(function (response) {
            response;
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert('Phone', 'error', "Fail Freeze Operation.");
            return false;
        });
    };

    var timeReset = function () {

    };
    $scope.isRegistor = false;
    $scope.showPhone = false;
    $scope.phoneStatus = "Offline";

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
    $scope.call.skill = "";
    $scope.call.Company = "";
    $scope.call.CompanyNo = "";
    $scope.call.sessionId = "";
    $scope.isAcw = false;
    $scope.freeze = false;
    $scope.inCall = false;
    var autoAnswerTimeTimer = $timeout(timeReset, 0);

    $scope.veeryPhone = {

        sipSendDTMF: function (dtmf) {
            sipSendDTMF(dtmf);
            //$scope.call.number = $scope.call.number + dtmf;
        },
        makeCall: function (callNumber, tabReference) {
            phoneFuncion.updateCallStatus('Dialing');
            $scope.veeryPhone.makeAudioCall(callNumber);

            //  var nos = $filter('filter')(ticket.requester.contacts, {type: 'phone'});

            $scope.tabReference = tabReference;
        },
        makeAudioCall: function (callNumber) {
            if (callNumber == "") {
                return
            }
            sipCall('call-audio', callNumber);
            phoneFuncion.updateCallStatus('Dialing');
            $scope.$broadcast('timer-set-countdown');
        },
        endCall: function () {
            sipHangUp();
            $timeout.cancel(autoAnswerTimeTimer);
        },
        answerCall: function () {
            answerCall();
            $scope.ShowIncomeingNotification(false);
        },
        rejectCall: function () {
            //UIStateChange.inIdleState();
            rejectCall();
            stopRingbackTone();
            stopRingTone();
            $scope.ShowIncomeingNotification(false);
            phoneFuncion.updateCallStatus('');
            $timeout.cancel(autoAnswerTimeTimer);
        },
        etlCall: function () {
            var dtmfSet = phoneSetting.EtlCode.split('');
            angular.forEach(dtmfSet, function (chr) {
                sipSendDTMF(chr);
            });
            phoneFuncion.showTransfer();
            phoneFuncion.showIvrBtn();
            phoneFuncion.hideSwap();
            phoneFuncion.hideEtl();
            phoneFuncion.hideConference();
        },
        swapCall: function () {
            var dtmfSet = phoneSetting.SwapCode.split('');
            angular.forEach(dtmfSet, function (chr) {
                sipSendDTMF(chr);
            });
        },
        conferenceCall: function () {
            var dtmfSet = phoneSetting.ConferenceCode.split('');
            angular.forEach(dtmfSet, function (chr) {
                sipSendDTMF(chr);
            });
        },
        showIvrPenel: function () {

            if ($('#divIvrPad').hasClass('display-none')) {
                phoneFuncion.showIvrList();
            }
            else {
                phoneFuncion.hideIvrList();
            }

        },
        transferCall: function (no) {
            var dtmfSet = no.length < phoneSetting.ExtNumberLength ? phoneSetting.TransferExtCode.split('') : phoneSetting.TransferPhnCode.split('');
            angular.forEach(dtmfSet, function (chr) {
                sipSendDTMF(chr);
            });
            $timeout(function () {
                dtmfSet = no.split('');
                angular.forEach(dtmfSet, function (chr) {
                    sipSendDTMF(chr);
                });
                sipSendDTMF('#');
            }, 1000);
            //phoneFuncion.hideTransfer();
            phoneFuncion.showSwap();
            phoneFuncion.showEtl();
            phoneFuncion.showConference();

        },
        ivrTransferCall: function (no) {
            var dtmfSet = phoneSetting.TransferIvrCode.split('');
            angular.forEach(dtmfSet, function (chr) {
                sipSendDTMF(chr);
            });
            $timeout(function () {
                dtmfSet = no.split('');
                angular.forEach(dtmfSet, function (chr) {
                    sipSendDTMF(chr);
                });
                sipSendDTMF('#');
            }, 1000);
            //phoneFuncion.hideTransfer();
            phoneFuncion.showSwap();
            phoneFuncion.showEtl();
            phoneFuncion.showConference();

        },
        muteCall: function () {
            /*btnMute.value = bMute ? "Unmute" : "Mute";*/
            if (sipToggleMute()) {
                $('#speakerButton').addClass('veery-font-1-muted').removeClass('veery-font-1-microphone');
            } else {
                $('#speakerButton').addClass('veery-font-1-microphone').removeClass('veery-font-1-muted');
            }
        },
        holdResumeCall: function () {
            var h = sipToggleHoldResume();
            if (h === '0') { //connect
                $('#holdResumeButton').addClass('phone-sm-btn phone-sm-bn-p8').removeClass('call-ended');
            }
            else if (h === '1') {//hold
                $('#holdResumeButton').addClass('phone-sm-btn phone-sm-bn-p8 call-ended');
            } else {
//error
            }
        },
        registerWithArds: function (userProfile) {
            sipUnRegister();
            preInit(userEvent, userProfile);
            /*resourceService.RegisterWithArds(userProfile.id, userProfile.veeryFormat).then(function (response) {
             $scope.registerdWithArds = response;
             $scope.userName = userProfile.userName;
             preInit(userEvent, userProfile);// initialize Soft phone

             }, function (error) {
             $scope.showAlert("Soft Phone", "error", "Fail To Register With Resource Server.");
             });*/
            resourceService.MapResourceToVeery($scope.profile.publicIdentity);
        },
        Register: function (password) {
            $scope.PhoneLoading();
            $scope.phoneStatus = "Registering With Servers";
            $scope.isshowRegistor = false;

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
            $scope.profile.server.ice_servers = turnServers;
            $scope.profile.server.outboundProxy = "";
            $scope.profile.server.enableRtcwebBreaker = false;
            dataParser.userProfile = $scope.profile;
            if (!decodeData.context.resourceid) {
                $scope.showAlert("Soft Phone", "error", "Fail to Get Resource Information's.");
                return;
            }

            resourceService.SipUserPassword(values[0]).then(function (reply) {
                var decrypted = $crypto.decrypt(reply, 'DuoS123');
                $scope.profile.password = decrypted;
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
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Soft Phone", "error", "Fail to Communicate with servers");
                });

            }, function (error) {
                authService.IsCheckResponse(error);
                $scope.showAlert("Soft Phone", "error", "Fail to Communicate with servers");
            });


        },
        unregisterWithArds: function () {
            sipUnRegister();

            var resid = authService.GetResourceId();

            if (resid != undefined) {
                resourceService.UnregisterWithArds(resid).then(function (response) {
                    $scope.registerdWithArds = !response;
                }, function (error) {
                    $scope.showAlert("Soft Phone", "error", "Unregister With ARDS Fail");
                });
            }
        },
        fullScreen: function (b_fs) {
            return;
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
                    $scope.inCall = true;
                    stopRingTone();
                    stopRingbackTone();
                    /*UIStateChange.inCallConnectedState();*/
                    phoneFuncion.showHoldButton();
                    phoneFuncion.showSpeakerButton();
                    phoneFuncion.showMuteButton();
                    phoneFuncion.showEndButton();
                    phoneFuncion.showTransfer();
                    phoneFuncion.showIvrBtn();
                    phoneFuncion.hideAnswerButton();
                    phoneFuncion.updateCallStatus('In Call');
                    $scope.ShowIncomeingNotification(false);
                    $scope.startCallTime();

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
                    stopRingTone();
                    /*UIStateChange.inIdleState();*/
                    $scope.PhoneOnline();
                    $scope.isRegistor = true;
                    $scope.showAlert("Soft Phone", "success", description);
                }
                else if (description == 'Forbidden') {
                    $scope.showAlert("Soft Phone", "error", description);
                    console.error(description);
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
                    if (!$scope.isshowRegistor)
                        $scope.showAlert("Soft Phone", "error", "Fail To Register");
                    $scope.isshowRegistor = true;
                }
                $scope.isRegistor = false;
                /* document.getElementById("btnCall").disabled = !(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
                 document.getElementById("btnAudioCall").disabled = document.getElementById("btnCall").disabled;
                 document.getElementById("btnHangUp").disabled = !oSipSessionCall;*/
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        uiVideoDisplayShowHide: function (b_show) {
            return;
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
            return;
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
                if ($scope.isAcw || $scope.freeze) {
                    console.info("Reject Call...........................");
                    rejectCall();
                    return;
                }

                startRingTone();
                /*UIStateChange.inIncomingState();*/
                $scope.call.number = sRemoteNumber;
                $scope.ShowIncomeingNotification(true);
                phoneFuncion.showEndButton();
                phoneFuncion.hideHoldButton();
                phoneFuncion.hideMuteButton();
                /*addCallToHistory(sRemoteNumber, 2);*/
                phoneFuncion.updateCallStatus('Incoming Call');
                $scope.veeryPhone.autoAnswer();
            }
            catch (ex) {
                console.error(ex.message);
            }
        },
        autoAnswer: function () {
            try {
                if ($scope.PhoneConfig) {
                    if ($scope.PhoneConfig.autoAnswer) {
                        var autoAnswerAfterDelay = function () {
                            $timeout.cancel(autoAnswerTimeTimer);
                            this.answerCall();
                        };
                        autoAnswerTimeTimer = $timeout(autoAnswerAfterDelay, $scope.PhoneConfig.autoAnswerDelay);
                    }
                }
            }
            catch (ex) {
                console.log(ex)
            }
        },
        uiCallTerminated: function (msg) {
            try {

                console.log("uiCallTerminated");
                $scope.inCall = false;
                $scope.$broadcast('timer-set-countdown');
                $scope.stopCallTime();
                $scope.ShowIncomeingNotification(false);


                /*phoneFuncion.hideHoldButton();
                 phoneFuncion.hideMuteButton();
                 phoneFuncion.hideSpeakerButton();
                 phoneFuncion.hideSwap();
                 phoneFuncion.hideEtl();
                 phoneFuncion.hideTransfer();
                 phoneFuncion.hideConference();

                 phoneFuncion.updateCallStatus('');*/
                $scope.veeryPhone.StartAcw();
                if (window.btnBFCP) window.btnBFCP.disabled = true;


                stopRingbackTone();
                stopRingTone();

                /* //document.getElementById("lblSipStatus").innerHTML = msg;
                 //Notification.info({message: msg, delay: 500, closeOnClick: true});
                 $scope.veeryPhone.uiVideoDisplayShowHide(false);
                 //document.getElementById("divCallOptions").style.opacity = 0;


                 $scope.veeryPhone.uiVideoDisplayEvent(false, false);
                 $scope.veeryPhone.uiVideoDisplayEvent(true, false);*/


                //setTimeout(function () { if (!oSipSessionCall) txtCallStatus.innerHTML = ''; }, 2500);
            }
            catch (ex) {
                console.log(ex)
            }
        },
        showMoreOption: function () {
            phoneFuncion.showMoreOption();
        },
        hideMoreOption: function () {
            phoneFuncion.hideMoreOption();
        },
        StartAcw: function () {
            phoneFuncion.startAcw();
        },
        StopAcw: function () {
            $scope.isAcw = false;
            $scope.stopCountdownTimmer();
            $('#countdownCalltimmer').addClass('display-none').removeClass('call-duations');
            $('#calltimmer').addClass('call-duations').removeClass('display-none');
            document.getElementById('callStatus').innerHTML = "idle";
        },
        FinishedAcw: function () {
            $scope.isAcw = false;
            phoneFuncion.endAcw();
        },
        freezeAcw: function () {
            if ($scope.freeze) {
                phoneFuncion.endfreezeBtn();
            }
            else {

                phoneFuncion.freezeBtn();
            }
            return false;
        }, showPhoneBook: function () {
            $('#phoneBook').animate({
                left: '0'
            }, 500);
            $('#contactBtnWrp').removeClass('display-none');
            $('#phoneBtnWrapper').addClass('display-none');
        },
        hidePhoneBook: function () {
            $('#phoneBook').animate({
                left: '-235'
            }, 500);
            $('#contactBtnWrp').addClass('display-none');
            $('#phoneBtnWrapper').removeClass('display-none');
        },
    };


    var phoneFuncion = {
        hideAllBtn: function () {
            phoneFuncion.hideAnswerButton();
            phoneFuncion.hideConference();
            phoneFuncion.hideMorebtn();
            phoneFuncion.hideEndButton();
            phoneFuncion.hideEtl();
            phoneFuncion.hideHoldButton();
            phoneFuncion.hideMuteButton();
            phoneFuncion.hideSpeakerButton();
            phoneFuncion.hideSwap();
            phoneFuncion.hideTransfer();
            phoneFuncion.hideIvrBtn();
            phoneFuncion.hideIvrList();
            phoneFuncion.hideDialPad();
            phoneFuncion.hideContactList();
        },
        idle: function () {
            phoneFuncion.showAnswerButton();
            phoneFuncion.showEndButton();
            phoneFuncion.showDialPad();
            phoneFuncion.showContactList();
            phoneFuncion.showMorebtn();
            $scope.freeze = false;
            $scope.isAcw = false;
            $scope.isReadyToSpeak = false;
            phoneFuncion.updateCallStatus('Idle');

            phoneFuncion.hideConference();
            phoneFuncion.hideEtl();
            phoneFuncion.hideTransfer();
            phoneFuncion.hideIvrList();
            phoneFuncion.hideIvrBtn();
            phoneFuncion.hideSwap();
        },
        freezeBtn: function () {
            $scope.isFreezeReq = true;
            $scope.freeze = true;
            $scope.isAcw = false;
            phoneFuncion.updateCallStatus('Freeze');
            $scope.stopCountdownTimmer();
            $('#countdownCalltimmer').addClass('display-none').removeClass('call-duations');
            phoneFuncion.showfreezeRequest();
            resourceService.FreezeAcw($scope.call.sessionId, true).then(function (response) {

                if (response) {
                    $('#calltimmer').addClass('call-duations').removeClass('display-none');
                    $('#freezebtn').addClass('phone-sm-btn veery-font-1-stopwatch-4 show-1-btn').removeClass('display-none');
                    $('#freezeRequest').addClass('display-none').removeClass('call-duations');
                    $scope.startCallTime();
                }
                else {
                    phoneFuncion.hidefreezeRequest();
                }
                $scope.isFreezeReq = false;
            }, function (err) {
                authService.IsCheckResponse(err);
                $scope.showAlert('Phone', 'error', "Fail Freeze Operation.");
                phoneFuncion.hidefreezeRequest();
            });
        },
        endfreezeBtn: function () {

            $scope.freeze = false;
            $scope.stopCallTime();
            phoneFuncion.updateCallStatus('Idle');
            $('#freezebtn').addClass('phone-sm-btn veery-font-1-stopwatch-2 show-1-btn').removeClass('display-none');
            phoneFuncion.idle();
            $scope.FreezeAcw($scope.call.sessionId, false);
        },
        startAcw: function () {
            $scope.isAcw = true;
            $('#calltimmer').addClass('display-none').removeClass('call-duations');
            $('#countdownCalltimmer').addClass('call-duations').removeClass('display-none');
            phoneFuncion.updateCallStatus('ACW');
            $scope.startCountdownTimmer();
            phoneFuncion.hideAllBtn();
            $('#freezebtn').addClass('phone-sm-btn veery-font-1-stopwatch-2 show-1-btn').removeClass('display-none');
        },
        endAcw: function () {
            $scope.stopCountdownTimmer();
            $('#countdownCalltimmer').addClass('display-none').removeClass('call-duations');
            $('#calltimmer').addClass('call-duations').removeClass('display-none');
            document.getElementById('callStatus').innerHTML = "idle";
            $scope.freeze = false;
            $('#freezebtn').addClass('display-none').removeClass('phone-sm-btn veery-font-1-stopwatch-2 show-1-btn');
            //document.getElementById('freeze').innerHTML = "freeze";
            phoneFuncion.idle();
        }
        , showAnswerButton: function () {
            $('#answerButton').addClass('phone-sm-btn answer').removeClass('display-none');
            $('#freezebtn').addClass('display-none').removeClass('phone-sm-btn veery-font-1-stopwatch-2 show-1-btn');
        },
        hideAnswerButton: function () {
            $('#answerButton').addClass('display-none ').removeClass('phone-sm-btn answer');
        },
        showHoldButton: function () {
            $('#holdResumeButton').addClass('phone-sm-btn phone-sm-bn-p8').removeClass('display-none');
            /*$('#holdResumeButton').addClass('phone-sm-btn phone-sm-bn-p8').removeClass('veery-phone-icon-1-phone-call-2');*/
        },
        hideHoldButton: function () {
            $('#holdResumeButton').addClass('display-none ').removeClass('display-inline');
        },
        showEndButton: function () {
            $('#endButton').addClass('phone-sm-btn call-ended').removeClass('display-none');
        },
        hideEndButton: function () {
            $('#endButton').addClass('display-none ');
        },
        showMuteButton: function () {
            $('#muteButton').addClass('phone-btn ').removeClass('display-none');
            $('#muteButton').addClass('veery-font-1-mute').removeClass('veery-font-1-muted');
        },
        hideMuteButton: function () {
            $('#muteButton').addClass('display-none ').removeClass('display-inline');
        },
        showSpeakerButton: function () {
            $('#speakerButton').addClass('veery-font-1-microphone').removeClass('veery-font-1-muted display-none');
        },
        hideSpeakerButton: function () {
            $('#speakerButton').addClass('display-none ');
        },
        updateCallStatus: function (status) {
            $scope.call.status = status;
        },
        hideTransfer: function () {
            $('#transferCall').addClass('display-none').removeClass('display-inline');
            phoneFuncion.hideIvrList();
        },
        showTransfer: function () {
            $('#transferCall').addClass('display-inline').removeClass('display-none');

        },
        showIvrBtn: function () {
            $('#transferIvr').addClass('display-inline').removeClass('display-none');
        },
        hideIvrBtn: function () {
            $('#transferIvr').addClass('display-none').removeClass('display-inline');
        },
        hideSwap: function () {
            // $('#swapCall').addClass('display-none').removeClass('display-inline');
        },
        showSwap: function () {
            /*$('#swapCall').addClass('display-inline').removeClass('display-none');
             $('#slapCall').addClass('display-inline').removeClass('display-none');*/
        },
        hideEtl: function () {
            $('#etlCall').addClass('display-none').removeClass('display-inline');
        },
        showEtl: function () {
            $('#etlCall').addClass('display-inline').removeClass('display-none');
        },
        hideConference: function () {
            $('#conferenceCall').addClass('display-none').removeClass('display-inline');
        },
        showConference: function () {
            $('#conferenceCall').addClass('display-inline').removeClass('display-none');
            phoneFuncion.hideIvrBtn();
        },
        hideDialPad: function () {
            $('#dialPad').addClass('display-none').removeClass('veery-font-1-menu-4');
        },
        showDialPad: function () {
            $('#dialPad').addClass('veery-font-1-menu-4').removeClass('display-none');
        },
        hideMorebtn: function () {
            $('#morebtn').addClass('display-none').removeClass('phone-sm-btn phone-sm-bn-p8 veery-font-1-more');
        },
        showMorebtn: function () {
            $('#morebtn').addClass('phone-sm-btn phone-sm-bn-p8 veery-font-1-more').removeClass('display-none');
        },
        hideContactList: function () {
            $('#contactList').addClass('display-none').removeClass('veery-font-1-user');
        },
        showContactList: function () {
            $('#contactList').addClass('veery-font-1-user').removeClass('display-none');
        },
        showMoreOption: function () {
            $('#onlinePhoneBtnWrapper').removeClass('display-none');
            $('#phoneBtnWrapper').addClass('display-none');
        },
        hideMoreOption: function () {
            $('#phoneBtnWrapper').removeClass('display-none');
            $('#onlinePhoneBtnWrapper').addClass('display-none');
        },

        showfreezeRequest: function () {
            $('#freezeRequest').addClass('call-duations').removeClass('display-none');
        },
        hidefreezeRequest: function () {
            $scope.isFreezeReq = false;
            $('#calltimmer').addClass('call-duations').removeClass('display-none');
            $('#freezebtn').addClass('phone-sm-btn veery-font-1-stopwatch-4 show-1-btn').removeClass('display-none');
            $('#freezeRequest').addClass('display-none').removeClass('call-duations');
            this.idle();
        },
        showIvrList: function () {
            $('#divIvrPad').removeClass('display-none');
            $('#divKeyPad').addClass('display-none');
        },
        hideIvrList: function () {
            $('#divKeyPad').removeClass('display-none');
            $('#divIvrPad').addClass('display-none');
        },

        /*showConnectedBtn: function () {
         //$('#onlinePhoneBtnWrapper').removeClass('display-none');
         $('#phoneBtnWrapper').addClass('display-none');
         },
         hideConnectedBtn: function () {
         $('#phoneBtnWrapper').removeClass('display-none');
         // $('#onlinePhoneBtnWrapper').addClass('display-none');
         },*/
    };

    phoneFuncion.hideHoldButton();
    phoneFuncion.hideMuteButton();
    phoneFuncion.hideSpeakerButton();
    phoneFuncion.updateCallStatus("Dial Number");


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
        var chr = values[0].toString();
        $scope.call.number = $scope.call.number ? $scope.call.number + chr : chr;

        $scope.veeryPhone.sipSendDTMF(chr);
        $scope.$apply();
    });

    $scope.PhoneConfig = {};
    var getPhoneConfig = function () {
        userService.getPhoneConfig().then(function (response) {
            $scope.PhoneConfig = response;
        }, function (error) {

            console.log(error);
            $scope.showAlert("Phone", "error", "Fail To Get Phone Config.");
        });
    };
    getPhoneConfig();


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
        $scope.call.number = notifyData.channelFrom;
        $scope.call.skill = notifyData.skill;
        $scope.call.Company = notifyData.company;
        $scope.call.CompanyNo = notifyData.channelTo;
        $scope.call.sessionId = notifyData.sessionId;

        $scope.sayIt("you are receiving " + values[6] + " call");
        $scope.addTab('Engagement - ' + values[3], 'Engagement', 'engagement', notifyData, index);
        collectSessions(index);

    };


    $scope.unredNotifications = 0;

    $scope.OnMessage = function (data) {

        var senderAvatar;

        if (data.From) {
            if ($filter('filter')($scope.users, {username: data.From})) {
                senderAvatar = $filter('filter')($scope.users, {username: data.From})[0].avatar;
            }
            else if ($filter('filter')($scope.userGroups, {name: data.From})) {
                senderAvatar = $filter('filter')($scope.userGroups, {username: data.From})[0].avatar;
            }


        }

        var objMessage = {
            "id": data.TopicKey,
            "header": data.Message,
            "type": "menu",
            "icon": "main-icon-2-speech-bubble",
            "time": new Date(),
            "read": false,
            "avatar": senderAvatar,
            "from": data.From
        };
        if (data.TopicKey || data.messageType) {
            var audio = new Audio('assets/sounds/notification-1.mp3');
            audio.play();
            $scope.notifications.unshift(objMessage);
            $('#notificationAlarm').addClass('animated swing');
            $scope.unredNotifications = $scope.getCountOfUnredNotifications();
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


    $scope.isSocketRegistered = false;
    $scope.isLoadingNotifiReg = false;


    $scope.agentDisconnected = function () {
        $scope.isSocketRegistered = false;
        $scope.showAlert("Registration failed", "error", "Disconnected from notifications, Please re-register");
        // $('#regNotification').addClass('display-none').removeClass('display-block');
        //$('#regNotificationLoading').addClass('display-none').removeClass('display-block');

    };
    $scope.agentAuthenticated = function () {
        $scope.isSocketRegistered = true;
        $('#regNotificationLoading').addClass('display-none').removeClass('display-block');
        $('#regNotification').addClass('display-block').removeClass('display-none');
        $scope.showAlert("Registration succeeded", "success", "Registered with notifications");
    };


    //#myNote
    $scope.todoRemind = function (data) {
        $scope.myNoteReminder = data;
        $scope.myNoteNotiMe.showMe();
    };


    var notificationEvent = {
        onAgentFound: $scope.agentFound,
        OnMessageReceived: $scope.OnMessage,
        onAgentDisconnected: $scope.agentDisconnected,
        onAgentAuthenticated: $scope.agentAuthenticated,
        onToDoRemind: $scope.todoRemind


    };

    $scope.veeryNotification = function () {
        veeryNotification.connectToServer(authService.TokenWithoutBearer(), baseUrls.notification, notificationEvent);
    };

    $scope.veeryNotification();
    $scope.socketReconnect = function () {
        veeryNotification.reconnectToServer();
    };


    $scope.checkAndRegister = function () {


        if (!$scope.isSocketRegistered) {
            $('#regNotification').addClass('display-none').removeClass('display-block');
            $('#regNotificationLoading').addClass('display-block').removeClass('display-none');
            $scope.isLoadingNotifiReg = true;
            $scope.socketReconnect();
        }

    };


    /*--------------------------      Notification  ---------------------------------------*/

    /*---------------main tab panel----------------------- */


    $scope.activeTabIndex = undefined;
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
                if ($scope.tabs.length === 0) {
                    $scope.activeTabIndex = undefined;
                } else {
                    $scope.activeTabIndex = newTab.tabReference;
                }
                //document.getElementById("tab_view").active = $scope.tabs.length - 1;
                //$scope.$broadcast("checkTabs");
                $scope.reCalcScroll();
            });
            $scope.tabSelected(index);

        }
        else {
            $scope.tabSelected(index);
        }
        $('html, body').animate({scrollTop: 0}, 'fast');
    };
    $scope.isForceFocused = false;
    $scope.currTab = 0;

    $scope.closeTab = function (tab) {

        $scope.tabs.filter(function (item, c) {
            if (item.tabReference == tab.tabReference) {
                //var tIndex = $scope.tabs.indexOf(item);
                //if(tIndex > -1) {
                $scope.tabs.splice(c, 1);

                var nxtIndex = $scope.tabs.length - 1;
                if (nxtIndex > -1) {
                    $scope.activeTabIndex = $scope.tabs[nxtIndex].tabReference;
                    $scope.tabSelected(nxtIndex);
                } else {
                    $scope.activeTabIndex = undefined;
                }
                $scope.reCalcScroll();
                $scope.searchExternalUsers = {};

                //}
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

                $scope.activeTabIndex = item.tabReference;
                //document.getElementById("tab_view").active = currTab;
            }
        });


    };


    // load User List
    $scope.users = [];
    $scope.loadUsers = function () {
        userService.LoadUser().then(function (response) {

            for (var i = 0; i < response.length; i++) {

                response[i].status = 'offline';

            }

            $scope.users = response;
            profileDataParser.assigneeUsers = response;


            $scope.userShowDropDown = 0;

            chatService.Request('pendingall');
            chatService.Request('allstatus');

        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.")
        });
    };
    $scope.loadUsers();

    //load userGroup list
    $scope.userGroups = [];
    $scope.loadUserGroups = function () {
        userService.getUserGroupList().then(function (response) {
            if (response.data && response.data.IsSuccess) {
                for (var j = 0; j < response.data.Result.length; j++) {
                    var userGroup = response.data.Result[j];
                    userGroup.listType = "Group";
                }
                $scope.userGroups = response.data.Result;
                profileDataParser.assigneeUserGroups = response.data.Result;


                //SE.request()
                //chatService.
            }
        }, function (err) {
            authService.IsCheckResponse(err);
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
            authService.IsCheckResponse(err);
            $scope.showAlert("Load Tags", "error", "Fail To Get Tag List.")
        });
    };
    $scope.loadTags();

    $scope.loadTagCategories = function () {
        tagService.GetTagCategories().then(function (response) {
            $scope.tagCategories = response;
        }, function (err) {
            authService.IsCheckResponse(err);
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

        if (profile) {
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
                authService.IsCheckResponse(err);
                var errMsg = "Create Engagement Session Failed";

                if (err.statusText) {

                    errMsg = err.statusText;

                }

                $scope.showAlert('Error', 'error', errMsg);

            });
        } else {
            engagementService.AddEngagementSessionForProfile(engSessionObj).then(function (response) {
                if (response) {
                    if (response.IsSuccess) {
                        console.log("Create Engagement success :: " + response);

                        var notifyData = {
                            company: authService.GetCompanyInfo().company,
                            direction: "direct",
                            channelFrom: "direct",
                            channelTo: "direct",
                            channel: "api",
                            skill: '',
                            sessionId: engUuid,
                            userProfile: profile
                        };
                        $scope.addTab('Create New Profile', 'Engagement', 'engagement', notifyData, index);
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
                authService.IsCheckResponse(err);
                var errMsg = "Create Engagement Session Failed";

                if (err.statusText) {

                    errMsg = err.statusText;

                }

                $scope.showAlert('Error', 'error', errMsg);

            });
        }
    };


    $scope.addMailInbox = function () {
        $scope.addTab('mail-inbox', 'mail-inbox', 'mail-inbox', null, 'mailinbox_agentconsole');
        resizeDiv();
    };

    //add dashboard inside tab
    $scope.addDashBoard = function () {
        $scope.addTab('dashboard', 'dashboard', 'dashboard', "dashborad", "dashborad");
    };
    //add myquick note inside tab
    $scope.addMyNote = function () {
        $scope.addTab('MyNote', 'MyNote', 'MyNote', "MyNote", "MyNote");
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
        $scope.addTab('Engagement ' + args.channel_from, 'Engagement', 'engagement', notifyData, args.engagement_id);
    };

    $rootScope.$on('openNewTab', function (events, args) {

        switch (args.tabType) {
            case 'ticketView':
                openNewTicketTab(args, args.reference);
                break;
            case 'engagement':
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
        $scope.addTab('Engagement' + args.channel_from, 'Engagement', 'engagement', notifyData, args.engagement_id);
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

    $scope.openTimerTicket = function () {
        if ($scope.ttimer.ticket) {
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
                $scope.showAlert("Tracker", "error", "Timer failed to stop timer ");
            }
        }, function (error) {
            authService.IsCheckResponse(error);
            console.log(error);
            $scope.showAlert("Tracker", "error", "Timer failed to stop timer ");
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
                $scope.showAlert("Tracker", "error", "Timer failed to pause timer ");
            }
        }, function (error) {
            authService.IsCheckResponse(err);
            console.log(error);
            $scope.showAlert("Tracker", "error", "Timer failed to pause timer ");
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
                    $scope.showAlert("Tracker", "error", "Timer failed to resume timer ");
                }
            }, function (error) {
                authService.IsCheckResponse(err);
                console.log(error);
                $scope.showAlert("Tracker", "error", "Timer failed to resume timer ");
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
                        $scope.showAlert("Tracker", "error", "Timer failed to start ");
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                    $scope.showAlert("Tracker", "error", "Timer failed to start ");
                });
            }
        }

    };


    $scope.checkTimerOnLogin = function () {
        ticketService.getMyTimer().then(function (response) {
            if (response && response.ticket) {
                ticketService.getTicket(response.ticket).then(function (ticketResponse) {

                    if (ticketResponse && ticketResponse.data && ticketResponse.data.IsSuccess) {
                        var ticket = ticketResponse.data.Result;
                        var timeNow = moment.utc();
                        if (response.last_event === "pause" || response.last_event === "start") {

                            var currentTime = Math.ceil(response.time / 1000);
                            if (response.last_event === "pause") {
                                if (currentTime) {
                                    var pauseTime = timeNow.subtract(currentTime, 'seconds');
                                    $scope.ttimer.startTime = parseInt(pauseTime.format('x'));
                                }
                            } else {
                                var lastTimeStamp = moment.utc(response.last_event_date);
                                var timeDiff = timeNow.diff(lastTimeStamp, 'seconds');
                                if (currentTime) {
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
                    authService.IsCheckResponse(error);
                    console.log(error);
                    $scope.showAlert("Tracker", "error", "Timer failed to load ticket details");
                });
            }
        }, function (error) {
            authService.IsCheckResponse(error);
            console.log(error);
            $scope.showAlert("Tracker", "error", "Timer failed to start");
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
            //$rootScope.$emit('openNewTab', item.obj);
            openNewUserProfileTab(item.obj, item.obj.index);

            $scope.searchText = "";
        }
    };

    $scope.createNewProfile = function () {
        openNewUserProfileTab(undefined, 'createNewProfile');
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
                if (!document.getElementById("commonSearch").value) {
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
                    authService.IsCheckResponse(err);
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
                $scope.firstName = profileDataParser.myProfile.firstname == null ? $scope.loginName : profileDataParser.myProfile.firstname;
                getUnreadMailCounters(profileDataParser.myProfile._id);
            }
            else {
                profileDataParser.myProfile = {};
            }
        }, function (error) {
            authService.IsCheckResponse(error);
            profileDataParser.myProfile = {};
        });
    };
    $scope.getMyProfile();
    $scope.getMyTicketMetaData = function () {

        ticketService.GetMyTicketConfig(function (success, data) {

            if (success) {
                profileDataParser.myTicketMetaData = data.Result;
            }
        });

    };
    $scope.getMyTicketMetaData();

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

        veeryNotification.disconnectFromServer();
        $scope.veeryPhone.unregisterWithArds();
        loginService.Logoff(function () {
            $state.go('login');
            $timeout.cancel(getAllRealTimeTimer);
        });


    };


    $scope.reserveTicketTab = function (key, obj) {

        reservedTicket.key = key;//phone number
        reservedTicket.session_obj = obj;

    };


    //-------------------------------OnlineAgent/ Notification-----------------------------------------------------

    $scope.naviSelectedUser = {};
    $scope.notificationMsg = {};
    var getAllRealTimeTimer = {}


    $scope.setExtention = function (selectedUser) {

        try {
            var extention = selectedUser.veeryaccount.display;
            if (extention) {
                $scope.call.number = extention;
            }
            else {
                $scope.showAlert('Error', 'error', "Fail To Find Extention.");
            }
        }
        catch (ex) {
            $scope.showAlert('Error', 'error', "Fail To Read Agent Data.");
        }
    };
    $scope.closeMessage = function () {
        divModel.model('#sendMessage', 'display-none');
    };

    /* Set the width of the side navigation to 250px */
    $scope.getViewportHeight = function () {
        $scope.windowHeight = jsUpdateSize() - 85 + "px";
        document.getElementById('notificationWrapper').style.height = $scope.windowHeight;
    };
    //Detect Document Height
    //update code damith
    window.onload = function () {
        $scope.windowHeight = jsUpdateSize() - 85 + "px";
        document.getElementById('notificationWrapper').style.height = $scope.windowHeight;
    };

    window.onresize = function () {
        $scope.windowHeight = jsUpdateSize() - 85 + "px";
        document.getElementById('notificationWrapper').style.height = $scope.windowHeight;
    };
    $scope.isUserListOpen = false;
    $scope.navOpen = false;
    $scope.openNav = function () {

        if ($scope.isUserListOpen) {
            $scope.navOpen = false;
            $scope.closeNav();
            chatService.SetChatPosition(false);
        }
        else {
            $scope.getViewportHeight();
            //getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
            document.getElementById("mySidenav").style.width = "230px";
            document.getElementById("main").style.marginRight = "215px";
            chatService.Request('allstatus');
            $scope.onlineClientUser = chatService.GetClientUsers();
            chatService.SetChatPosition(true);


        }


        $scope.isUserListOpen = !$scope.isUserListOpen;


        // document.getElementById("navBar").style.marginRight = "300px";
    };


    /* Set the width of the side navigation to 0 */
    $scope.closeNav = function () {

        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
        //  document.getElementById("navBar").style.marginRight = "0";
    };

    $scope.showNotificationView = function (currentUsr, userType) {
        $scope.naviSelectedUser = {};
        $scope.naviSelectedUser = currentUsr;
        $scope.naviSelectedUser.listType = userType;
        $('#uNotifiWrp').animate({bottom: '34'}, 400, function () {
            //hedaer animation
            $('#uNotiH').toggle("slide", {direction: "left"});
        });
        if (userType == "Group") {
            $scope.naviSelectedUser.avatar = "assets/img/avatar/profileAvatar.png";
        }
    };
    $scope.closeNotificationView = function () {
        $('#uNotifiWrp').animate({bottom: '-245'}, 300);
    };

    $scope.isSendingNotifi = false;
    $scope.sendNotification = function () {
        if ($scope.naviSelectedUser) {
            $scope.notificationMsg.From = $scope.loginName;
            $scope.notificationMsg.Direction = "STATELESS";
            $scope.isSendingNotifi = true;
            if ($scope.naviSelectedUser.listType === "Group") {

                userService.getGroupMembers($scope.naviSelectedUser._id).then(function (response) {
                    if (response.IsSuccess) {
                        if (response.Result) {
                            var clients = [];
                            for (var i = 0; i < response.Result.length; i++) {
                                var gUser = response.Result[i];
                                //if (gUser && gUser.username && gUser.username != $scope.loginName) {
                                clients.push(gUser.username);
                                //}
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
                    }
                    else {
                        console.log("Error in loading Group member list");
                        $scope.showAlert('Error', 'error', "Send Notification Failed");
                    }
                    $scope.isSendingNotifi = false;
                }, function (err) {
                    console.log("Error in loading Group member list ", err);
                    $scope.showAlert('Error', 'error', "Send Notification Failed");
                });
            } else {
                $scope.notificationMsg.To = $scope.naviSelectedUser.username;
                notificationService.sendNotification($scope.notificationMsg, "message", "").then(function (response) {
                    console.log("send notification success :: " + $scope.notificationMsg.To);
                    $scope.notificationMsg = {};
                }, function (err) {
                    authService.IsCheckResponse(err);
                    var errMsg = "Send Notification Failed";
                    if (err.statusText) {
                        errMsg = err.statusText;
                    }
                    $scope.showAlert('Error', 'error', errMsg);
                });
            }
            $scope.isSendingNotifi = false;

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

    $scope.loadOnlineAgents = function () {
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
                            if (user.resourceid != authService.GetResourceId()) {
                                var resource = FilterByID(onlineAgents, "ResourceId", user.resourceid);
                                if (resource) {
                                    user.status = resource.Status.State;
                                    user.ConcurrencyInfo = resource.ConcurrencyInfo;
                                    if (user.status === "NotAvailable") {
                                        offlineAgentList.push(user);
                                    } else {
                                        onlineAgentList.push(user);
                                    }
                                } else {
                                    user.status = "NotAvailable";
                                    offlineAgentList.push(user);
                                }
                            }

                        } else {
                            user.status = "NotAvailable";
                            offlineAgentList.push(user);
                        }


                    }

                    onlineAgentList.sort(function (a, b) {
                        if (a && a.name && b && b.name && a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a && a.name && b && b.name && a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });
                    offlineAgentList.sort(function (a, b) {
                        if (a && a.name && b && b.name && a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a && a.name && b && b.name && a.name.toLowerCase() > b.name.toLowerCase()) return 1;
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
                        if (a && a.name && b && b.name && a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if (a && a.name && b && b.name && a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });

                    // $scope.agentList = userGroupList.concat($scope.agentList)
                    $scope.userGroups = userGroupList;
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
            authService.IsCheckResponse(err);
            var errMsg = "Error occurred while loading online agents";
            if (err.statusText) {
                errMsg = err.statusText;
            }
            $scope.showAlert('Error', 'error', errMsg);
        });
    };

    //$scope.loadOnlineAgents();

    var getAllRealTime = function () {
        loadOnlineAgents();
        getAllRealTimeTimer = $timeout(getAllRealTime, 1000);
    };


    $scope.$on("$destroy", function () {
        if (getAllRealTimeTimer) {
            $timeout.cancel(getAllRealTimeTimer);
        }
        $scope.veeryPhone.unregisterWithArds();
    });

    /* update code damith
     lock screen
     ARDS break option */
    var changeLockScreenView = function () {
        return {
            show: function () {
                $('#loginScreeen').removeClass('display-none').addClass('display-block');
                $('body').addClass('overflow-hidden');
                document.getElementById("lockPwd").value = "";
                $scope.lockPwd = "";
            },
            hide: function () {
                $('#loginScreeen').addClass('display-none').removeClass('display-block');
                $('body').removeClass('overflow-hidden');
                $scope.lockPwd = '';

            }
        }
    }();

    $scope.currentBerekOption = null;
    var breakList = ['#Available'];


    //--------------------------Dynamic Break Type-------------------------------------------------

    $scope.dynamicBreakTypes = [];
    $scope.getDynamicBreakTypes = function () {

        resourceService.GetActiveDynamicBreakTypes().then(function (data) {
            if (data && data.IsSuccess) {
                data.Result.forEach(function (bObj) {
                    breakList.push('#' + bObj.BreakType)
                });
                $scope.dynamicBreakTypes = data.Result;

            } else {
                $scope.showAlert("Dynamic Break Types", "error", "Fail To load dynamic break types");
            }
        }, function (error) {
            authService.IsCheckResponse(error);
            $scope.showAlert("Dynamic Break Types", "error", "Fail To load dynamic break types");
        });
    };
    $scope.getDynamicBreakTypes();


    $scope.breakOption = {
        changeBreakOption: function (requestOption) {
            $('#loginScreeen').removeClass('display-none').addClass('display-block');
            $('body').addClass('overflow-hidden');
            dataParser.userProfile = $scope.profile;
            breakList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });

            $scope.breakTimeStart = moment.utc();
            document.getElementById('lockTime').getElementsByTagName('timer')[0].resume();

            resourceService.BreakRequest(authService.GetResourceId(), requestOption).then(function (res) {
                if (res) {
                    $('#userStatus').addClass('offline').removeClass('online');
                    $scope.showAlert(requestOption, "success", 'update resource state success');
                    $('#' + requestOption).addClass('font-color-green bold');
                    $scope.currentBerekOption = requestOption;
                }
            }, function (error) {
                authService.IsCheckResponse(error);
                $scope.showAlert("Break Request", "error", "Fail To Register With" + requestOption);
            });
        },
        endBreakOption: function (requestOption) {
            dataParser.userProfile = $scope.profile;
            breakList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });
            resourceService.EndBreakRequest(authService.GetResourceId(), 'EndBreak').then(function (data) {
                if (data) {
                    $scope.showAlert("Available", "success", "Update resource state success.");
                    $('#userStatus').addClass('online').removeClass('offline');
                    $('#Available').addClass('font-color-green bold');
                    $scope.currentBerekOption = requestOption;
                    // getCurrentState.breakState();
                    changeLockScreenView.hide();
                    $scope.isUnlock = false;
                    return;
                }
            });
        }
    };//end


    $scope.currentModeOption = null;
    var modeList = ['#Inbound', '#Outbound'];
    $scope.modeOption = {
        outboundOption: function (requestOption) {
            console.log(requestOption);
            dataParser.userProfile = $scope.profile;
            modeList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });
            resourceService.BreakRequest(authService.GetResourceId(), requestOption).then(function (res) {
                if (res) {
                    $('#userStatus').addClass('offline').removeClass('online');
                    $scope.showAlert(requestOption, "success", 'update resource state success');
                    $('#' + requestOption).addClass('font-color-green bold');
                    $scope.currentModeOption = requestOption;
                }
            }, function (error) {
                authService.IsCheckResponse(error);
                $scope.showAlert("Break Request", "error", "Fail To Register With" + requestOption);
            });
        },
        inboundOption: function (requestOption) {
            dataParser.userProfile = $scope.profile;
            modeList.forEach(function (option) {
                $(option).removeClass('font-color-green bold');
            });
            resourceService.EndBreakRequest(authService.GetResourceId(), requestOption).then(function (data) {
                if (data) {
                    $scope.showAlert("Available", "success", "Update resource state success.");
                    $('#userStatus').addClass('online').removeClass('offline');
                    $('#Inbound').addClass('font-color-green bold');
                    $scope.currentModeOption = requestOption;
                    // getCurrentState.breakState();
                    //changeLockScreenView.hide();
                    //$scope.isUnlock = false;
                    //return;
                }
            });
        }
    };//end

    //change agent Register status
    $scope.changeRegisterStatus = {
        changeStatus: function (type) {
            dataParser.userProfile = $scope.profile;
            //is check current reg resource task
            for (var i = 0; i < $scope.resourceTaskObj.length; i++) {
                if ($scope.resourceTaskObj[i].RegTask == type) {
                    //remove resource sharing
                    getCurrentState.removeSharing(type, i);
                    return;
                }
            }
            ;

            //get veery format
            resourceService.GetContactVeeryFormat().then(function (res) {
                if (res.IsSuccess) {
                    resourceService.ChangeRegisterStatus(authService.GetResourceId(), type, res.Result).then(function (data) {
                        getCurrentState.getCurrentRegisterTask();
                        getCurrentState.breakState();
                        $scope.showAlert("Change Register", "success", "Register resource info success.");
                    })
                } else {
                    console.log(data);
                }
            }, function (error) {
                authService.IsCheckResponse(error);
                $scope.showAlert("Change Register", "error", "Fail To Register..!");
            });
            //
        }
    };//end

    $scope.resourceTaskObj = [];
    $scope.breakTimeStart = 0;
    var getCurrentState = (function () {
        return {
            breakState: function () {
                resourceService.GetResourceState(authService.GetResourceId()).then(function (data) {
                    if (data && data.IsSuccess) {
                        if (data.Result.State == "Available") {
                            $scope.currentBerekOption = "Available";
                            $('#userStatus').addClass('online').removeClass('offline');
                            $('#Available').addClass('font-color-green bold');
                            changeLockScreenView.hide();
                        } else {
                            $('#userStatus').addClass('offline').removeClass('online');
                            var timeDiff = 0,
                                timeNow,
                                breakTime,
                                startTime;

                            if (data.Result.Reason && data.Result.StateChangeTime && data.Result.Reason.toLowerCase().indexOf('break') > -1) {
                                timeNow = moment.utc();
                                breakTime = moment.utc(data.Result.StateChangeTime);
                                timeDiff = timeNow.diff(breakTime, 'seconds');
                                startTime = timeNow.subtract(timeDiff, 'seconds');

                                var cssValue = '#' + data.Result.Reason;
                                $(cssValue).addClass('font-color-green bold');
                                $scope.currentBerekOption = data.Result.Reason;
                                //StateChangeTime
                                //StateChangeTime
                                if (timeDiff > 0) {
                                    $scope.breakTimeStart = parseInt(startTime.format('x'));
                                } else {
                                    $scope.breakTimeStart = moment.utc();
                                }
                                document.getElementById('lockTime').getElementsByTagName('timer')[0].resume();
                                changeLockScreenView.show();
                            }
                        }


                        if (data.Result.Mode === "Outbound") {
                            $('#userStatus').addClass('offline').removeClass('online');
                            $('#Outbound').addClass('font-color-green bold');
                            $scope.currentModeOption = "Outbound";
                            return;
                        } else {
                            $('#userStatus').addClass('online').removeClass('offline');
                            $('#Inbound').addClass('font-color-green bold');
                            $scope.currentModeOption = "Inbound";
                            return;
                        }
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Agent State", "error", "Fail To load get current state..");
                });
            },
            getResourceState: function () {
                resourceService.GetResource(authService.GetResourceId()).then(function (data) {
                    console.log(data);
                }, function (error) {
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Agent State", "error", "Fail To load get current state..");
                });
            },
            getResourceTasks: function () {
                resourceService.GetResourceTasks(authService.GetResourceId()).then(function (data) {
                    if (data && data.IsSuccess) {
                        data.Result.forEach(function (value, key) {
                            // $scope.resourceTaskObj = [];
                            if (data.Result[key].ResTask) {
                                if (data.Result[key].ResTask.ResTaskInfo) {
                                    if (data.Result[key].ResTask.ResTaskInfo.TaskName) {
                                        $scope.resourceTaskObj.push({
                                            'task': data.Result[key].ResTask.ResTaskInfo.TaskName,
                                            'RegTask': null
                                        });
                                    }
                                }
                            }
                        });
                        getCurrentState.getCurrentRegisterTask();
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Agent Task", "error", "Fail To load get resource task list.");
                });
            },
            getCurrentRegisterTask: function () {
                resourceService.GetCurrentRegisterTask(authService.GetResourceId()).then(function (data) {
                    if (data && data.IsSuccess) {
                        if (data.Result) {
                            if (data.Result.obj) {
                                if (data.Result.obj.LoginTasks) {
                                    for (var i = 0; i < $scope.resourceTaskObj.length; i++) {
                                        data.Result.obj.LoginTasks.forEach(function (value, key) {
                                            if ($scope.resourceTaskObj[i].task == data.Result.obj.LoginTasks[key]) {
                                                $scope.resourceTaskObj[i].RegTask = data.Result.obj.LoginTasks[key];
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Agent Task", "error", "Fail To load get register task.");
                });
            },
            removeSharing: function (type, index) {
                resourceService.RemoveSharing(authService.GetResourceId(), type).then(function (data) {
                    if (data && data.IsSuccess) {
                        $scope.resourceTaskObj[index].RegTask = null;
                        // getCurrentState.getCurrentRegisterTask();
                        $scope.showAlert("Agent Task", "success", "Delete resource info success.");
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    $scope.showAlert("Agent Task", "error", "Fail To remove sharing resource.");
                });
            }
        }
    })();

    getCurrentState.breakState();
    getCurrentState.getResourceState();
    getCurrentState.getResourceTasks();


    $scope.clickRefTask = function () {
        $scope.resourceTaskObj = [];
        getCurrentState.getResourceTasks();
        // getCurrentState.getCurrentRegisterTask();
    };


    // Phone Call Timers
    $scope.counter = 0;
    var callDurationTimeout = {};
    $scope.duations = '';


    $scope.stopCallTime = function () {
        try {
            document.getElementById('calltimmer').getElementsByTagName('timer')[0].stop();
        }
        catch (ex) {

        }

    };
    $scope.startCallTime = function () {
        try {
            document.getElementById('calltimmer').getElementsByTagName('timer')[0].start();
        }
        catch (ex) {

        }
    };

    $scope.stopCountdownTimmer = function () {
        try {
            document.getElementById('countdownCalltimmer').getElementsByTagName('timer')[0].stop();
        }
        catch (ex) {

        }

    };
    $scope.startCountdownTimmer = function () {
        try {
            document.getElementById('countdownCalltimmer').getElementsByTagName('timer')[0].start();
        }
        catch (ex) {

        }
    };

    $scope.goToTopScroller = function () {
        $('html, body').animate({scrollTop: 0}, 'fast');
    };


    $scope.showMesssageModal = false;

    $scope.showNotificationMessage = function (notifyMessage) {
        $scope.showMesssageModal = true;
        $scope.showModal(notifyMessage);
    };


    $scope.discardNotifications = function (notifyMessage) {
        $scope.notifications.splice($scope.notifications.indexOf(notifyMessage), 1);
        $scope.unredNotifications = $scope.notifications.length;
        $scope.showMesssageModal = false;
    };

    $scope.addToDoList = function (todoMessage) {
        todoMessage.title = todoMessage.header;
        toDoService.addNewToDo(todoMessage).then(function (response) {
            $scope.discardNotifications(todoMessage);
            $scope.showAlert("Added to ToDo", "success", "Notification successfully added as To Do");
            $scope.showMesssageModal = false;
        }, function (error) {
            authService.IsCheckResponse(error);
            $scope.showAlert("Adding failed ", "error", "Notification is failed to add as To Do");
        });
    };

    $scope.showModal = function (MessageObj) {
        $scope.MessageObj = MessageObj;
    };

    $scope.keepNotification = function () {
        //$uibModalInstance.dismiss('cancel');
        $scope.showMesssageModal = false;
    };
    $scope.discardNotification = function (msgObj) {
        $scope.discardNotifications(msgObj);
        $scope.showMesssageModal = false;
        // $uibModalInstance.dismiss('cancel');
    };
    $scope.addToTodo = function (MessageData) {
        $scope.addToDoList(MessageData);
        $scope.showMesssageModal = false;
        //$uibModalInstance.dismiss('cancel');
    };


    $scope.myNoteNotiMe = function () {
        var timeoutNotiMe = function () {
            $timeout(function () {
                $scope.myNoteNotiMe.hideMe();
            }, 200000);
        };
        return {
            showMe: function () {
                $('#myNoteShow').animate({
                    top: "69"
                });
                timeoutNotiMe();
            },
            hideMe: function () {
                $('#myNoteShow').animate({
                    top: "-92"
                })
            }
        }
    }();


    //#------ Update code Damith
    // Break screen functions
    $scope.lockPwd = null;
    $scope.isUnlock = false;
    $scope.breakScreen = function () {
        var param = {
            userName: $scope.loginName,
            password: ''
        };
        return {
            unlock: function () {
                var pwd = document.getElementById("lockPwd").value;
                if (!pwd) {
                    $scope.showAlert('Error', 'error', 'Invalid authentication..');
                    $('#lockPwd').addClass('shake');
                    $('#lockPwd').addClass('shake');
                    return;
                }
                param.password = pwd;
                $scope.isUnlock = true;
                loginService.VerifyPwd(param, function (res) {
                    if (res) {
                        $scope.lockPwd = "";
                        document.getElementById("lockPwd").value = "";
                        $scope.breakOption.endBreakOption('Available');
                    } else {
                        $scope.lockPwd = "";
                        $scope.showAlert('Error', 'error', 'Invalid authentication..');
                        $('#lockPwd').addClass('shake');
                        $('#lockPwd').addClass('shake');
                        changeLockScreenView.show();
                    }
                    $scope.isUnlock = false;
                    return;
                });
            }
        }
    }();

    //text key event fire
    $scope.enterUnlockMe = function () {
        alert('event fire');
    };
    var buildFormSchema = function (schema, form, fields) {
        fields.forEach(function (fieldItem) {
            if (fieldItem.field) {
                var isActive = true;
                if (fieldItem.active === false) {
                    isActive = false;
                }
                if (fieldItem.type === 'text') {
                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };
                    form.push({
                        "key": fieldItem.field,
                        "type": "text"
                    })
                }
                else if (fieldItem.type === 'textarea') {

                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "textarea"
                    })
                }
                else if (fieldItem.type === 'url') {

                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "text"
                    })
                }
                else if (fieldItem.type === 'header') {
                    var h2Tag = '<h2>' + fieldItem.title + '</h2>';
                    form.push({
                        "type": "help",
                        "helpvalue": h2Tag
                    });
                }
                else if (fieldItem.type === 'radio') {
                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    var formObj = {
                        "key": fieldItem.field,
                        "type": "radios-inline",
                        "titleMap": []
                    };


                    if (fieldItem.values && fieldItem.values.length > 0) {

                        schema.properties[fieldItem.field].enum = [];

                        fieldItem.values.forEach(function (enumVal) {
                            schema.properties[fieldItem.field].enum.push(enumVal.name);
                            formObj.titleMap.push(
                                {
                                    "value": enumVal.id,
                                    "name": enumVal.name
                                }
                            )
                        })

                    }

                    form.push(formObj);
                }
                else if (fieldItem.type === 'date') {

                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive,
                        format: 'date'

                    };

                    form.push({
                        "key": fieldItem.field,
                        "minDate": "1900-01-01"
                    })
                }
                else if (fieldItem.type === 'number') {

                    schema.properties[fieldItem.field] = {
                        type: 'number',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "number"
                    })
                }
                else if (fieldItem.type === 'phone') {

                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        pattern: "^[0-9*#+]+$",
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "text"
                    })
                }
                else if (fieldItem.type === 'boolean' || fieldItem.type === 'checkbox') {

                    schema.properties[fieldItem.field] = {
                        type: 'boolean',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "checkbox"
                    })
                }
                else if (fieldItem.type === 'checkboxes') {

                    schema.properties[fieldItem.field] = {
                        type: 'array',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive,
                        items: {
                            type: "string",
                            enum: []
                        }
                    };

                    if (fieldItem.values && fieldItem.values.length > 0) {

                        fieldItem.values.forEach(function (enumVal) {
                            schema.properties[fieldItem.field].items.enum.push(enumVal.name);
                        })

                    }

                    form.push(fieldItem.field);
                }
                else if (fieldItem.type === 'email') {

                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        description: fieldItem.description,
                        pattern: "^\\S+@\\S+$",
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    form.push({
                        "key": fieldItem.field,
                        "type": "text"
                    })
                }
                else if (fieldItem.type === 'select') {
                    schema.properties[fieldItem.field] = {
                        type: 'string',
                        title: fieldItem.title,
                        required: fieldItem.require ? true : false,
                        readonly: !isActive

                    };

                    var formObj = {
                        "key": fieldItem.field,
                        "type": "select",
                        "titleMap": []
                    };

                    if (fieldItem.values && fieldItem.values.length > 0) {

                        schema.properties[fieldItem.field].enum = [];

                        fieldItem.values.forEach(function (enumVal) {
                            schema.properties[fieldItem.field].enum.push(enumVal.name);
                            formObj.titleMap.push(
                                {
                                    "value": enumVal.id,
                                    "name": enumVal.name
                                });
                        })

                    }
                    form.push(formObj);
                }
            }
        });

        return schema;
    };

    $scope.schemaResponse = {};
    $scope.createTicketDynamicFrm = function () {
        var schema = {
            type: "object",
            properties: {}
        };

        var form = [];


        ticketService.getFormsForCompany().then(function (response) {
            if (response && response.Result && response.Result.ticket_form) {
                //compare two forms
                buildFormSchema(schema, form, response.Result.ticket_form.fields);
                var currentForm = response.Result.ticket_form;

                /*form.push({
                 type: "submit",
                 title: "Save"
                 });*/

                $scope.schemaResponse = {
                    schema: schema,
                    form: form,
                    model: {},
                    currentForm: currentForm
                };
            }
        }).catch(function (err) {
            $scope.showAlert('Ticket', 'error', 'Fail To Get Ticket Dynamic form Data');
        });
    };
    $scope.createTicketDynamicFrm();

    $scope.ivrlist = [];
    var ivrlist = function () {
        resourceService.IvrList().then(function (reply) {
            $scope.ivrlist = reply;
        }, function (error) {
            $scope.showAlert("Soft Phone", "error", "Fail to Get IVR List");
        });
    };
    ivrlist();

    $scope.setIvrExtension = function (ivr) {
        $scope.call.number = ivr.Extension;
        phoneFuncion.hideIvrBtn();
        phoneFuncion.hideIvrList();
        $scope.veeryPhone.ivrTransferCall(ivr.Extension);
    };

    //open setting page
    $scope.openSettingPage = function () {
        agentSettingFact.changeSettingPageStatus(true);
    };


    /*--------------- chat services ------------------->
     /* update code by damith */
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };


    $scope.getChatRandomId = function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    chatService.connectToChatServer();
    chatService.SubscribeStatus(function (status) {
        if (status) {
            Object.keys(status).forEach(function (key, index) {
                var userObj = $scope.users.filter(function (item) {
                    return key == item.username;
                });
                if (Array.isArray(userObj)) {
                    userObj.forEach(function (obj, index) {
                        obj.status = status[key];
                        obj.statusTime = Date.now();
                    });
                }

            });

            $scope.users.sort(function (a, b) {

                var i = 0;
                var j = 0;


                if (a.status == 'offline') {

                    i = 1;
                } else {

                    i = 2;
                }

                if (b.status == 'offline') {

                    j = 1;
                } else {

                    j = 2;
                }


                return j - i;

            });
        }
    });


    //show OnExistingclient
    chatService.SubscribeChatAll(function (message) {
        if (message.who && message.who == 'client') {
            var userObj = $scope.onlineClientUser.filter(function (item) {
                return message.from == item.username;
            });
            if (Array.isArray(userObj)) {
                userObj.forEach(function (obj, index) {
                    if (obj.chatcount) {
                        obj.chatcount += 1;
                    } else {
                        obj.chatcount = 1;

                        if ($scope.usercounts) {

                            $scope.usercounts += 1;
                        } else {

                            $scope.usercounts = 1;
                        }
                    }
                });
            }
        }
        ;

        var userObj = $scope.users.filter(function (item) {
            return message.from == item.username;
        });
        if (Array.isArray(userObj)) {
            userObj.forEach(function (obj, index) {
                if (obj.chatcount) {
                    obj.chatcount += 1;
                } else {
                    obj.chatcount = 1;

                    if ($scope.usercounts) {

                        $scope.usercounts += 1;
                    } else {

                        $scope.usercounts = 1;
                    }
                }
            });
        }
    });

    chatService.SubscribePending(function (pendingArr) {
        if (pendingArr && Array.isArray(pendingArr)) {

            pendingArr.forEach(function (item) {

                var userx = item._id;
                var userObj = $scope.users.filter(function (user) {
                    return userx == user.username;
                });


                if (Array.isArray(userObj)) {
                    userObj.forEach(function (obj, index) {

                        obj.chatcount = item.messages;

                        if (obj.chatcount) {

                            $scope.usercounts = 1;
                        }

                    });
                }

            });
        }

    });

    //get online users
    var onlineUser = chatService.onUserStatus();
    console.log(onlineUser);

    $scope.showTabChatPanel = function (chatUser) {

        chatService.SetChatUser(chatUser);

        if (chatUser.chatcount) {

            $scope.usercounts -= 1;
        }
    };

    $rootScope.$on("updates", function () {
        $scope.selectedChatUser = chatService.GetCurrentChatUser();
        $scope.onlineClientUser = chatService.GetClientUsers();
    });

    $scope.chatUserTypeFilter = function (user) {
        return user.type === 'client'
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
}).directive('enterUnlockScreen', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterUnlockScreen);
                });
                event.target.value = "";
                event.preventDefault();
            }
        });
    };
});


agentApp.controller("notificationModalController", function ($scope, $uibModalInstance, MessageObj, DiscardNotifications, AddToDoList) {


    $scope.showMesssageModal = true;
    $scope.MessageObj = MessageObj;


})
