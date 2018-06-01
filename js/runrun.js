const { exec } = require('child_process');

function runrun(command, silent) {
  silent = silent | true;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (!silent) {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  });
}

module.exports = runrun;