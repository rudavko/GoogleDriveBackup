# CloudBackup v1.0-rc1 [![Build Status](https://travis-ci.com/rudavko/GoogleDriveBackup.svg?branch=master)](https://travis-ci.com/rudavko/GoogleDriveBackup)[![CodeFactor](https://www.codefactor.io/repository/github/rudavko/googledrivebackup/badge)](https://www.codefactor.io/repository/github/rudavko/googledrivebackup)
Uploads files to Google Drive for backup

## Getting started
1.  Download the code from GitHub
2.  Download your credentials from https://console.cloud.google.com/apis/credentials and put them into `credentials.json` file
3.  Add some folder paths in the `config.js` (relative or absolute)
4.  `$ npm install` 
5.  `$ node app.js`
6.  Authenticate with your Google account via the instaructinons in the command promt
7.  Sitback, relax and wathc as the script uploads the files into the cloud

### Features
*   scans folders for files and uploads the files (no hierarchy yet) 
*   can delete the files after succesfull upload
*   after the files have been uploaded the script stops and exits
*   (not yet) notifies via telegram of any errors

## Architecture
Language Javascript for Node
### Config
*   credentials.json - Google API credentials
*   config.js - An array of folders path, whether to delete files after upload

### Components
*   `googleapis` for Google Drive access
*   `fs` for file system access 

### Structure
Basically it is a script that runs, scans the folders and performs an upload of found files to Google Drive.
If the file is uploaded, and the 'deleteAfter' is set it is deleted.
For added security the minimal oauth scope is used (the one that can access only the files that were created using the app)
To run the script at sertain intervals an external tool can be used like `cron` or  `pm2`.
Config: a separate file `config.js` and `credentials.json` with Google credentials.

