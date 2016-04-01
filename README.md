# How to Build the UI


### Requirements
* node and npm

1. run 'npm install' at the root level of the repository
2. run './node_modules/.bin/bower install'.
3. run './node_modules/.bin/gulp build --env dev' to build the app for the dev environment (dev.commerce.spscommerce.com)

* More Environment build options
    - --minify false (will not minify the javascript code)
    - --env prod (build the app for the prod environment)
    - --env prod (build the app for the stage environment)
    - Leave out the --env flag in order to build for a local environment (you will need to supply your own api accepting requests at localhost:8888)
