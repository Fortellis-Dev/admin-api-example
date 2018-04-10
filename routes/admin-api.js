const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Authenticate requests are from Fortellis using the Authorization header token
 */
router.use(function(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(403).json({ code: 403, message: 'No Authorization header found!' });
    } 
    //TODO: Perform Authorization against your auth service
    next();
});

/**
 * Admin API Info
 */
const infoResponse = {
    info: {
        apis: [{
            api: 'v0/example',
            fqdn: 'http://example.com/apis/v0/example'
        }]
    }
}

router.get('/info', (req, res, next) => {
    //Return the APIs the info object that contains all the apis being implmented and the urls where they reside
    res.json(infoResponse);
});

/**
 * Admin API Accounts Administration
 */
const account = {
    accountId: "test-id",
    status: "ACTIVE"
};

const accountsResponse = {
    totalItems: 1,
    totalPages: 1,
    items: [
        account
    ]
};

router.get('/accounts', (req, res, next) => {
    //Return the accounts that have been provisioned via this api
    res.json(accountsResponse);
});

router.post('/accounts', (req, res, next) => {    
    /**
     * Request Body
     * {accountId:<id>}
     */    
    if(!req.body || !req.body.accountId){
        return res.status(400).json({ code: 400, message: 'Account Creation failed: no accountId was found'});
    }
    //TODO: Provision a new account using your Identity Provider
    let newAccount = {
        accountId: req.body.accountId,
        status: "ACTIVE"
    };
    res.status(201).json(newAccount);
});


router.get('/accounts/:accountId', (req, res, next) => {
    //Return account matching the accountId passed in
    if(req.params.accountId == 'test-id'){
        res.json(account);
    } else {
        res.status(404).json({ code: 404, message: 'Account with id:'+req.params.accountId+' not found.'});
    }
});

router.delete('/accounts/:accountId', (req, res, next) => {
    //Delete the account matching the accountId
    res.status(200).send();
});

const cycleCredentialsResponse = {
    credentials: {
        id: "id",
        secret: "secret"
    }
}

router.post('/accounts/:accountId/activate', (req, res, next) => {
    //get the id and secret for the given account within your Identity Provider and return the values
    res.status(201).json(cycleCredentialsResponse);
});

router.post('/accounts/:accountId/deactivate', (req, res, next) => {
    //Deactivate the given account within your Identity Provider and return the values
    res.status(201).json(cycleCredentialsResponse);
});

router.post('/accounts/:accountId/cycle-credentials', (req, res, next) => {
    //Cycle the id and secret for the given account within your Identity Provider and return the values
    res.status(201).json(cycleCredentialsResponse);
});

module.exports = router;