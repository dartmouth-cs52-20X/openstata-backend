import axios from 'axios';

const FLASK_URL = 'https://open-stata-other-api.herokuapp.com/do';

// eslint-disable-next-line import/prefer-default-export
export const execute = async (parsed) => {
  try {
    const response = await axios.post(FLASK_URL, { dofile: parsed });
    return [null, response];
  } catch (error) {
    return [error];
  }
};
