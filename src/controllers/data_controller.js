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
        let filename = object.args[0];
        if (/^".*"$/.test(filename)) filename = filename.slice(1, -1);
        // search the file
        const data = await getDataFromName(filename);
        if (!data) throw new Error(`${filename} not found`);
        // add the real URL in
        newObj.args.unshift(data.url);
      }
      return newObj;
    }));

    return [null, response];
  } catch (error) {
    return [error];
  }
};
