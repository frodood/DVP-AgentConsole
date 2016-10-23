/**
 * Created by Damith on 10/20/2016.
 */

agentApp.controller('myNoteCtrl', function ($scope) {


    $("#txtTakeNote").on('click', function () {
        $('#addNoteRow').addClass('display-none');
        $('#addNoteWindow').removeClass('display-none');
    });


    //sample test layout
    $scope.noteLists = [];
    $scope.note = {};
    $scope.addNewNote = function () {
        return {
            close: function () {
                $('#addNoteWindow').addClass('display-none');
                $('#addNoteRow').removeClass('display-none');
            },
            done: function () {
                console.log($scope.note);
                $scope.noteLists.push($scope.note);
                $scope.note = null;
                $('#addNoteWindow').addClass('display-none');
                $('#addNoteRow').removeClass('display-none');
            },
            selectColor: function (priority) {
                $scope.note.priority = priority;
                switch (priority) {
                    case 'low':
                        $scope.note.class = 'low';
                        break;
                    case 'normal':
                        $scope.note.class = 'normal';
                        break;
                    case 'urgent':
                        $scope.note.class = 'note-urgent';
                        break;
                    case 'high':
                        $scope.note.class = 'high';
                        break;
                }
            }
        }
    }();


    $scope.gridsterOpts = {
        columns: 6, // the width of the grid, in columns
        pushing: true, // whether to push other items out of the way on move or resize
        floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        minSizeX: 1, // minimum column width of an item
        maxSizeX: null, // maximum column width of an item
        minSizeY: 1, // minumum row height of an item
        maxSizeY: null, // maximum row height of an item
        resizable: {
            enabled: false
        },
        draggable: {
            enabled: true, // whether dragging items is supported
            start: function (event, $element, widget) {
            } // optional callback fired when drag is started,
        }
    };

});