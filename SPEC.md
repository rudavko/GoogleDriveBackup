#### Modules overview
*   `upload` takes an array of file paths, and returns a promise
*   `getAuth` handles all the auth
*   `getConfig` gets a list of folder paths from the config, plus API keys etc
*   `getFilesList` returns an array of files paths an array of folder paths
*   `sendMessage` (not yet) takes a text and sends it to a set userId from config
*   `main` takes an array of folders from config and gets files in those folders, starts uploading them and adds paths to a Set. Skips if the number of files being uploaded is above the maxConcurent setting from config

##### `auth`
1.  Checks the `oauth2.keys.json`
2.  Checks if it has the `token` field and it is valid
3.  Returns oauth2 object token
#### `main`
1.  Gets folders from config + 'uploading' folder
2.  Gets files list from folders
3.  Sends files list to `upload` module
4.  Every n seconds repeats steps 2 -- 4
#### `upload`
Has a Set 'uploading'
1.  Checks that 'uploading' length is less then 4
2.  Checks that the file is not in the Set
3.  Moves the file into an 'uploading' folder
4.  Adds it to the Set and starts uploading it
5.  Once done -- removes the file from disk and from the Set
#### `sendMessage`
1.  Receives a text
2.  Gets the API key from the config
3.  Sends a requst to the server
