/**
 * Created by Damith on 10/3/2016.
 */


agentApp.controller('newProfileCtrl', function ($scope, $http) {


    //image crop deatails
    $scope.isShowCrop = false;
    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.cropImageURL = null;


    $scope.cropImage = function () {
        $scope.cropImageURL = $scope.myCroppedImage;
        $scope.isShowCrop = !$scope.isShowCrop;
    };

    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };


    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

});
