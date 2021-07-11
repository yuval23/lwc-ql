const { exec } = require('child_process');


function runSfdxCommand(command, params) {
    const sfdxCommand = decodeSfdxCommand(command, params);
    console.log('✅ Running command : ' + sfdxCommand);
    let results = {};
    try {
        exec(sfdxCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                results = stderr;
                return error;
            }
            console.log(`stdout: ${stdout}`);
            results = stdout;
        });
    } catch (error) {
        return console.error(error);
    }
    return results;
}

function decodeSfdxCommand(command, params) {
    const excludeFlags = ['json', 'help'];
    const flagsCommand = params ? Object.keys(params)
                                        .map(key => ({ name: key, value: params[key] }))
                                        .reduce((cmd, flag) => cmd + ` --${flag.name}${(!excludeFlags.includes(flag.name) ? `=${flag.value}` : "")}`, '') : '';
   return `sfdx ${command}${flagsCommand}`;
}


module.exports = { runSfdxCommand };