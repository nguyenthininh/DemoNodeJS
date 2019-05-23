var express = require('express');
var router = express.Router();
var productController = require('../controllers/productController')

/* GET users listing. */
router.get('/create', productController.create);

router.post('/create', productController.validate('save'), productController.save);

router.get('/list', productController.getList);

router.get('/detail/:id', productController.getDetail);

router.get('/edit/:id', productController.edit);

router.post('/edit/:id', productController.update);

router.post('/delete/:id', productController.delete);

module.exports = router;
