## Dependencies
Make sure you have node, npm, ruby, bower, and gulp installed on your machine.

## Getting Started
When building the project for the very first time, run the following command

- `npm install`
- `bower install`

## Building

To execute a full build of the project, execute the following command

`gulp` or `gulp build`

## Running
To run the project, execute the following command

`gulp serve`

To run the project in production mode (i.e. running against the files within the dist folder), execute the following command

`gulp serve:dist`

## Deploying to Azure or AWS
This project comes packaged with a file `app.js` that will run a server against the dist folder. This is defined within the package.json and will be executed if this entire project is deployed to Azure or AWS.