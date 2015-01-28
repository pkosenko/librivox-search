Librivox_Search was originally written in 2014 by Peter Kosenko and is maintained on Github. Peter Kosenko may be contacted at pfkosenko@gmail.com.

The application was developed with AngularJS v1.3.7 but has been tested and deployed with AngularJS v1.3.8.

If you are an Angular programmer and know how, you are free to modify and use the application however you see fit, as long as you include notice of its source and pass on the open source license to anyone else who wishes to use or alter the application.  Please see the included GNU verson 3 general public license.

http://www.gnu.org/licenses/gpl-3.0.html

See below for a more complicated variant of the application uses Angular partial templates and routing.  It may be more functionality than is needed to do what the application does.

If you want to see a very serious use of the Librivox API, try this entirely redo of Librivox using its remote API: http://librivox.bookdesign.biz/  They also have Android and IPhone Apps.  This is far beyond anything that I have done.

****************

Librivox is a volunteer web site for recording and distributing audio files of books that are in the public domain. This Angular.js "librivox_search.html" single-page app imports data with an AJAX jsonp call to the librivox feeds 
API.

Librivox's feeds API for searching seems to be a little limited at the moment.  Direct title search of the Librivox database doesn't always seem to work well.  For example, "The Scarlet Letter" returns nothing; but "Scarlet Letter"
does.  Author search "Cooper" returns "Spy" (The Spy), but title search "Spy" returns nothing.  Author search seems to be limited to last name, and Title search seems to require full exact title.

The most effective form of search for finding whether an audiobook exists seems to be full Author last name search combined with an Angular filter that will filter on title WORDS, since the filter works on JSON data that has already been imported (rather than uses the limited Librivox database title query).

ISSUES

The book description field seems to need cleaning up.  Librivox apparently allows its contributors to enter a limited number of HTML tags into their descriptions.  Some descriptions have HTML and some don't.  But when Angular renders the description field into a page, the tags show up in angle brackets rather than as rendered HTML elements.  The easiest option was just to eradicate all the HTML from descriptions.  At first I tried an array of tags with .replace(), but the tags were in such a variety of formats that not all of them were caught.
So finally, I just used regex to hammer everything:

	// regex removes all HTML tags:  str.replace(/<\/?[^>]+>/gi, '')  
	// "gi" modifier is global and case insensitive
	for (var i = 0; i < data.books.length; i++) {
		data.books[i].description = 
			data.books[i].description.replace(/<\/?[^>]+>/gi, '');
	}

The title filterText field presents a problem.  When it is undefined, it normally allows NO items to show in the listing.  So to prevent non-display of items on first search, we need to be sure that it is set to a default of '':

    if ($scope.filterText == undefined) {
        $scope.filterText = ''; // otherwise data does not display on first search
    }

User's may not want to display the full book description text field.  So I added a checkbox.  Since this is not a filter, it is not interactive.  If you check or uncheck it and submit the search it works, but to change the display,
you have to resubmit the form, since the functionality is part of the button submit action.  I may try to rework it as a filter.

If you wish to configure other fields (ID, Librivox URL, time) not to display, you can add the following CSS to their paragraph HTML wrapper tags:

    style="display:none"

Or you could go the more complicated route and add ng-hide directives to the separate paragraphs:

    <p ng-hide="hideID" class="ng-hide">ID: {{ book.id }} </p>

Then set the default to hide the element in the application controller:

    $scope.hideID = "true";  
    
Any value will cause the ng-hide directive to read as true; undefined or null string ('') will cause it to read as false. The built-in Angular "ng-hide" class automatically changes the CSS to "display:none" when the directive is true.  It is probably just simpler to add 'style="display:none"' to the paragraph tag.

OR, you could simply DELETE any of the the display fields you don't want.

AVAILABLE DISPLAY FIELDS

If you look at the returned JSON, you could actually use any of the book fields that Librivox defines in your book display.  See the included librivox_api.txt file.

    book.id                     audiobook ID
    book.title                  book title
    book.description            full text description
    book.url_text_source        source of the reading text
    book.language               language
    book.copyright_year         copyright
    book.num_sections           number of MP3 files that make up the audiobook
    book.url_rss                RSS feed URL
    book.url_zip_file           Single downloadable zip file URL
    book.url_project            Reader and audio editor's page (requires account)
    book.url_librivox           Web page for the audiobook's information
    book.url_other              ????
    book.totaltime              total time in hours:minutes:seconds
    book.totaltimesecs          total time in seconds
    book.authors[0].first_name  main author's first name
    book.authors[0].last_name   main author's last name
    book.authors[0].dob         main author's date of birth
    book.authors[0].dod         main author's date of death

In an update of the app, I included an ng-repeat iteration through all of the included authors to display all of them, since they are included in a sub-array of the book object.

One liability of the librivox API is that it returns a 404 (file not found) HTTP response if no such author name is found in the database.  Thus it becomes impossible to tell whether one is getting the 404 for no such author or 
for some other reason.  In other words, JSON error messaging is not clearly developed or not clearly explained in the API.

I have also written a Drupal 7 Module that will import book information from Librivox if you know the book's ID number.  That seems to be the most robust sort of remote search that Librivox offers.  It recovers all data for the item being searched.  The next step is to try to incorporate this librivox search widget into a Drupal Module to enable its use on Drupal sites.

******************

librivox_search_with_views.html
book.html

This page application adds a template partial for display of an individual book as a view.  It pares down the display of search results to Author names and title.  The app passes the book ID in a route to the template controller and retrieves the full range of book data with a second JSONP individual book query to Librivox.

*******************
TO BE DONE:

librivox_search_with_views2.html
book2.html

This version of the app places the JSONP search in a service that SAVES the data from the search, which is then retrieved by the individual audiobook display template.  That is, if I can get it to work.
