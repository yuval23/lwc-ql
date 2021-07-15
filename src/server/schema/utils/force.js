const jsforce = require('jsforce');

// Documentation - https://jsforce.github.io/

require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const { LOGIN_URL, CLIENT_KEY, CLIENT_SECRET, REDIRECT_URL } = process.env;

/* 
 * Direct Login to Salesforce
 */
async function login(username, password, instanceUrl) {
    let response = {};
    // simple auth connection
    const connection = new jsforce.Connection({ loginUrl: LOGIN_URL, instanceUrl: instanceUrl });

    // Setup for Connected App in Salesforce
    // const oauthConnection = new jsforce.Connection({
    //     oauth2: {
    //         // you can change loginUrl to connect to sandbox or prerelease env.
    //         loginUrl: LOGIN_URL,
    //         clientId: CLIENT_KEY,
    //         clientSecret: CLIENT_SECRET,
    //         redirectUri: REDIRECT_URL
    //     }
    // });

    await connection.login(username, password, (err, userInfo) => {
        if (err) { console.log(err); throw err; }
        // Start build Auth response
        response = {
            userId: userInfo.id,
            organizationId: userInfo.organizationId,
            instanceUrl: userInfo.url,
            accessToken: connection.accessToken
        }
    });
    return response;
}
/* 
 * Get Record from recordId
 */
async function getRecord(org, sobject, recordId) {
    let response = {};
    const connenction = new jsforce.Connection(org);
    await connenction.sobject(sobject).retrieve(recordId, (error, result) => {
        if (error) { console.log(error); throw error; }
        response = result;
        // console.log(result);
    });
    return response;
}

/* 
 * Query Records - SOQL
 */
async function query(org, soql) {
    let response = {};
    const connenction = new jsforce.Connection(org);
    await connenction.query(soql, function(err, res) {
        if (err) { throw err; }
        // console.log(res);
        response = res;
    });
    return response;
}

module.exports = { login, getRecord, query };