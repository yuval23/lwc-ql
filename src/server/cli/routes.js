// eslint-disable-next-line no-unused-vars
const { exec } = require('child_process');


async function runCommand(command, res) {
    console.log('✅ Running command : ' + command);
    try {
        //const results = execSync(sfdxCommand, { stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024 });
        // eslint-disable-next-line no-unused-vars
       await exec(command, { maxBuffer: 0.8 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
           // console.log(`stdout: ${stdout}`);
           res.send(stdout);
        });
    } catch (error) {
        console.error(error);
    }
}

function decodeSfdxCommand(command, params) {
    let flags = params ? Object.keys(params).map(key => ({ name: key, value: params[key] })) : [];
    let sfdxCommand = `sfdx ${command}`;
    if (flags.length) {
        sfdxCommand += flags.reduce((cmd, flag) => cmd + ` ${flag.name}${(flag.value ? `=${flag.value}` : "")}`, '');
    }
   return sfdxCommand;
}


module.exports = { decodeSfdxCommand, runCommand };