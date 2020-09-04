import { Router } from 'express';
import { optionalAuth } from '../services/passport';
import * as Parser from '../controllers/parsing_controller';
import * as DataController from '../controllers/data_controller';
import * as StataController from '../controllers/stata_controller';
import * as LogFileController from '../controllers/logfile_controller';

const router = Router();

// handle parsing and execution
router.route('/')
  .post(optionalAuth, async (req, res) => {
    try {
      const { dofile, tutorialID } = req.body;
      if (!dofile.trim()) {
        console.log('missing input');
        res.status(400).json({ output: ['missing input'] });
        return;
      }
      const realDoFile = `${dofile}\n`;
      const userID = req.user ? req.user._id : null;
      const parsed = Parser.parseStata(realDoFile);
      const [parseErr, fixedParsed] = await DataController.insertAllUrls(parsed, userID);
      // URL replacement error
      if (parseErr) {
        console.log(parseErr);
        res.status(400).json({ output: [parseErr.message] });
        return;
      }
      const [runErr, response] = await StataController.execute(fixedParsed, tutorialID);
      // some runtime error
      if (runErr) {
        console.log(runErr);
        res.status(400).json({ output: [runErr.message] });
        return;
      }
      const { logfiles, output } = response.data;
      const [logErr] = await LogFileController.saveLogFiles(logfiles, userID);
      if (logErr) {
        console.log(logErr);
        res.status(400).json({ output: [logErr.message] });
        return;
      }
      res.json({ output });
    } catch (error) {
      // parsing error
      console.log(error);
      // gets rid of all the weird stuff
      const pos = error.message.indexOf('Unexpected "');
      const message = error.message.slice(0, pos - 1);
      res.status(400).json({ output: [message] });
    }
  });

// testing route to check parsing only
router.route('/test')
  .post(async (req, res) => {
    try {
      const { dofile, tutorialID } = req.body;
      if (!dofile.trim()) {
        console.log('missing input');
        res.status(400).json({ output: ['missing input'] });
        return;
      }
      const realDoFile = `${dofile}\n`;
      const parsed = Parser.parseStata(realDoFile);
      const [err, fixedParsed] = await DataController.insertAllUrls(parsed);
      // URL replacement error
      if (err) {
        console.log(err);
        res.status(400).json({ output: [err.message] });
        return;
      }
      res.json({ dofile: fixedParsed, tutorialID });
    } catch (error) {
      // parsing error
      console.log(error);
      // gets rid of all the weird stuff
      const pos = error.message.indexOf('Unexpected "');
      const message = error.message.slice(0, pos - 1);
      res.status(400).json({ output: [message] });
    }
  });

export default router;
