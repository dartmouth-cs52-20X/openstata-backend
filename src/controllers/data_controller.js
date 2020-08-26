import Data from '../models/data_model';

export const getDataFromName = async (fileName) => {
  return Data.findOne({ fileName });
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
export const insertAllUrls = async (parsedOutput) => {
  try {
    const response = await Promise.all(parsedOutput.map(async (object) => {
      const newObj = { ...object };
      if (object.command === 'use') {
        // get rid of quotes if they exist
        const filename = object.args[0];
        if (/^".*"$/.test(filename)) object.args[0] = filename.slice(1, -1);
        // search the file
        const data = await getDataFromName(object.args[0]);
        if (!data) throw new Error(`${filename} not found`);
        // add the real URL in
        newObj.args.unshift(data.url);
      }
      if (object.command === 'merge') {
        // get rid of quotes if they exist
        const filename = object.args[2];
        if (/^".*"$/.test(filename)) object.args[2] = filename.slice(1, -1);
        // search the file
        const data = await getDataFromName(object.args[2]);
        if (!data) throw new Error(`${filename} not found`);
        // add the real URL in
        newObj.args.splice(2, 0, data.url);
      }
      if (object.command === 'log' && object.args.length === 2) {
        // get rid of quotes if they exist
        const filename = object.args[1];
        if (/^".*"$/.test(filename)) object.args[1] = filename.slice(1, -1);
      }
      return newObj;
    }));

    return [null, response];
  } catch (error) {
    return [error];
  }
};
