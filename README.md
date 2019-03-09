# CloudBackup v0.1
## What it does:
Uploads files to Google Drive for backup

### Features
* periodically uploads files from specified folders
* deletes the files after succesfull upload
* notifies via telegram of any errors


## Architecture
Language Javascript for Node
### Config
* TELEGRAM_API_KEY - .env
* An array of folders path - ./config.js

### Components
* `googleapis` for Google Drive access
* `fs` for file system access
* `request` for telegram notification 

### Structure
Basically it is a script that runs, and at a set period scans the folders and performs an upload.
While the files are being uploaded we do not want to start the same upload during the next folder scan.
So it has an array with the currently uploaded file paths. Or better a set. 
And every time the new file is found it is checked that is is not in the Set.
If the file is uploaded, and the 'deleteAfterUpload' is set it it deleted.
For added security the mimal oauth scope is used (the one that can access only the files that were created using the app)
For stability `pm2` is used.
For config: a separate file `config.js`

#### Modules overview
* `upload` takes an array of file paths, and returns a promise
* `getAuth` handles all the auth
* `getConfig` gets a list of folder paths from the config, plus API keys etc
* `getFileList` returns an array of files paths an array of folder paths
* `sendMessage` takes a text and sends it to a set userId from config
* `main` takes an array of folders from config and gets new files in those folders, starts uploading them and adds paths to a Set. Skips if the number of files being uploaded is above 4

### Error handling
All errors are sent to Telegram and logged to console. A gracefull fail is expected. A restart after failure is upon `pm2`
