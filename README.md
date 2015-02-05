# prototype-template

A grunt skeleton useful for quickly prototyping ideas

## File structure ##
All code in `src/styles/main.scss` is exported into `public/styles/main.css` with any includes

All code in `javascripts/app.js` is exported to the same folder structure in the `public/` folder

## To run ##
* Run `grunt` to compile all assets and watch for changes
* In a separate terminal tab run `grunt connect` to set up a server on 127.0.0.1:9001 that is accessible from any device on the network and reloads when any changes are detected by `watch`
