import { Router } from 'express';
// will add this later
import { optionalAuth } from '../services/passport';
import * as Parser from '../controllers/parsing_controller';
import * as DataController from '../controllers/data_controller';
import * as StataController from '../controllers/stata_controller';
import * as LogFileController from '../controllers/logfile_controller';

const router = Router();

// handle parsing and execution
router.route('/')
  .post(optionalAuth, async (req, res) => {
    const { dofile } = req.body;
    const userID = req.user ? req.user._id : null;
    try {
      const parsed = Parser.parseStata(dofile);
      const [parseErr, fixedParsed] = await DataController.insertAllUrls(parsed, userID);
      // URL replacement error
      if (parseErr) {
        console.log(parseErr);
        res.status(400).json({ error: parseErr.message });
        return;
      }
      const [runErr, response] = await StataController.execute(fixedParsed);
      // some runtime error
      if (runErr) {
        console.log(runErr);
        res.status(400).json({ error: runErr.message });
        return;
      }
      const { logfiles, output } = response.data;
      LogFileController.saveLogFiles(logfiles);
      // tba comments
      res.json({ output });
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
  .post(optionalAuth, async (req, res) => {
    try {
      const userID = req.user ? req.user._id : null;
      const data = req.body;
      data.user = userID;
      const response = await DataController.insertData(data);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  });

router.route('/test')
  .post(async (req, res) => {
    try {
      const { dofile } = req.body;
      const parsed = Parser.parseStata(dofile);
      const [err, fixedParsed] = await DataController.insertAllUrls(parsed);
      // URL replacement error
      if (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ dofile: fixedParsed });
    } catch (error) {
      // parsing error
      console.log(error);
      // gets rid of all the weird stuff
      const pos = error.message.indexOf('Unexpected "');
      const message = error.message.slice(0, pos - 1);
      res.status(400).json({ error, message });
    }
  });

export default router;
