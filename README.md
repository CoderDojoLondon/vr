# VR Tutorial
This repository contains the source code for an interactive VR tutorial using A-Frame designed for use at Coderdojo (London).

The server is _probably_ currently running at [vr.dewardt.uk](http://vr.dewardt.uk) - check it out!

This is still work in progress and there are numerous flaws that need to be addressed but with that said it is in use as part of a Coderdojo session. We would really welcome any support, ideas and pull requests.

# How it works

**Note:** you must have [node](https://nodejs.org/) and npm (this should come with node) installed. We're using the LTS version of node and the latest of npm (once you have installed node type `npm install -g npm@latest` to update it)

Once you have node and npm you can run the command `npm i` in the root directory of the source code and it should install all the packages (this can take a while).

We primarily edit the files in the folder `src/`. In that folder you will find 4 others called:
- js
- sass
- tutorials
- views

### Compiling

These are all watched and compiled by gulp. In order to run gulp you need to have it installed `npm install -g gulp` and then in the command line type `gulp`, ensuring you are in the root directory of the source code. It should then run tasks from a file called `gulpfile.js`. The tasks each correspond to one of the aforementioned folders. Once it finished running the tasks it should exit. In the root directory you will find a directory called `build/` (Note: this is in the .gitignore file).

### Running

Once everything has been compiled into the `build/` folder you can now run the server. This can be done simply with `npm start` (see `package.json` scripts for more information). You should then see a message to the effect of `VR server listening on http://127.0.0.1:3000`. When you see that message you can visit the website in your local browser and everything should load.

### Developing (Compiling II)

While compiling once is great, it becomes quite cumbersome when trying to rapidly prototype new changes. This is why we've created a `gulp live` script. Running this script with first compile everything like normal but it will also watch for new changes to files in the `src/` folder and then automatically re-compile. **Beware:** we do some caching on the server so make sure you refresh the page a couple of times to force it to re-download the new files (this might change soon in development mode).
