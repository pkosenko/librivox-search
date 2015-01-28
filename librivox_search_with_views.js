    // Librivox Search Angular Module

    var librivoxSearch = angular.module('librivoxSearch', ['ngRoute']);
    librivoxSearch.controller('librivoxSearchController', function ($scope, $http) {
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
                $scope.status = status;
                // $scope.records += data.books.length; 
                $scope.records += 'Number of Author Records: ' + data.books.length; 
                // + ' showDesc: ' + $scope.showDesc; = undefined ???
                // We need a no records found message. See error()
                // Clean up the HTML tags in the description data
                // regex removes all HTML tags:  str.replace(/<\/?[^>]+>/gi, '')  "gi" modifier is global and case insensitive
                /*
                for (var i = 0; i < data.books.length; i++) {
                    data.books[i].description = data.books[i].description.replace(/<\/?[^>]+>/gi, '');
                }
                */
            }).error(function (data, status) {
                $scope.status = status;
                switch(status) {
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

    // Route controllers
    librivoxSearch.controller('BookController', function ($scope, $http, $routeParams) {
        $scope.params = $routeParams;
        jsonp = '?format=jsonp&callback=JSON_CALLBACK';
        searchURL = 'https://librivox.org/api/feed/audiobooks/id/' + $routeParams.bookId + jsonp;
        $http.jsonp(searchURL).success(function (data, status) {
            $scope.bookId = $routeParams.bookId;
            $scope.data = data;
            $scope.book = data.books[0];
            $scope.authors = data.authors;
            // Use the htmlToPlaintext filter to clean up the HTML in book.description
            // if $scope.book.url_other = null (which is usually the case), ng-if will 
            // suppress the "OTHER URL" paragraph.  But will it return for other existing data?
            // console.log('url_other' + $scope.book.url_other);
        }).error(function (data, status) {
            $scope.status = status;
            switch (status) {
                case 404:
                    $scope.error = 'Unable to retrive book data. Error: ' + status;
                    break;
                case 500:
                    $scope.error = 'Server error. Error: ' + status;
                    break;
                default:
                    $scope.error = 'Unknown error. Please contact email@domain.com.'
            }
        });
    });

    // Route configuration

    librivoxSearch.config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/Book/:bookId', {
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

    // Create a service that can be used by multiple controllers
    /*
    librivoxSearch.factory('AlbumService', function ($http) {

        var SearchDataService;

        // $http request and assign response to service
        $http.get('https://graph.facebook.com/v2.0/1234567890/albums?fields=id,type,name,cover_photo,description&access_token=TOKEN')
        .success(function(data) {
            SearchDataService = data;
        });
        return AlbumService;
    });
    */


   
