/**
 * Created by Damith on 8/19/2016.
 */


agentApp.controller('ticketCtrl', function ($scope, $http,$filter,$timeout,ticketInboxService,moment,userBackendService) {

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
        ticketInboxService.getNewTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();
                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;


                if(response.data.Result[i].assignee)
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



                if(i==response.data.Result.length-1)
                {

                    $scope.ticketList.toDo=response.data.Result;
                    console.log("To do ",$scope.ticketList.toDo);

                }
            }



        }), function (error) {
            console.log(error);
        }

    };

    var pickProcessingTickets = function () {
        ticketInboxService.getOpenTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                if(response.data.Result[i].assignee)
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


                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.inProgress=response.data.Result;
                }
            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickCompletedTickets = function () {
        ticketInboxService.getClosedTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }
                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                if(response.data.Result[i].assignee)
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

                if(i==response.data.Result.length-1)
                {

                    $scope.ticketList.done=response.data.Result;
                }
            }



        }), function (error) {
            console.log(error);
        }
    };

// ................. My Tickets ..............................

    var pickMyToDoList = function () {

        ticketInboxService.getMyNewTickets().then(function (response) {
            console.log(response.data.Result);


            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();
                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;


                if(response.data.Result[i].assignee)
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



                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.toDo=[];
                    $scope.ticketList.toDo=response.data.Result;


                }
            }



        }), function (error) {
            console.log(error);
        }

    };

    var pickMyProcessingTickets = function () {
        ticketInboxService.getMyOpenTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                if(response.data.Result[i].assignee)
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


                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.inProgress=[];
                    $scope.ticketList.inProgress=response.data.Result;

                }
            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickMyCompletedTickets = function () {
        ticketInboxService.getMyClosedTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }
                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                if(response.data.Result[i].assignee)
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

                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.done=[];
                    $scope.ticketList.done=response.data.Result;
                }
            }



        }), function (error) {
            console.log(error);
        }
    };

    // ................. My Tickets ..............................

    var pickGroupToDoList = function () {

        ticketInboxService.getMyGroupTickets().then(function (response) {
            console.log(response.data.Result);


            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();
                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;


                if(response.data.Result[i].assignee)
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



                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.toDo=[];
                    $scope.ticketList.toDo=response.data.Result;


                }
            }



        }), function (error) {
            console.log(error);
        }

    };

    var pickGroupProcessingTickets = function () {
        ticketInboxService.getMyGroupOpenTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }

                if(response.data.Result[i].assignee)
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


                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.inProgress=[];
                    $scope.ticketList.inProgress=response.data.Result;

                }
            }



        }), function (error) {
            console.log(error);
        }
    };


    var pickGroupCompletedTickets = function () {
        ticketInboxService.getMyGroupClosedTickets().then(function (response) {
            console.log(response.data.Result);

            for(var i=0;i<response.data.Result.length;i++)
            {
                // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
                response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

                if(response.data.Result[i].status.length > 20)
                {
                    response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0,20)+"....";
                }
                //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
                if(response.data.Result[i].assignee)
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

                if(i==response.data.Result.length-1)
                {
                    $scope.ticketList.done=[];
                    $scope.ticketList.done=response.data.Result;
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






    /* getJSONData($http, 'toDo', function (data) {

     ticketInboxService.getNewTickets().then(function (response) {
     console.log(response.data.Result);

     for(var i=0;i<response.data.Result.length;i++)
     {
     // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
     response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();
     if(response.data.Result[i]._id.length > 8)
     {
     response.data.Result[i].sampleID = response.data.Result[i]._id.substring(0,10)+"....";
     }
     //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
     console.log("Time delay "+response.data.Result[i].timeDelay);

     if(response.data.Result[i].assignee)
     {
     console.log("Assignee found "+response.data.Result[i].assignee)
     var assigneeData = $filter('filter')( $scope.userList, {
     _id: response.data.Result[i].assignee

     });

     console.log("Assignee data "+assigneeData);
     response.data.Result[i].assignee_name=assigneeData.name;
     }



     if(i==response.data.Result.length-1)
     {

     $scope.ticketList.toDo=response.data.Result;
     }
     }



     }), function (error) {
     console.log(error);
     }




     //$scope.ticketList.toDo = data;
     });*/
    /*getJSONData($http, 'InProgress', function (data) {

     ticketInboxService.getOpenTickets().then(function (response) {
     console.log(response.data.Result);

     for(var i=0;i<response.data.Result.length;i++)
     {
     // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
     response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();

     if(response.data.Result[i]._id.length > 8)
     {
     response.data.Result[i].sampleID = response.data.Result[i]._id.substring(0,10)+"....";
     }

     //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
     console.log("Time delay "+response.data.Result[i].timeDelay);

     if(i==response.data.Result.length-1)
     {
     console.log("hit");
     $scope.ticketList.inProgress=response.data.Result;
     }
     }



     }), function (error) {
     console.log(error);
     }
     });*/
    /* getJSONData($http, 'done', function (data) {
     ticketInboxService.getClosedTickets().then(function (response) {
     console.log(response.data.Result);

     for(var i=0;i<response.data.Result.length;i++)
     {
     // response.data.Result[i].timeDelay  = moment().startOf(response.data.Result[i].created_at).fromNow();
     response.data.Result[i].timeDelay  = moment(response.data.Result[i].created_at).fromNow();
     //response.data.Result[i].subject=response.data.Result[i].subject+" : "+i;
     console.log("Time delay "+response.data.Result[i].timeDelay);

     if(i==response.data.Result.length-1)
     {
     console.log("hit");
     $scope.ticketList.done=response.data.Result;
     }
     }



     }), function (error) {
     console.log(error);
     }
     });*/

    $scope.gotoTicket = function (id) {
        alert(id);
    }

    $scope.closeTicketInbox = function () {
        $('#mainTicketWrapper').addClass('display-none').
            removeClass('display-block fadeIn');

    }


});