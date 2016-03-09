gulpfile.js

Running the 'gulp' command from profile-connector folder will build the dev folder, dependencies, and start the server and web page. This is the default process.
Gulp will remain running in the terminal and monitor a set of files for changes. When a change is detected it will recompile and inject the changes into the web browser.
Hitting 'Ctrl + C' twice will terminal that instance of the server on the web browser and return the terminal.

current functions are:
init: copy bower_components folder to the dev location if it does not exist, else nothing

build-app.js: compiles all the js files needed in the project to one file named 'app.js'
    -this includes the files ending in .js at locations ./app/app.js, ./app/controllers/.js, and ./app/views/templates.js (this file only exists for gulp, it will never be viewable when the default process is run. It is a compilation of views in the ./app/views location)
    -This task requires that prepareTemplates task runs first

prepareTemplates: this compiles all of the ./app/views .html files into a single folder named templates.js in the same file.  The templates.js file is used in compiling the main app.js file

clean-templates-file: removes the templates.js file created in the prepareTemplates task.
    -This task requires that build-app.js runs first.
    
styles: compile all the stylesheets with extensions of '.scss' --- currently not used in the default processes

html: simply copy the main html file, index.html, to the dev location

browserSync: spins up a server and launches a web browser from the dev location, must have index.html to run

watch: watch for any changes in html and js files in the app folder. This task requires that browserSync to run first.

default: this is the task that is run when gulp is ran with no parameters ('gulp' vs 'gulp init'). Currently this task will run the following tasks: init, build-app.js, html, styles, clean-templates-file, and watch.

Running any of the above functions in the manner of : 'gulp init' or 'gulp prepareTemplates' will only run that task alone.
