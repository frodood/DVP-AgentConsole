/**
 * Created by Veery Team on 8/16/2016.
 */


function getJSONData(http, file, callback) {
    http.get('assets/json/' + file + '.json').success(function (data) {
        callback(data.d);
    })
}

///* Set the width of the side navigation to 250px */
//function openNav() {
//    document.getElementById("mySidenav").style.width = "300px";
//    document.getElementById("main").style.marginRight = "285px";
//    // document.getElementById("navBar").style.marginRight = "300px";
//}
//
//
///* Set the width of the side navigation to 0 */
//function closeNav() {
//    document.getElementById("mySidenav").style.width = "0";
//    document.getElementById("main").style.marginRight = "0";
//    //  document.getElementById("navBar").style.marginRight = "0";
//}

/// div none and block
var divModel = function () {
    return {
        model: function (id, className) {
            if (className == 'display-block') {
                $(id).removeClass('display-none').addClass(className);
            } else if (className == 'display-none') {
                $(id).removeClass('display-block').addClass(className);
            }
        }
    }
}();


var resizeDiv = function () {
    vpw = $(window).width();
    vph = $(window).height() - 225;
    $('div.mainScrollerBar').attr("style", "height:" + vph + "px;");
};

$(document).ready(function () {
    resizeDiv();
});


$(window).resize(function () {
    resizeDiv();
});


//soft phone functions
//code by damith
//main console phone UI functions
var softPhone = function () {
    return {
        muted: function () {
        },
        unmute: function () {
        }
    }
}();

var phoneAnimation = function () {
    return {
        autoHeightAnimate: function (element, time, height, callback) {
            var curHeight = element.height(), // Get Default Height
                autoHeight = element.css('height', 'auto').height(); // Get Auto Height
            element.height(curHeight); // Reset to Default Height
            element.stop().animate(
                {
                    height: height
                }, {
                    easing: 'swing',
                    complete: function () {
                        callback(true);
                    }
                }, time); // Animate to Auto Height
        }
    }
}();

function showMoreButton() {
    $('#initiallyBtnWrapper').removeClass('display-block').addClass('display-none');
    $('#phoneMoreBtnWrapper').removeClass('display-none').addClass('display-block');
};
function backToMaiaButtton() {
    $('#initiallyBtnWrapper').removeClass('display-none').addClass('display-block');
    $('#phoneMoreBtnWrapper').removeClass('display-block').addClass('display-none');
};

function callTransfer() {
    $('#callTransfer').removeClass('display-none').addClass('display-block');
    $('#phoneMoreBtnWrapper').removeClass('display-block').addClass('display-none');
}

function closeCallTransfer() {
    $('#initiallyBtnWrapper').removeClass('display-none').addClass('display-block');
    $('#callTransfer').removeClass('display-block').addClass('display-none');
}

var pinHeight = 0;
function pinScreen() {
    pinHeight = 90;
    $('.dial-pad-wrapper').stop().animate({height: '90'}, 500);
    $('#phoneDialpad').removeClass('display-block').addClass('display-none');
    $('#pinScreen').removeClass('display-block').addClass('display-none');
    $('#removePinScreen').removeClass('display-none').addClass('display-block');
};
function removePin() {
    pinHeight = 0;
    $('.dial-pad-wrapper').stop().animate({height: '0'}, 500);
    $('#pinScreen').removeClass('display-none').addClass('display-block');
    $('#removePinScreen').removeClass('display-block').addClass('display-none');
    $('#phoneDialpad').removeClass('display-block').addClass('display-none');
};

function showDilapad() {
    var $wrapper = $('.dial-pad-wrapper'),
        animateTime = 500,
        height = 310;
    if ($wrapper.height() === 0 || $wrapper.height() === 90) {
        phoneAnimation.autoHeightAnimate($wrapper, animateTime, height, function (res) {
            if (res) {
                $('#phoneDialpad').removeClass('display-none').addClass('display-block');
            }
        });

    } else {
        $wrapper.stop().animate({height: pinHeight}, animateTime);
        $('#phoneDialpad').removeClass('display-block').addClass('display-none');
    }
}

function showMicrophoneOption() {
    $('#microphoneOption').each(function (i, obj) {
        var $i = $(this).parent();
        if ($i.context) {
            if ($i.context.children) {
                for (var i = 0; i < $i.context.childNodes.length; i++) {
                    var element = $i.context.childNodes[i];
                    if (element != "#text") {
                        if (element.id) {
                            var id = ("#" + element.id);
                            if ($(id).hasClass('display-block')) {
                                $(id).removeClass('display-block').addClass('display-none');
                            } else {
                                $(id).removeClass('display-none').addClass('display-block');
                            }
                        }
                    }
                }
            }
        }
    });
}






