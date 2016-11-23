Librivox-Search

This is an Angular.js App for searching audiobooks on Librivox.org.
The Search is an author search, which is then filterable by title words.
The app currently has two variants: (1) librivox_search.html which simply displays a filterable list of results, and (2) librivox_search_with_views.html which displays individually selected audiobooks in a separate pane.

In order to install Angular JavaScript files, run Bower on the command line.  Angular dependencies are included in the Bower.json file.  
Angular.js will automatically be installed as a dependency of any other modules.

$ Bower install

Note that GIT is reconfigured to work from behind a proxy wall, which sometimes causes problems running Bower.  The git:// protocol has been 
changed to https:// using the following command, which sets the "[url]" section of the "/.git/config" file.

    $ git config url."https://".insteadOf git://

That should not cause any problems.  But to remove the configuration setting, use:

    $ git unset url."https://".insteadOf git://



Changes:

6/15/2015 -- Added Angular performance monitor to "librivox_search_with_views.html".  This may be enabled by adding the following after the <body>
             tag:  <div ng-performance></div>  See: https://github.com/blndspt/ngPerformance
6/28/2015 -- Added bower.json to formalize use of bower to install angular files.
7/4/2015 -- Updated to use Angular state-based ui-router (angular-ui-router.js) module rather than route-based ngRoute (angular-route.js).
            Updated "librivox_search_with_views.html" only.  "librivox_search.html" still uses ngRoute.
         -- Added .gitignore to exclude backup file folders.