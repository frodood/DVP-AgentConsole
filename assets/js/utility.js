/**
 * Created by Damith on 8/16/2016.
 */

function getJSONData(http, file, callback) {
    http.get('assets/json/' + file + '.json').success(function (data) {
        callback(data.d);
    })
}

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    document.getElementById("main").style.marginRight = "285px";
    // document.getElementById("navBar").style.marginRight = "300px";
}


/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    //  document.getElementById("navBar").style.marginRight = "0";
}

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

