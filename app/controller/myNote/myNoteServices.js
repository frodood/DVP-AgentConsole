/**
 * Created by Damith on 10/24/2016.
 */

agentApp.factory("myNoteServices", function ($http, baseUrls, authService) {

    var getAllMyToDo = function (status) {
        return $http({
            method: 'GET',
            url: baseUrls.toDoUrl + "ToDoList"
        }).then(function (response) {
            return response;
        });
    };

    var createMyNote = function (note) {
        return $http({
            method: 'POST',
            url: baseUrls.toDoUrl + "ToDo",
            data: note
        }).then(function (response) {
            return response;
        });
    };

    var deleteMyNote = function (note) {
        return $http({
            method: 'DELETE',
            url: baseUrls.toDoUrl + "ToDo/" + note._id
        }).then(function (response) {
            return response;
        });
    };

    var checkMyNote = function (note) {
        return $http({
            method: 'PUT',
            url: baseUrls.toDoUrl + "ToDo/" + note._id + "/Check"
        }).then(function (response) {
            return response;
        });
    };

    var reminderMyNote = function (note, dueDate) {
        return $http({
            method: 'PUT',
            url: baseUrls.toDoUrl + "ToDo/" + note._id + "/Reminder",
            data: {"due_at": moment(dueDate)}
        }).then(function (response) {
            return response;
        });
    };

    //return functions
    return {
        GetAllMyToDo: getAllMyToDo,
        CreateMyNote: createMyNote,
        CheckMyNote: checkMyNote,
        DeleteMyNote: deleteMyNote,
        ReminderMyNote: reminderMyNote
    }
});