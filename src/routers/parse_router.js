import { Router } from 'express';
// will add this later
// import { requireAuth } from './services/passport';
import * as Parser from '../controllers/parsing_controller';

const router = Router();

router.route('/')
  .post((req, res) => {
    const { dofile } = req.body;
    try {
      const result = Parser.parseStata(dofile);
      res.json(result);
    } catch (error) {
      console.log(error);
      // gets rid of all the weird stuff
      const pos = error.message.indexOf('Unexpected "');
      const message = error.message.slice(0, pos - 1);
      res.status(400).json({ error, message });
    }
  });

export default router;
