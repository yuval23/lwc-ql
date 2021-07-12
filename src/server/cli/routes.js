const { exec } = require('child_process');


function runSfdxCommand(command, params, res) {
    const sfdxCommand = decodeSfdxCommand(command, params);
    console.log('✅ Running command : ' + sfdxCommand);
    try {
        // eslint-disable-next-line no-unused-vars
        exec(sfdxCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
            console.log(`stdout: ${stdout}`);
            res.send(stdout);
        });
    } catch (error) {
        console.error(error);
    }
   
}

function decodeSfdxCommand(command, params) {
    const excludeFlags = ['json', 'help'];
    let flags = params ? Object.keys(params).map(key => ({ name: key, value: params[key] })) : [];
    let sfdxCommand = `sfdx ${command}`;
    if (flags.length) {
        sfdxCommand += flags.reduce((cmd, flag) => cmd + ` -${flag.name}${(!excludeFlags.includes(flag.name) ? `=${flag.value}` : "")}`, '');
    }
    sfdxCommand += ' --json';
   return sfdxCommand;
}


module.exports = { runSfdxCommand };