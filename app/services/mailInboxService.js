/**
 * Created by Veery Team on 9/12/2016.
 */

(function () {

    var mailInboxService = function ($http, baseUrls) {

        var getAllInboxMessages = function (profileId, limitCount, skipCount, msgType) {
            var url = baseUrls.mailInboxUrl + profileId + '/Messages/All?limit=' + limitCount;

            if (skipCount) {
                url = url + '&skip=' + skipCount;
            }

            if (msgType) {
                url = url + '&messageType=' + msgType;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getReadInboxMessages = function (profileId, limitCount, skipCount) {
            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Read?limit=' + limitCount;

            if (skipCount) {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getUnReadInboxMessages = function (profileId, limitCount, skipCount) {
            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Unread?limit=' + limitCount;

            if (skipCount) {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var getDeletedInboxMessages = function (profileId, limitCount, skipCount) {
            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Deleted?limit=' + limitCount;

            if (skipCount) {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url
            }).then(function (resp) {
                return resp.data;
            })
        };

        var deleteInboxMessages = function (profileId, messageIds) {
            var url = baseUrls.mailInboxUrl + profileId + '/RemoveMessages';

            return $http({
                method: 'POST',
                url: url,
                data: {
                    messageIds: messageIds
                }
            }).then(function (resp) {
                return resp.data;
            })
        };

        var markMessageAsRead = function (profileId, messageId) {
            var url = baseUrls.mailInboxUrl + profileId + '/Message/' + messageId + '/Read';

            return $http({
                method: 'PUT',
                url: url

            }).then(function (resp) {
                return resp.data;
            })
        };

        var getMessageCounters = function (profileId) {
            var url = baseUrls.mailInboxUrl + profileId + '/Counts';

            return $http({
                method: 'GET',
                url: url

            }).then(function (resp) {
                return resp.data;
            })
        };

        return {
            getAllInboxMessages: getAllInboxMessages,
            getReadInboxMessages: getReadInboxMessages,
            getUnReadInboxMessages: getUnReadInboxMessages,
            getDeletedInboxMessages: getDeletedInboxMessages,
            deleteInboxMessages: deleteInboxMessages,
            markMessageAsRead: markMessageAsRead,
            getMessageCounters: getMessageCounters
        };
    };

    var module = angular.module("veeryAgentApp");
    module.factory("mailInboxService", mailInboxService);

}());

