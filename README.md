# Open Stata

## What is Open Stata?

Open Stata is an in-browser replication of the basic functionality of the proprietary statistical software Stata,
combined with free tutorials and sample datasets to get anyone started with learning it.

## Architecture

**Frontend** 
- UI Styling: CSS and Material-UI
- Frontend structure: React
- Frontend state management: Redux
- API calls: Axios
- Authentication: jwt

**Backend**
- Platform: Node/Express
- Parser generator: Nearley.js
- Microservice HTTP calls: Axios
- Database: MongoDB and Mongoose
- Authentication: Passport.js

**Statistics Microservice**
- Platform: Flask
- Statistics: econtools, pandas

## Setup

To get the backend running, a few things need to be set up. It relies on having an amazon s3 bucket to record data uploads,
as well as a "secret" for jwt hashing purposes. Before you do anything else, first `yarn` to install all the required libraries.

Next, follow this guide to set up your own s3 bucket: https://devcenter.heroku.com/articles/s3#s3-setup
Instead of setting the heroku variables, add those to a `.env` file you can create in the root directory.

Next, add an `AUTH_SECRET` equal to any arbitrary string to your `.env` file. This will enable jwt authentication.

Finally, make sure you have MongoDB installed and running. You can optionally create a cluster online and connect to it,
or just host the database locally. If you would like to add an online cluster, add the correct `MONGODB_URI` to your `.env` file.

At this point, your `.env` file should look like this:
```
AWS_ACCESS_KEY_ID=.....
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=....
AUTH_SECRET=...
MONGODB_URI=... (optional)
```
With these added, you're ready to either `yarn start` to run the server, or `yarn dev` to enable hot reloading!

If you want to modify the parser grammar, you will need to additionally globally install the Nearley compiler.
To do this, `npm install -g nearley`. (I prefer to use npm for global packages, but yarn will probably work too.)

After installing Nearley globally, you can `cd` into the `/src/parser` directory, and run the command
`nearleyc /grammars/grammar.ne (or whatever other .ne file) -o index.js` to compile a grammar file.
This grammar file is automatically fed into the parser, which takes in Stata code and parses it into
a flattened abstract syntax tree to send to the Flask microservice.
You can test this grammar using the testing scripts in the `/src/parser/testing` directory if you like.

## Deployment

Frontend: Netlify
https://open-stata.netlify.app/

Backend: Heroku
https://open-stata.herokuapp.com/

Backend Microservice: Heroku
https://open-stata-other-api.herokuapp.com/

## Authors

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
|<img width="1604" alt="Jared Cole" src="https://ca.slack-edge.com/EQ19QMD6Z-W010PHYJ09K-4da5de6cc77e-512">  [Jared Cole](https://github.com/jcole13) |  <img width="1604" alt="Arjun Srinivasan" src="https://avatars1.githubusercontent.com/u/45978377?s=460&u=2a9922baf91b1020c1ae653413de2f99226cce38&v=4"> [Arjun Srinivasan](https://github.com/arjunsrini) |<img width="1604" alt="Jeff Liu" src="https://avatars2.githubusercontent.com/u/28827171?s=400&u=be3d4e6655e44e616ffa29eef48d8d1128b2285a&v=4"> [Jeff Liu](https://github.com/jeffzyliu) |
|<img width="1604" alt="Jack Keane" src="https://avatars3.githubusercontent.com/u/52009851?s=400&u=e4daa8d5c175fd03493a5cd514da98d3db318929&v=4"> [Jack Keane](https://github.com/jakeane) |  <img width="1604" alt="Val Werner" src="https://ca.slack-edge.com/EQ19QMD6Z-W01102CDBFG-d3a314d4505e-512"> [Val Werner](https://github.com/valrw) |<img width="1604" alt="Chris Sykes" src="https://ca.slack-edge.com/EQ19QMD6Z-W015TJB797Y-f381f18a5fb7-512"> [Chris Sykes](https://github.com/chriscsykes) |


## Acknowledgments

The CS52 Teaching team!
