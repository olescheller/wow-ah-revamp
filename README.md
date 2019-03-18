# wow-ah-revamp

Before running the application on your local machine, you need to install python3.7, node, npm and mongoDB

## Preprocess data

1. Install the requirements from [requirements.txt](https://github.com/oscheller1/wow-ah-revamp/blob/master/backend/wowapi_preprocessor/requirements.txt)
2. Start mongodb on port 27017
2. Run [data_reorganizer.py](https://github.com/oscheller1/wow-ah-revamp/blob/master/backend/wowapi_preprocessor/data_reorganizer.py) to download the data from the WOW-API. This may take two minutes.

## Run GraphQL Server
1. From the root directory run 
```bash 
  npm run graphql
```
The backend runs on port 4000

## Run React Frontend
1. From the root directory run 
```bash
  npm run react
  ```
The frontend runs on port 3000

## Run Elm Frontend
1. Install the elm packages inside the elm root directory via
```bash
  elm install
```
2. Execute the start script [start.sh](https://github.com/oscheller1/wow-ah-revamp/blob/master/frontend/elm/start.sh) to run the Elm Frontend on port 8080

