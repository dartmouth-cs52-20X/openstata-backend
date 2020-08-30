import DoFile from '../models/dofile_model';

export const createDoFile = (req, res) => {
  const dofile = new DoFile({
    fileName: req.body.fileName,
    content: req.body.content,
    author: req.user._id,
  });
  dofile.save()
    .then((result) => {
      res.json(dofile._id);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const saveDoFile = (req, res) => {
  const updatedValues = {
    content: req.body.content,
    fileName: req.body.fileName,
    author: req.user._id,
  };
  DoFile.findByIdAndUpdate(req.params.id, updatedValues, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getDoFile = (req, res) => {
  DoFile.findById(req.params.id)
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getTutorials = (req, res) => {
  DoFile.find({ author: req.user._id, tutorialID: { $ne: null } })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const getDoFiles = (req, res) => {
  DoFile.find({ author: req.user._id, tutorialID: null })
    .then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteDoFile = (req, res) => {
  DoFile.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json({ message: 'Dofile deleted!' });
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
