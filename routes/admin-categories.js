var express = require('express');
var router = express.Router();
var controller = require('../controllers/categoryController')

/* GET users listing. */
router.get('/create', controller.create);

router.post('/create', controller.save);

router.get('/list', controller.getList);

module.exports = router;
