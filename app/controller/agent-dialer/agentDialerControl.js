/**
 * Created by Waruna on 5/22/2017.
 */


agentApp.constant('constants', {
    DialerState: {
        1: 'Run',
        2: 'Stop',
        3: 'Pause',
        4: 'Resume'
    }

});

agentApp.controller('agentDialerControl', function ($rootScope, $scope, $http, $anchorScroll, agentDialerService, authService, constants) {


    $anchorScroll();

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.contactList = [];

    $scope.isLoading = false;
    $scope.currentPage = 0;
    $scope.BatchName = undefined;
    var resid = authService.GetResourceIss();
    $scope.getALlPhoneContact = function () {
        $scope.isLoading = true;
        if ($('#AgentDialerUi').hasClass("display-none")) {
            return;
        }
        if (!$scope.BatchName) {
            return;
        }
        if ($scope.contactList.length == 0) {
            $scope.currentPage = 0;
            $('#btn-close').removeClass('display-none');
        }
        $scope.currentPage++;
        agentDialerService.GetAllContacts(resid,$scope.BatchName, $scope.currentPage).then(function (response) {
            $scope.isLoading = false;
            if (response && angular.isArray(response) && response.length > 0) {
                $('#btn-close').addClass('display-none');
                response.map(function (item) {
                    $scope.safeApply(function () {
                        $scope.contactList.push(item);
                    });
                });
            }

        });
    };

    //$scope.getALlPhoneContact();

    $scope.updateContact = function (obj) {
        agentDialerService.UpdateContact(obj).then(function (response) {
            console.log(response);
        });
    };

    $scope.dialerState = constants.DialerState[2];
    $scope.currentItem = {};

    var makeCall = function () {

        $scope.safeApply(function () {
            if ($scope.dialerState === constants.DialerState[1] && $scope.contactList.length >= 1) {
                $scope.currentItem = $scope.contactList[0];
                $scope.contactList.splice(0, 1);
                $scope.currentItem.DialerState = 'Dial';
                $scope.currentItem.Redial = false;

                var number = $scope.currentItem.ContactNumber;
                if (number) {
                    var data = {
                        callNumber: number,
                        tabReference: undefined
                    };
                    $rootScope.$emit('makecall', data);
                }
            }
            else if ($scope.contactList.length === 0) {
                $scope.stopDialer();
            }
        });

    };


    $rootScope.$on('dialnextnumber', function (events, args) {
        if ($scope.currentItem.ContactNumber) {
            try {
                var temp = {};
                angular.copy($scope.currentItem, temp);
                $scope.updateContact(temp);
            } catch (e) {
                console.log(e);
            }
        }

        if ($scope.dialerState === constants.DialerState[1]) {
            makeCall();
        }
        if ($scope.contactList.length <= 10) {
            $scope.getALlPhoneContact();
        }

    });

    $rootScope.$on('dialstop', function (events, args) {
        $scope.stopDialer();
    });

    $rootScope.$on('dialloaddata', function (events, args) {
        /* if ($scope.contactList.length <= 10) {
         $scope.getALlPhoneContact();
         }*/
    });

    $scope.startDialer = function () {
        $scope.dialerState = constants.DialerState[1];
        $('#btn-start').addClass('display-none');
        $('#btn-pause').removeClass('display-none');
        $('#btn-stop').removeClass('display-none');
        $('#btn-resume').addClass('display-none');
        $('#btn-update').addClass('display-none');
        $('#btn-close').addClass('display-none');

        makeCall();

    };

    $scope.stopDialer = function () {
        $('#btn-start').removeClass('display-none');
        $('#btn-pause').addClass('display-none');
        $('#btn-stop').addClass('display-none');
        $('#btn-resume').addClass('display-none');
        $('#AgentDialerUi').addClass('display-none');
        $scope.dialerState = constants.DialerState[2];
        $scope.currentItem = {};
    };

    $scope.pauseDialer = function () {
        $('#btn-start').addClass('display-none');
        $('#btn-pause').addClass('display-none');
        $('#btn-stop').addClass('display-none');
        $('#btn-resume').removeClass('display-none');
        $('#btn-update').removeClass('display-none');
        $scope.dialerState = constants.DialerState[3];
    };

    $scope.resumeDialer = function () {
        $scope.startDialer();
    };

    $scope.Disposition = ['Not Responding',
        'No Answer',
        'Callback',
        'Close',
        'New',
        'Dial'
    ];

    $scope.BatchNames = [];
    $scope.HeaderDetails = function () {
        $scope.BatchNames = [];
        $scope.isLoading = true;
        agentDialerService.HeaderDetails(resid).then(function (response) {
            if (response) {
                $scope.BatchNames = response.BatchName;
            }
            $scope.isLoading = false;
        }, function (error) {
            //$scope.showAlert("Agent Dialer", 'error', "Fail To Get Page Count.");
            $scope.isLoading = false;
        });
    };

    $scope.HeaderDetails();
});

