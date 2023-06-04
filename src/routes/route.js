const express = require('express');
const router = express.Router();
const {createUrl,getUrl} = require('../controller/urlController');

router.post('/url/shorten', createUrl);
router.get('/url/:urlCode', getUrl);

module.exports = router;







const urlController = require('../controller/urlController');

//post create Url 
router.post('/url/shortner',urlController.createUrl);
//get api
router.get('/:urlCode',urlController.getUrl)
module.exports = router;
