/**
 * Created by Waruna on 9/11/2017.
 */

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function callNotification(name, number,skill) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('Facetone', {
            icon: 'assets/img/logo_130x130yellow.png',
            body: "Hello "+name+" you are receiving a "+skill+" call from "+number
        });
        setTimeout(notification.close.bind(notification), 15000);
        notification.onclick = function () {
            window.focus();
            //this.cancel();
        };

    }

}
