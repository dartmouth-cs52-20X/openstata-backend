import LogFile from '../models/logfile_model';

export const createLogFile = (req, res) => {
  LogFile.findOneAndDelete({ fileName: req.body.fileName, author: req.user._id }) // delete a file of the same name if it exists
    .then((result1) => {
      const logfile = new LogFile({
        fileName: req.body.fileName,
        content: req.body.content,
        author: req.user._id,
      });
      logfile.save()
        .then((result) => {
          res.json({ message: 'log file success' });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    });
};

export const getLogFile = (req, res) => {
  LogFile.findOne({ fileName: req.body.fileName, author: req.user._id })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getLogFiles = (req, res) => {
  LogFile.find({ author: req.user._id })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteLogFile = (req, res) => {
  LogFile.findOneAndDelete({ fileName: req.body.fileName, author: req.user._id })
    .then((result) => {
      res.json({ message: 'Post deleted!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// saves all dofiles that are in a dictionary of filename: content
// this happens after execution from flask
export const saveLogFiles = async (logfiles, userID) => {
  if (!userID) return [null];
  try {
    await Promise.all(Object.entries(logfiles).map(async ([fileName, content]) => {
      let logFile = await LogFile.findOne({ fileName, author: userID });
      if (!logFile) logFile = new LogFile({ fileName, content, author: userID });
      else logFile.content = content;
      await logFile.save();
      return logFile;
    }));

    return [null];
  } catch (error) {
    return [error];
  }
};
