    // Librivox Search Angular Module

    var librivoxSearch = angular.module('librivoxSearch', []);
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
                        $scope.records = 'Unknown error. Please report to email@domain.com.'
                } 
            });  // end of jsonp(), success() and error()
        }
    });

    // filter to strip out HTML

    librivoxSearch.filter('htmlToPlaintext', function () {
         return function (text) {
            // regex removes all HTML tags:  str.replace(/<\/?[^>]+>/gi, '')  
            // "gi" modifier is global and case insensitive
            return String(text).replace(/<\/?[^>]+>/gi, '');
        }
    }); 



