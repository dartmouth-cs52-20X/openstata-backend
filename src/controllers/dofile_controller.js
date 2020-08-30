import DoFile from '../models/dofile_model';

export const createDoFile = (req, res) => {
  // res.send('post should be created and returned');
  const dofile = new DoFile({
    fileName: req.body.fileName,
    content: req.body.content,
    author: req.user._id,
  });
  dofile.save()
    .then((result) => {
      res.send(dofile._id);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const saveDoFile = (req, res) => {
  // res.send('post should be created and returned');
  // if (!req.body.id || !req.body.content || !req.body.fileName) {
  //    return res.status(422).send('Fields not valid');
  // }
  // const { id } = req.body;

  /* DoFile.findOne( {id} )
    .then((dofile) => {
        if (dofile) {
           dofile[content] = req.body.content;
           return dofile.save();
        }
        else {
           const newfile = new DoFile({
               fileName: req.body.fileName,
               content: req.body.content,
               author: req.user._id,
           })
           return newfile.save();
        }
    }); */
  const updatedValues = {
    content: req.body.content,
    fileName: req.body.fileName,
    author: req.user._id,
  };
  DoFile.findByIdAndUpdate(req.params.id, updatedValues, { new: true })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
export const getDoFile = (req, res) => {
  // res.send('single post looked up');
  DoFile.findById(req.params.id)
    .then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getDoFiles = (req, res) => {
  // res.send('single post looked up');
  DoFile.find({ author: req.user._id })
    .then((result) => {
      res.send(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteDoFile = (req, res) => {
  DoFile.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json({ message: 'Post deleted!' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

const tutorials = [
  { fileName: 'tutorial 1', content: '// tutorial 1', tutorialID: 'tutorial-1' },
  { fileName: 'tutorial 2', content: '// tutorial 2', tutorialID: 'tutorial-2' },
  { fileName: 'tutorial 3', content: '// tutorial 3', tutorialID: 'tutorial-3' },
];

export const addTutorials = async (userID) => {
  return Promise.all(tutorials.map(async (tutorial) => {
    const newTutorial = new DoFile({ ...tutorial, author: userID });
    return newTutorial.save();
  }));
};
