/**
 * Created by Damith on 8/19/2016.
 */


agentApp.controller('ticketCtrl', function ($scope, $http,$filter,$timeout,ticketService,moment,userBackendService,$rootScope) {

    $scope.ticketList = {
        toDo: [],
        inProgress: [],
        done: [],
        loadCompleted:false,
        loadListStatus:"DEFAULT"


    };


    $scope.userList=[];
    $scope.userGroupList=[];
    $scope.isDefault=true;

    $("#mybtn").click(function() {
        $(this).toggleClass("active");
        if($scope.ticketList.loadListStatus=="GROUP")
        {
            $("#grpbtn").toggleClass("active");
        }

    });
    $("#grpbtn").click(function() {
        $(this).toggleClass("active");
        if($scope.ticketList.loadListStatus=="MY")
        {
            $("#mybtn").toggleClass("active");
        }

    });


// ................. All users and user groups ..............................
    var pickAllGroups= function () {
        userBackendService.getUserGroupList().then(function (response) {
            $scope.userGroupList=response.data.Result;
            console.log("USER Groups ",$scope.userGroupList);
            $scope.ticketList.loadCompleted =true;
            pickToDoList();
            pickProcessingTickets();
            pickCompletedTickets();


        }), function (error) {
            console.log(error);
        }
    };

    var pickAllUsers = function () {
        userBackendService.getUserList().then(function (response) {
            $scope.userList=response.data.Result;
            console.log("USERS ",$scope.userList);

            pickAllGroups();

        }), function (error) {
            console.log(error);
        }
    };


// ................. All Tickets ..............................
    var pickToDoList = function () {
        console.log("hit To DO");
        ticketService.getNewTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result)
            {
                for(var i=0;i<response.data.Result.length;i++)
                {

                    response.data.Result[i].timeDelay  = moment(response.data.Result[i].updated_at).fromNow();
                    if(response.data.Result[i].status.length > 20)
                    {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                    }


                    /* if(response.data.Result[i].assignee)
                     {

                     var assigneeData = $filter('filter')( $scope.userList, {
                     _id: response.data.Result[i].assignee

                     });

                     response.data.Result[i].assignee_name=assigneeData[0].name;
                     }*/

                    /*if(response.data.Result[i].assignee_group)
                     {

                     var assigneeGroupData = $filter('filter')( $scope.userGroupList, {
                     _id: response.data.Result[i].assignee_group

                     });


                     response.data.Result[i].assignee_group_name=assigneeGroupData[0].name;
                     }*/



                    if(i==response.data.Result.length-1)
                    {

                        $scope.ticketList.toDo=response.data.Result;
                        console.log("To do ",$scope.ticketList.toDo);

                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading New tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for new tickets");
                }

            }




        }), function (error) {
            console.log(error);
        }

    };

    var pickProcessingTickets = function () {
        ticketService.getOpenTickets().then(function (response) {
            console.log(response.data.Result);
            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {
                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }

                   /* if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }*/


                    if (i == response.data.Result.length - 1) {
                        $scope.ticketList.inProgress = response.data.Result;
                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading open tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for open tickets");
                }


            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickCompletedTickets = function () {
        ticketService.getClosedTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {

                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }
                    //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                    /*if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }*/

                    if (i == response.data.Result.length - 1) {

                        $scope.ticketList.done = response.data.Result;
                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading closed tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for closed tickets");
                }

            }



        }), function (error) {
            console.log(error);
        }
    };

