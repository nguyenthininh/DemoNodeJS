var Category = require('../models/category');
var Product = require('../models/product');
require('mongoose-pagination');

exports.getList = function (req, resp) {
    var page = req.query.page;
    var limit = req.query.limit;
    var responseData;
    Category.find().paginate(parseInt(page), parseInt(limit),
        function(err, listData, totalItem) {
            responseData = {
                'listData': listData,
                'totalPage': Math.ceil(totalItem/limit),
                'page': page,
                'limit': limit
            };
            resp.render('admin/category/list', responseData);
    });
}

exports.create = function(req, resp){
    resp.render('admin/category/form');
}

exports.save = function (req, resp) {
    var obj = new Category(req.body);
    obj.save(function (err) {
        if (err) {
            return resp.status(500).send(err);
        } else {
            return resp.redirect('/admin/categories/list');
        }
    });
}