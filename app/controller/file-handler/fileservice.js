/**
 * Created by Pawan on 9/28/2016.
 */

var fileModule = angular.module("fileServiceModule", ["download"]);
agentApp.factory("fileService", function ($http, baseUrls,authService,download) {


    var downloadAttachment = function (attachment) {
        $http({
            url: baseUrls.fileService+"/InternalFileService/File/Download/"+authService.GetCompanyInfo().tenant+"/"+authService.GetCompanyInfo().company+"/"+attachment.url+"/SampleAttachment",
            method: "get",
            //data: json, //this is your json data string
            headers: {
                'Content-type': 'application/json'

            },
            responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {

            /*
             var blob = new Blob([data], {type: "application/image/png"});
             var objectUrl = URL.createObjectURL(blob);
             window.open(objectUrl);
             */

            var myBlob = new Blob([data]);
            var blobURL = (window.URL || window.webkitURL).createObjectURL(myBlob);
            var anchor = document.createElement("a");
            anchor.download = attachment.file;
            anchor.href = blobURL;
            anchor.click();

        }).error(function (data, status, headers, config) {
            //upload failed
        });

    };





    return {
        downloadAttachment: downloadAttachment
    }
});

