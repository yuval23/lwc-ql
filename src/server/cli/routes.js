const { exec } = require('child_process');

function sfdx(req, res) {
    // build the command
    let sfdxCommand = `sfdx force:${req.params.category}:${req.params.command}`;
    const queryParams = req.query;
    // merge parameters
    Object.keys(queryParams).forEach(key => {
        sfdxCommand += ` -${key}=${queryParams[key]}`;
    });
    // read as json
    sfdxCommand += ` --json`;
    console.log('run : ' + sfdxCommand);
    runSfdxCommand(sfdxCommand, res);
}

function runSfdxCommand(sfdxCommand, res) {
    console.log('✅ Running command : ' + sfdxCommand);
    try {
        exec(sfdxCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return error;
            }
            // console.log(`stdout: ${stdout}`);
            res.send(stdout)
        });
    } catch (error) {
        return console.error(error);
    }
}

module.exports = { sfdx, runSfdxCommand };