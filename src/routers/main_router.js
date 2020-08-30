import { Router } from 'express';
import * as DoFiles from '../controllers/dofile_controller';
import * as LogFiles from '../controllers/logfile_controller';
import * as UserController from '../controllers/user_controller';
import * as DataController from '../controllers/data_controller';
import { requireAuth, requireSignin } from '../services/passport';
import signS3 from '../services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our project api!' });
});

/// your routes will go here
router
  .route('/dofiles')
  .post(requireAuth, DoFiles.createDoFile)
  .get(requireAuth, DoFiles.getDoFiles);

router
  .route('/dofiles/:id')
  .get(requireAuth, DoFiles.getDoFile)
  .put(requireAuth, DoFiles.saveDoFile)
  .delete(requireAuth, DoFiles.deleteDoFile);

router
  .route('/logfiles')
  .post(requireAuth, LogFiles.createLogFile)
  .delete(requireAuth, LogFiles.deleteLogFile)
  .get(requireAuth, LogFiles.getLogFiles);

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.get('/sign-s3', signS3);

router.route('/data')

  .get(requireAuth, async (req, res) => {
    try {
      const userID = req.user._id;
      const datafiles = await DataController.getUserData(userID);
      res.json(datafiles);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  })

  .post(requireAuth, async (req, res) => {
    try {
      const newData = req.body;
      const response = await DataController.insertData(newData, req.user._id);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

export default router;
