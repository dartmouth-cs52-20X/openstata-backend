import LogFile from '../models/logfile_model';

export const createLogFile = (req, res) => {
  // res.send('post should be created and returned');
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

/*
export const getLogFile = (req, res) => {
  // res.send('single post looked up');
  LogFile.findOne({ fileName: req.body.fileName })
    .then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};
*/

export const getLogFiles = (req, res) => {
  // res.send('single post looked up');
  LogFile.find({ author: req.user._id })
    .then((result) => {
      res.send(result);
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

export const saveLogFiles = (logfiles, userID) => {
  try {
    Object.entries(logfiles).forEach(([fileName, content]) => {
      console.log({ fileName, content });
      // await
    });
    return null;
  } catch (error) {
    return [error];
  }
};
