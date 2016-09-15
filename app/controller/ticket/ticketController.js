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
            pickToDoList(1);
            pickProcessingTickets(1);
            pickCompletedTickets(1);


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
    var pickToDoList = function (page) {
        console.log("hit To DO");
        ticketService.getNewTickets(page).then(function (response) {
            console.log("All new tickets ",response.data.Result);

            if(response.data.IsSuccess)
            {
                if(response.data.Result.length==0)
                {
                    $scope.isNewTicketLoadComplete=true;
                }
                else
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

                            $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                            console.log("All new tickets ",$scope.ticketList.toDo);

                        }
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

    var pickProcessingTickets = function (page) {
        ticketService.getOpenTickets(page).then(function (response) {
            console.log("All open tickets ",response.data.Result);
            if(response.data.IsSuccess) {
                if(response.data.Result.length==0)
                {
                    $scope.isOpenTicketLoadComplete=true;
                }
                else
                {
                    for (var i = 0; i < response.data.Result.length; i++) {
                        response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                        if (response.data.Result[i].status.length > 20) {
                            response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                        }


                        if (i == response.data.Result.length - 1) {
                            $scope.ticketList.inProgress = $scope.ticketList.inProgress.concat(response.data.Result);
                            console.log("All Processing tickets ",$scope.ticketList.inProgress);
                        }
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


    var pickCompletedTickets = function (page) {
        ticketService.getClosedTickets(page).then(function (response) {
            console.log("All Completed tickets ",response.data.Result);

            if(response.data.IsSuccess) {

                if(response.data.Result.length==0)
                {
                    $scope.isCompletedTicketLoadComplete=true;
                }
                else
                {
                    for (var i = 0; i < response.data.Result.length; i++) {

                        response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                        if (response.data.Result[i].status.length > 20) {
                            response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                        }


                        if (i == response.data.Result.length - 1) {

                            $scope.ticketList.done = $scope.ticketList.done.concat(response.data.Result);
                        }
                    };
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

    var pickMyToDoList = function (page) {

        ticketService.getMyNewTickets(page).then(function (response) {
            console.log("My new Tickets",response.data.Result);

            if(response.data.IsSuccess)
            {
                if(response.data.Result.length==0)
                {
                    $scope.isNewTicketLoadComplete=true;
                }
                else
                {
                    for (var i = 0; i < response.data.Result.length; i++) {
                        response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();
                        if (response.data.Result[i].status.length > 20) {
                            response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                        }


                        if (i == response.data.Result.length - 1) {
                            $scope.ticketList.toDo = $scope.ticketList.toDo.concat(response.data.Result);


                        }
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

    var pickMyProcessingTickets = function (page) {
        ticketService.getMyOpenTickets(page).then(function (response) {
            console.log("My open tickets",response.data.Result);

            if(response.data.IsSuccess)
            {
                if(response.data.Result.length==0)
                {
                    $scope.isOpenTicketLoadComplete=true;
                }
                else
                {
                    for (var i = 0; i < response.data.Result.length; i++) {

                        response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();

                        if (response.data.Result[i].status.length > 20) {
                            response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
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


                        if (i == response.data.Result.length - 1) {
                            $scope.ticketList.inProgress = $scope.ticketList.inProgress.concat(response.data.Result);

                        }
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


    var pickMyCompletedTickets = function (page) {
        ticketService.getMyClosedTickets(page).then(function (response) {
            console.log("My completed tickets",response.data.Result);

            if(response.data.IsSuccess) {
                if(response.data.Result.length==0)
                {
                    $scope.isCompletedTicketLoadComplete=true;
                }
                else
                {
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
                            $scope.ticketList.done = $scope.ticketList.done.concat(response.data.Result);
                        }
                    };
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

    var pickGroupToDoList = function (page) {

        ticketService.getMyGroupTickets(page).then(function (response) {
            console.log("New Group Tickets ",response.data.Result);

            if(response.data.IsSuccess) {
                if(response.data.Result.length==0)
                {
                    $scope.isNewTicketLoadComplete=true;
                }
                else
                {
                    for (var i = 0; i < response.data.Result.length; i++) {

                        response.data.Result[i].timeDelay = moment(response.data.Result[i].updated_at).fromNow();
                        if (response.data.Result[i].status.length > 20) {
                            response.data.Result[i].stateTitle = response.data.Result[i].status.substring(0, 20) + "....";
                        }


                        if (i == response.data.Result.length - 1) {
                            $scope.ticketList.toDo = $scope.ticketList.toDo.concat(response.data.Result);


                        }
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

    var pickGroupProcessingTickets = function (page) {
        ticketService.getMyGroupOpenTickets(page).then(function (response) {
            console.log("Group Open tickets",response.data.Result);

            if(response.data.IsSuccess) {
                if(response.data.Result.length==0)
                {
                    $scope.isOpenTicketLoadComplete=true;
                }
                else
                {
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
                            $scope.ticketList.inProgress = $scope.ticketList.inProgress.concat(response.data.Result);

                        }
                    };
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


    var pickGroupCompletedTickets = function (page) {
        ticketService.getMyGroupClosedTickets(page).then(function (response) {
            console.log("Group closed tickets",response.data.Result);

            if(response.data.IsSuccess) {
                if(response.data.Result.length==0)
                {
                    $scope.isCompletedTicketLoadComplete=true;
                }
                else
                {
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
                            $scope.ticketList.done = $scope.ticketList.done.contact(response.data.Result);
                        }
                    };
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

            setToInitiate();
            pickToDoList(1);
            pickProcessingTickets(1);
            pickCompletedTickets(1);
        }
        else
        {
            if(listName=="MY")
            {

                $scope.ticketList.loadListStatus=listName;
                setToInitiate();
                pickMyToDoList(1);
                pickMyProcessingTickets(1);
                pickMyCompletedTickets(1);
            }
            else
            {

                $scope.ticketList.loadListStatus=listName;
                setToInitiate();
                pickGroupToDoList(1);
                pickGroupProcessingTickets(1);
                pickGroupCompletedTickets(1);
            }

        }

    };
    var setToInitiate = function () {
        $scope.NewTicketPage=1;
        $scope.OpenTicketPage=1;
        $scope.CompletedTicketPage=1;
        $scope.isNewTicketLoadComplete=false;
        $scope.OpenTicketPage=1;
        $scope.isOpenTicketLoadComplete=false;
        $scope.CompletedTicketPage=1;
        $scope.isCompletedTicketLoadComplete=false;

    };
    setToInitiate();
    pickAllUsers();



    $scope.showMoreNewTickets = function () {

        if($scope.ticketList.loadListStatus=="DEFAULT")
        {
            if(!$scope.isNewTicketLoadComplete)
            {
                $scope.NewTicketPage=$scope.NewTicketPage+1;
                /*ticketService.getNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickToDoList($scope.NewTicketPage);

            }

        }
        else if($scope.ticketList.loadListStatus=="MY")
        {
            if(!$scope.isNewTicketLoadComplete)
            {
                $scope.NewTicketPage=$scope.NewTicketPage+1;
                /*ticketService.getMyNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickMyToDoList($scope.NewTicketPage);
            }
        }
        else
        {
            if(!$scope.isNewTicketLoadComplete)
            {
                $scope.NewTicketPage=$scope.NewTicketPage+1;
                /*ticketService.getMyGroupTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickGroupToDoList($scope.NewTicketPage);
            }
        }

    };
    $scope.showMoreOpenTickets = function () {

        if($scope.ticketList.loadListStatus=="DEFAULT")
        {
            if(!$scope.isOpenTicketLoadComplete)
            {
                $scope.OpenTicketPage=$scope.OpenTicketPage+1;
                /*ticketService.getNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickProcessingTickets($scope.OpenTicketPage);

            }

        }
        else if($scope.ticketList.loadListStatus=="MY")
        {
            if(!$scope.isOpenTicketLoadComplete)
            {
                $scope.OpenTicketPage=$scope.OpenTicketPage+1;
                /*ticketService.getMyNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickMyProcessingTickets($scope.OpenTicketPage);
            }
        }
        else
        {
            if(!$scope.isOpenTicketLoadComplete)
            {
                $scope.OpenTicketPage=$scope.OpenTicketPage+1;
                /*ticketService.getMyGroupTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickGroupCompletedTickets($scope.OpenTicketPage);
            }
        }

    };
    $scope.showMoreCompletedTickets = function () {

        if($scope.ticketList.loadListStatus=="DEFAULT")
        {
            if(!$scope.isCompletedTicketLoadComplete)
            {
                $scope.CompletedTicketPage=$scope.CompletedTicketPage+1;
                /*ticketService.getNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickCompletedTickets($scope.CompletedTicketPage);

            }

        }
        else if($scope.ticketList.loadListStatus=="MY")
        {
            if(!$scope.isCompletedTicketLoadComplete)
            {
                $scope.CompletedTicketPage=$scope.CompletedTicketPage+1;
                /*ticketService.getMyNewTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickMyCompletedTickets($scope.CompletedTicketPage);
            }
        }
        else
        {
            if(!$scope.isCompletedTicketLoadComplete)
            {
                $scope.CompletedTicketPage=$scope.CompletedTicketPage+1;
                /*ticketService.getMyGroupTickets($scope.NewTicketPage).then(function (response) {

                 if(response.data.IsSuccess )
                 {
                 if(response.data.Result.length==0)
                 {
                 $scope.isMyNewTicketLoadComplete=true;
                 }
                 else
                 {
                 $scope.ticketList.toDo=$scope.ticketList.toDo.concat(response.data.Result);
                 }

                 }


                 }), function (error) {
                 console.log("new ticket error");
                 }*/
                pickGroupCompletedTickets($scope.CompletedTicketPage);
            }
        }

    };


    $scope.gotoTicket = function (data) {
        $rootScope.$emit('newTicketTab',data);
        $scope.closeTicketInbox();

    };

    $('#scrltodo').scroll(function () {
        var raw=$('#scrltodo')[0];
        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight)
        {
            $scope.showMoreNewTickets();
        }

    });
    $('#scrlopen').scroll(function () {
        var raw=$('#scrlopen')[0];
        $scope.showMoreOpenTickets();

    });
    $('#scroldone').scroll(function () {
        var raw=$('#scroldone')[0];
        $scope.showMoreCompletedTickets();

    });



    $scope.closeTicketInbox = function () {
         $('#mainTicketWrapper').addClass('display-none').
         removeClass('display-block fadeIn');

    };




});