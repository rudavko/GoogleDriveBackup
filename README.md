# CloudBackup v0.1
## What it does:
Uploads files to Google Drive for backup

### Features
* scans folders for files and uploads the files (no hierarchy) 
* can delete the files after succesfull upload
* after the files have been uploaded can be restarted to rescan the folders
* (not yet) notifies via telegram of any errors


## Architecture
Language Javascript for Node
### Config
* TELEGRAM_API_KEY - .env
* credentials.json - Google API credentials
* An array of folders path - ./config.js

### Components
* `googleapis` for Google Drive access
* `fs` for file system access
* `request` for telegram notification 

### Structure
Basically it is a script that runs, scans the folders and performs an upload of found files.
If the file is uploaded, and the 'deleteAfter' is set it it deleted.
For added security the minimal oauth scope is used (the one that can access only the files that were created using the app)
For continious monitoring and uploads `pm2` can be used.
For config: a separate file `config.js`

#### Modules overview
* `upload` takes an array of file paths, and returns a promise
* `getAuth` handles all the auth
* `getConfig` gets a list of folder paths from the config, plus API keys etc
* `getFilesList` returns an array of files paths an array of folder paths
* `sendMessage` takes a text and sends it to a set userId from config
* `main` takes an array of folders from config and gets files in those folders, starts uploading them and adds paths to a Set. Skips if the number of files being uploaded is above the maxConcurent setting from config

### Error handling
All errors are sent to Telegram and logged to console. A gracefull fail is expected. A restart after failure is upon `pm2`
