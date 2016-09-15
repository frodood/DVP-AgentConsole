/**
 * Created by dinusha on 9/12/2016.
 */

(function() {

    var mailInboxService = function($http, baseUrls, authService)
    {
        var getAllInboxMessages = function(limitCount, skipCount, msgType)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/All?limit=' + limitCount;

            if(skipCount)
            {
                url = url + '&skip=' + skipCount;
            }

            if(msgType)
            {
                url = url + '&messageType=' + msgType;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getReadInboxMessages = function(limitCount, skipCount)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Read?limit=' + limitCount;

            if(skipCount)
            {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getUnReadInboxMessages = function(limitCount, skipCount)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Unread?limit=' + limitCount;

            if(skipCount)
            {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getDeletedInboxMessages = function(limitCount, skipCount)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Deleted?limit=' + limitCount;

            if(skipCount)
            {
                url = url + '&skip=' + skipCount;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var deleteInboxMessages = function(messageIds)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/RemoveMessages';

            return $http({
                method: 'POST',
                url: url,
                headers: {
                    'authorization': authToken
                },
                data: {
                    messageIds: messageIds
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var markMessageAsRead = function(messageId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Message/' + messageId + '/Read';

            return $http({
                method: 'PUT',
                url: url,
                headers: {
                    'authorization': authToken
                }

            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getMessageCounters = function()
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Counts';

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }

            }).then(function(resp)
            {
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

