import Data from '../models/data_model';

export const getDataFile = async (fileName, user) => {
  return Data.findOne({ fileName, $or: [{ user }, { user: null }] });
};

export const insertData = async (data) => {
  const newDataFile = new Data(data);
  await newDataFile.save();
  return newDataFile;
};

export const getDataFiles = async () => {
  return Data.find().sort('-createdAt');
};

// replace all virtual filenames with their real URLs
export const insertAllUrls = async (parsedOutput, userID) => {
  try {
    const response = await Promise.all(parsedOutput.map(async (object) => {
      const newObj = { ...object };
      if (object.command === 'use') {
        const filename = object.args[0];
        // search the file
        const data = await getDataFile(filename, userID);
        if (!data) throw new Error(`${filename} not found`);
        // add the real URL in
        newObj.args.unshift(data.url);
      }
      if (object.command === 'merge') {
        const filename = object.args[2];
        // search the file
        const data = await getDataFile(filename, userID);
        if (!data) throw new Error(`${filename} not found`);
        // add the real URL in
        newObj.args.splice(2, 0, data.url);
      }
      return newObj;
    }));

    return [null, response];
  } catch (error) {
    return [error];
  }
};
