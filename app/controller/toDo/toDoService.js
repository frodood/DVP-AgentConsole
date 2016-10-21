/**
 * Created by Veery Team on 9/8/2016.
 */

agentApp.factory("toDoService", function ($http, baseUrls,authService) {


    var addNewToDo = function (todoData) {
        return $http({
            method: 'post',
            url: baseUrls.toDoUrl+"ToDo",
            headers: {
                'authorization': authService.GetToken()
            },
            data:todoData
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };


    return {
        addNewToDo: addNewToDo
    }
});

