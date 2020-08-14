const { PythonShell } = require('python-shell');

const pyshell = new PythonShell('testfromjs.py');

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

pyshell.end(function (err,code,signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});

// PythonShell.run('testfromjs.py', null, function (err) {
//   if (err) throw err;
//   console.log('finished');
// });
