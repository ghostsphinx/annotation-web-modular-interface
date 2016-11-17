# README

## Introduction

You are in the git repository of a web modular interface for media annotation.
The technologies that are used :
	- HTML5
	- CSS3 (Bootstrap -> http://getbootstrap.com/css/)
	- Javascript ES5
The main library used for the interface is React (https://facebook.github.io/react/)
There are also other libraries:
	- PubSubJS (https://github.com/mroderick/PubSubJS): used for publish-subscribe system that allows communication between modules
	- peaks.js (https://github.com/bbc/peaks.js): used for the Waveform module
	- camomile-client (https://github.com/camomile-project/camomile-client-javascript): used to request the server I am using for examples

Since React is used with jsx files, I use Browserify (http://browserify.org/) to bundle the js and jsx files, you need to download reactify to make it work.
In my examples, I use a web-server that allow me to do pre-processing before rendering the website, thanks to NodeJS (https://nodejs.org/en/).

There is also a side project with Meteor (https://www.meteor.com), this is almost the same code without using Browserify.

There are three folders, "code", "documentation" and "modular-annotation-interface-meteor".

"documentation" is where I left some side information, "modular interface" is the file where there are the specs of what I was asked to do (this project is part of an internship), "Existing libraries" is where I write down the js libraries that I could use and why I can or can't use them, and "specification" is where there what I want to implement.

"modular-annotation-interface-meteor" is where the code of the meteor version is, since I left this behind to focus on the original version, the code is not exactly the same. To run the application the linux command is "meteor run --settings ./settings.json" within the folder, but you can remove the settings if you don't need a configuration file.

"code" is where the original application is, and specifically, the "app" folder is where the front-end is, the web-server.js file is for those who use NodeJS, further explanation of how to use Browserify and NodeJS in the next section.

## How to build, run, and create your interface

### Build and run the website
There are two linux command lines, to do in "code" folder:
	- "browserify -t reactify app/js/Application.jsx > app/main.js" : browserify is the command that runs the bundling, so you don't have to use everytime, only when the code changes, -t reactify is necessary because of the use of React, then we have app/js/Application.jsx > app/main.js :
		- > main.js just means that the result will create (or replace if already existing) the file main.js that will be used in the file index.html (if you want to change the name or the location, don't forget to change index.html).
		- Before the ">", you have to write every file that will be in the bundle, but remember that Browserify is smart, it reads all the requires at the beginning of the files, and include in a recursive way all the files (if there is a require in a newly included file, browserify will include it), in this interface, I saw it like a tree with one root, the file "Application.jsx".
	- "nodejs web-server.js --config path/to/config/file.yml" : node or nodejs (following how you installed nodeJS) to serve the website with the file web-server.js (in this file there are few functions that are used specifically for my examples and maybe you don't want, take a look in it). --config ... is not necessary, it is specific for my examples with the Camomile project.

### Architecture of the application
The application is custom-made for Camomile, but every request to the server can be change for your API server, with Promises.
The architecture of the front-end is in the "app" folder :
	- the folder bootstrap is the link to use CSS Bootstrap, and it is ready to use
	- the folder css is for additionnal css files
	- the folder js is for all the modules that are implemented and maybe more that you want to implement :
		- annotation modules implemented and regrouped in the annotation module:
			- selection of corpus and medium are made specifically for Camomile use but you can be inspired by them on how they work. Corpus selection request the server for information and display it, after selection of a value, it is published. Medium selection is more tricky, the values are defined after a value is published with corpus selection, so medium selection subscribe to corpus selection, and after that the value selected is published.
			- Video player and Waveform renders what they are, they subscribe to medium selection in my example, so they appear only when there is a value, and are real-time synchronized (play/pause, seek), they both publish and subscribe to play/pause value and time value. Video player in particular seems complicated, but it is just a composition of small modules.
		- There are a header module and a footer module, which you can change in whatever you want. In the header module there are a title module (if you want to be fancy) and the log system module, which request to the server and publish a boolean logged value.
		- Like it was said in the previous section, the Application module groups all the modules.
		- init.js is Camomile-specific, I use it to have the configuration of the Camomile server and have a Promise with it.
	- the folder lib is for jquery but you can add any library you want
	- index.html is the html file we need to render the website, but it contains just the block that will be filled by React
	- main.js is the bundle file for all the js code

### Changes to do to make it your annotation interface

For every React Component, there are two ways of changing, functionnal part (js) and render part (html).
With the render part (function render in React modules):
	You know that all begin with Application.jsx, it defined how your website will look like, header, annotation and footer. If the header or the footer don't match your taste, you are free to change them, in the example, the annotation part appears only when the user is logged.
	If you want to change the disposition of the annotation part, look at Annotation.jsx, where some modules can appear when you want them to, you can use Bootstrap (but remember _class_ is spelled _className_). You can use every modules that are at your disposal (they are few, so you are free to implement new ones).
With the functionnal part (every other functions) :
	Look how you can add and use a function in React, and there will be no problem. Remember the publish-subscribe system the pass data from one module to another.