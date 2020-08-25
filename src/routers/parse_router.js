import { Router } from 'express';
// will add this later
// import { requireAuth } from './services/passport';
import * as Parser from '../controllers/parsing_controller';
import * as DataController from '../controllers/data_controller';
import * as StataController from '../controllers/stata_controller';

const router = Router();

// handle parsing and execution
router.route('/')
  .post(async (req, res) => {
    const { dofile } = req.body;
    try {
      const parsed = Parser.parseStata(dofile);
      const [err, fixedParsed] = await DataController.insertAllUrls(parsed);
      // URL replacement error
      if (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
        return;
      }
      const [error, response] = await StataController.execute(fixedParsed);
      // some runtime error
      if (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
        return;
      }
      res.json(response.data);
    } catch (error) {
      // parsing error
      console.log(error);
      // gets rid of all the weird stuff
      const pos = error.message.indexOf('Unexpected "');
      const message = error.message.slice(0, pos - 1);
      res.status(400).json({ error, message });
    }
  });

// dummy route for us to add some sample datasets
router.route('/add')
  .post(async (req, res) => {
    try {
      const data = req.body;
      const response = await DataController.insertData(data);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  });

export default router;
