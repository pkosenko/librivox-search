    // Librivox Search Angular Module

    var librivoxSearch = angular.module('librivoxSearch', ['ngRoute']);
    librivoxSearch.controller('librivoxSearchController', function ($scope, $http, searchData) {
        // book data:
        baseURL = 'https://librivox.org/api/feed/audiobooks/'; // base URL
        $scope.hideDesc = 'true'; // a value causes description to HIDE -- a little confusing
        $scope.showDesc = false;
        // button method
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
            }
            // hideDesc = "" = false = show the element; hideDesc = "true" = hide the element
            $scope.showDesc == true ? $scope.hideDesc = '' : $scope.hideDesc = "true";
            // Assemble the JSONP URL
            jsonp = '?format=jsonp&callback=JSON_CALLBACK';
            if ($scope.searchTerm != undefined && $scope.searchTerm != '') {
                $scope.searchURL += "author/" + $scope.searchTerm;
            }
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
    librivoxSearch.controller('BookController', function ($scope, $http, $routeParams, searchData) {
        // bookIndex is retrieved from $scope.bookIds in the search controller and passed as a route
        // parameter for the individual book.html view.
        $scope.params = $routeParams;
        $scope.book = searchData.getBook($routeParams.bookIndex);  // get the book object from the searchData service
    });

    // Route configuration

    librivoxSearch.config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/Book/:bookIndex', { // use ng-repeat $index as book ID
            templateUrl: 'book.html',
            controller: 'BookController'
            // resolve: is not needed here (YET?)
         })
    });

    // filter to strip out HTML

    librivoxSearch.filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<\/?[^>]+>/gi, '');
        }
    });   
