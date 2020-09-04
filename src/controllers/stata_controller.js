import axios from 'axios';

// microservice url to post AST parsed output to
const FLASK_URL = 'https://open-stata-other-api.herokuapp.com/do';

// eslint-disable-next-line import/prefer-default-export
export const execute = async (parsed, tutorialID) => {
  try {
    const response = await axios.post(FLASK_URL, { dofile: parsed, tutorialID });
    return [null, response];
  } catch (error) {
    return [error];
  }
};
