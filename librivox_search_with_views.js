    // Librivox Search Angular Module

    var librivoxSearch = angular.module('librivoxSearch', ['ui.router', 'blndspt.ngPerformance']);
    librivoxSearch.controller('librivoxSearchController', function ($scope, $http, searchData, $state, $location) {
        // book data:
        baseURL = 'https://librivox.org/api/feed/audiobooks/'; // base URL
        $scope.hideDesc = 'true'; // a value causes description to HIDE -- a little confusing
        $scope.showDesc = false;
        // Scope function to change the class name of the book view based on state
        $scope.bookViewClass = function () {
            // state name is 'book' or 'default'  = state.current.name
            return ($state.current.name == 'default') ? 'rightblock-white' : 'rightblock-green';
        };
        $scope.reset = function () {
            // clear the search box
            $scope.searchTerm = '';
            // clear the filter
            $scope.filterText = '';
            // clear the result number
            $scope.records = '';
            // empty the data object 
            $scope.data = {};
            // remove any existing record display from the view . . . return to 'default' blank state
            $state.go('default');
        };
        // search button method
        $scope.processSearch = function () {  // there is nothing to pass to the function
            // First time empty search term submission is undefined, second is ''
            // Default maximum records return is 50 -- which seems to be about as many 
            // books as one might expect any author to have written -- or at least is probably
            // more than have been audio recorded; but the number CAN be changed, if needed.
            // We want to be able to suppress display of description with a checkbox option. use ng-hide
            $scope.data = '';  // needed for ng-repeat display
            $scope.records = '';  // number of records returned
            $scope.searchURL = baseURL;   // base URL
            if ($scope.filterText == undefined) {
                $scope.filterText = ''; // otherwise data does not display on first search
            };
            // hideDesc = "" = false = show the element; hideDesc = "true" = hide the element
            $scope.showDesc == true ? $scope.hideDesc = '' : $scope.hideDesc = "true";
            // Assemble the JSONP URL
            jsonp = '?format=jsonp&callback=JSON_CALLBACK';
            if ($scope.searchTerm != undefined && $scope.searchTerm != '') {
                $scope.searchURL += "author/" + $scope.searchTerm;
            };
            $scope.searchURL += jsonp;
            $http.jsonp($scope.searchURL).success(function (data, status) {
                $scope.data = data;
                searchData.set(data);  // store data in searchData service
                $scope.status = status;
                // $scope.records += data.books.length; 
                $scope.records += 'Number of Author Records: ' + data.books.length;
                // + ' showDesc: ' + $scope.showDesc; = undefined ???
                // We need a no records found message. See error()
                $scope.bookIds = [];  // Create a book id array  
                // Since the returned JSON data is an ARRAY of book objects, we need to grab the book
                // data by array index.  But ng-repeat $index works ONLY if you do not FILTER the book data; 
                // when the data is FILTERED and limited, ng-repeat RECALCULATES the indexes to only the 
                // number of books displayed and $index is no longer in synch with the proper JSON book 
                // object in the full search data list. An array of book IDs allows us to use indexOf(BOOK_ID)
                // to retrieve a fixed book index.
                for (n = 0; n < data.books.length; n++) {
                    $scope.bookIds.push(data.books[n].id); // add up an array of book IDs
                }
            }).error(function (data, status) {
                $scope.status = status;
                switch (status) {
                    case 404:
                        $scope.records = 'No such author was found in the database. Error: ' + status;
                        break;
                    case 500:
                        $scope.records = 'Server error. Please try again later. Error: ' + status;
                        break;
                    default:
                        $scope.records = 'Unknown error. Please contact email@domain.com.'
                }
            });  // end of jsonp(), success() and error()
        }
    });

    librivoxSearch.factory('searchData', function () {
        // Service to save search data for use in ANY controller
        var sdata = {};
        return {
            set: function (data) {
                sdata = data;
            },
            getBook: function (bookIndex) {
                return sdata.books[bookIndex];
            }
        };
    });

    // Route controllers
    librivoxSearch.controller('BookController', function ($scope, $http, $stateParams, searchData) {
        // bookIndex is retrieved from $scope.bookIds in the search controller and passed as a route
        // parameter for the individual book.html view.
        $scope.params = $stateParams;
        $scope.book = searchData.getBook($stateParams.bookIndex);  // get the book object from the searchData service
    });

    // Route configuration for ng-router -- disabled
    // Why when I disable regular ngRoute are the listing data markers suddenly showing up 
    // in the search listing for no data, and the search is no longer working.
    // The ui-view has NOTHING to do with any of that?

    /* 
    librivoxSearch.config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/Book/:bookIndex', { // use ng-repeat $index as book ID
            templateUrl: 'book.html',
            controller: 'BookController'
            // resolve: is not needed here (YET?)
         })
    });
    */

    // Route configuration for ui-router
    // I guess we can either go() to the state, or 
    // go to it by entering the URL?
    // Note: $urlRouteProvider is NOT a service (it is "$urlRouterProvider") -- used for redirection of erroneous URLS

    librivoxSearch.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('book', {
                url: '/Book/:bookIndex',
                templateUrl: 'book.html',
                controller: 'BookController'
            })
            .state('default', {
                // leave the view blank -- will this work?
                url: '',
                template: ''
            });
    });

    // filter to strip out HTML
    librivoxSearch.filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<\/?[^>]+>/gi, '');
        }
    });   
