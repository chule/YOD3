# D3 / Grunt / Bower 

## Prerequisites

You must have node.js and its package manager (npm) installed. You can get them from http://nodejs.org/.
Bower is also needed http://bower.io/

## Setup

```
npm install && bower install
```

## Running in development mode

If you want to start a component in development mode, simply do

```
grunt serve
```
Then you can access it at http://localhost:9000
All source files are un /app/ folder

## Creating distribution

To create distribution package, do

```
grunt build
```

Distribution files will be available in /dist/ folder 