// ................. My Tickets ..............................

    var pickMyToDoList = function () {

        ticketService.getMyNewTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result)
            {
                for(var i=0;i<response.data.Result.length;i++)
                {
                    response.data.Result[i].timeDelay  = moment(response.data.Result[i].updated_at).fromNow();
                    if(response.data.Result[i].status.length > 20)
                    {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                    }

                    //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;


                    /*if(response.data.Result[i].assignee)
                    {

                        var assigneeData = $filter('filter')( $scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name=assigneeData[0].name;
                    }

                    if(response.data.Result[i].assignee_group)
                    {

                        var assigneeGroupData = $filter('filter')( $scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name=assigneeGroupData[0].name;
                    }
*/


                    if(i==response.data.Result.length-1)
                    {
                        $scope.ticketList.toDo=[];
                        $scope.ticketList.toDo=response.data.Result;


                    }
                }
            }

            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading My new tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My new tickets");
                }

            }



        }), function (error) {
            console.log(error);
        }

    };

    var pickMyProcessingTickets = function () {
        ticketService.getMyOpenTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result)
            {
                for(var i=0;i<response.data.Result.length;i++)
                {

                    response.data.Result[i].timeDelay  = moment(response.data.Result[i].updated_at).fromNow();

                    if(response.data.Result[i].status.length > 20)
                    {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                    }

                    /*if(response.data.Result[i].assignee)
                    {

                        var assigneeData = $filter('filter')( $scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name=assigneeData[0].name;
                    }

                    if(response.data.Result[i].assignee_group)
                    {

                        var assigneeGroupData = $filter('filter')( $scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name=assigneeGroupData[0].name;
                    }*/


                    if(i==response.data.Result.length-1)
                    {
                        $scope.ticketList.inProgress=[];
                        $scope.ticketList.inProgress=response.data.Result;

                    }
                }
            }

            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading  My open tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My open tickets");
                }

            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickMyCompletedTickets = function () {
        ticketService.getMyClosedTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {

                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }
                    //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                    /*if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }
*/
                    if (i == response.data.Result.length - 1) {
                        $scope.ticketList.done = [];
                        $scope.ticketList.done = response.data.Result;
                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading  My Closed tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My Closed tickets");
                }

            }



        }), function (error) {
            console.log(error);
        }
    };

    // ................. My Tickets ..............................

    var pickGroupToDoList = function () {

        ticketService.getMyGroupTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {

                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();
                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }

                    //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;


                    /*if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }*/


                    if (i == response.data.Result.length - 1) {
                        $scope.ticketList.toDo = [];
                        $scope.ticketList.toDo = response.data.Result;


                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading   My Group new tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My Group new tickets");
                }


            }



        }), function (error) {
            console.log(error);
        }

    };

    var pickGroupProcessingTickets = function () {
        ticketService.getMyGroupOpenTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {

                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }

                   /* if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }*/


                    if (i == response.data.Result.length - 1) {
                        $scope.ticketList.inProgress = [];
                        $scope.ticketList.inProgress = response.data.Result;

                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loading My Group open tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My Group open tickets");
                }

            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickGroupCompletedTickets = function () {
        ticketService.getMyGroupClosedTickets().then(function (response) {
            console.log(response.data.Result);

            if(response.data.Result) {
                for (var i = 0; i < response.data.Result.length; i++) {

                    response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                    if (response.data.Result[i].status.length > 20) {
                        response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                    }
                    //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                    /*if (response.data.Result[i].assignee) {

                        var assigneeData = $filter('filter')($scope.userList, {
                            _id: response.data.Result[i].assignee

                        });

                        response.data.Result[i].assignee_name = assigneeData[0].name;
                    }

                    if (response.data.Result[i].assignee_group) {

                        var assigneeGroupData = $filter('filter')($scope.userGroupList, {
                            _id: response.data.Result[i].assignee_group

                        });


                        response.data.Result[i].assignee_group_name = assigneeGroupData[0].name;
                    }*/

                    if (i == response.data.Result.length - 1) {
                        $scope.ticketList.done = [];
                        $scope.ticketList.done = response.data.Result;
                    }
                }
            }
            else
            {
                if(response.data.Exception.Message)
                {
                    console.log("Error in loadingMy Group closed tickets "+response.data.Exception.Message);
                }
                else
                {
                    console.log("Empty response for My Group closed tickets");
                }

            }


        }), function (error) {
            console.log(error);
        }
    };


// ....................... Switch between All/My/Group Tickets ...................
    $scope.switchTickets = function (listName) {

        $scope.ticketList.toDo=[];
        $scope.ticketList.inProgress=[];
        $scope.ticketList.done=[];

        if($scope.ticketList.loadListStatus==listName)
        {

            $scope.ticketList.loadListStatus="DEFAULT";


            pickToDoList();
            pickProcessingTickets();
            pickCompletedTickets();
        }
        else
        {
            if(listName=="MY")
            {

                $scope.ticketList.loadListStatus=listName;

                pickMyToDoList();
                pickMyProcessingTickets();
                pickMyCompletedTickets();
            }
            else
            {

                $scope.ticketList.loadListStatus=listName;

                pickGroupToDoList();
                pickGroupProcessingTickets();
                pickGroupCompletedTickets();
            }

        }

    };


    pickAllUsers();




    $scope.gotoTicket = function (data) {
        $rootScope.$emit('newTicketTab',data);
        $scope.closeTicketInbox();

    }

    $scope.closeTicketInbox = function () {
        $('#mainTicketWrapper').addClass('display-none').
            removeClass('display-block fadeIn');

    }


});