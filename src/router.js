import { Router } from 'express';
import * as DoFiles from './controllers/dofile_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

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

router.post('/signin', requireSignin, UserController.signin);
router.post('/signup', UserController.signup);

router.get('/runcode', (req, res) => {
  res.send(`Returned code and a random number ${Math.random() * 100}`);
});

export default router;
