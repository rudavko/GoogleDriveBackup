##### `auth`
1. Checks the `oauth2.keys.json`
2. Checks if it has the `token` field and it is valid
3. Returns oauth2 object token
#### `main`
1. Gets folders from config + 'uploading' folder
2. Gets files list from folders
3. Sends files list to `upload` module
4. Every n seconds repeats steps 2 -- 4
#### `upload`
Has a Set 'uploading'
1. Checks that 'uploading' length is less then 4
2. Checks that the file is not in the Set
2. Moves the file into an 'uploading' folder
3. Adds it to the Set and starts uploading it
4. Once done -- removes the file from disk and from the Set
#### `sendMessage`
1. Receives a text
2. Gets the API key from the config
3. Sends a requst to the server
