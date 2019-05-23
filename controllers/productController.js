var Product = require('../models/product');
var Category = require('../models/category');
var mongoose = require('mongoose');
require('mongoose-pagination');
const {check, validationResult} = require('express-validator/check');

exports.validate = function (method) {
    switch (method) {
        case 'save': {
            return [
                check('name', 'Name is required!').exists(),
                check('price', 'Invalid email').exists().isEmail(),
            ]
        }
    }
}

exports.getList = function (req, resp) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var min = req.query.min;
    var max = req.query.max;
    var categoryId = req.query.categoryId;

    var keyword = req.query.keyword;
    var query;
    if (keyword) {
        var searchPara = {
            $text: {
                $search: keyword
            }
        };
        query = Product.find(searchPara);
    } else {
        query = Product.find();
    }
    var responseData;
    query = query.where('status').ne(-1);
    if(min){
        query = query.where('price').gte(parseInt(min));
    }
    if(max && parseInt(max) > 0){
        query = query.where('price').lte(parseInt(max));
    }
    if(categoryId){
        query = query.where('category').eq(new mongoose.mongo.ObjectId(categoryId));
    }
    query.sort('-createdAt')
        .populate('category')
        .paginate(parseInt(page), parseInt(limit),
            function (err, listData, totalItem) {
                Category.find(function (err, categories) {
                    responseData = {
                        'listData': listData,
                        'totalPage': Math.ceil(totalItem / limit),
                        'page': page,
                        'limit': limit,
                        'keyword': keyword,
                        'categories': categories
                    };
                    resp.render('admin/product/list', responseData);
                });
            });
}

// trả về form.
exports.create = function (req, resp) {
    Category.find(function (err, list) {
        var responseData = {
            'action': '/admin/products/create',
            'obj': new Product(),
            'categories': list
        }
        resp.render('admin/product/form', responseData);
    });
}

// lưu trữ thông tin.
exports.save = function (req, resp) {
    // var errors = validationResult(req);
    // if(errors.isEmpty()){
    //     var obj = new Product(req.body);
    //
    //     var fileGettingUploaded = req.files.image.data;
    //     cloudinary.uploader
    //         .upload_stream(function (error, result) {
    //             var imageUrl = result.url;
    //             obj.imageUrl = imageUrl;
    //             obj.save(function (err) {
    //                 if (err) {
    //                     return resp.status(500).send(err);
    //                 } else {
    //                     return resp.redirect('/admin/products/list');
    //                 }
    //             });
    //             // res.send("Lưu sản phẩm thành công.");
    //             console.log(cloudinary.image(result.public_id, {format: "jpg", crop: "fill", width: 120, height: 80}));
    //         }).end(fileGettingUploaded);
    //
    // }else{
    //     console.log('@@@');
    //     var responseData = {
    //         'action': '/admin/products/create',
    //         'obj': new Product(req.body),
    //         'errors': errors.array()
    //     }
    //     resp.render('admin/product/form', responseData);
    // }

    // var obj = new Product(req.body);
    // if (req.files && req.files.image) {
    //     var fileGettingUploaded = req.files.image.data;
    //     cloudinary.uploader
    //         .upload_stream(function (error, result) {
    //             var imageUrl = result.url;
    //             obj.imageUrl = imageUrl;
    //             obj.save(function (err) {
    //                 if (err) {
    //                     return resp.status(500).send(err);
    //                 } else {
    //                     return resp.redirect('/admin/products/list');
    //                 }
    //             });
    //             // res.send("Lưu sản phẩm thành công.");
    //             console.log(cloudinary.image(result.public_id, {format: "jpg", crop: "fill", width: 120, height: 80}));
    //         }).end(fileGettingUploaded);
    // }else{
    //     obj.imageUrl = 'https://www.touchtaiwan.com/images/default.jpg';
    //     obj.save(function (err) {
    //         if (err) {
    //             return resp.status(500).send(err);
    //         } else {
    //             return resp.redirect('/admin/products/list');
    //         }
    //     });
    // }
    var obj = new Product(req.body);
    obj.category = new mongoose.mongo.ObjectId(req.body.categoryId);
    obj.save(function (err) {
        if (err) {
            return resp.status(500).send(err);
        } else {
            return resp.redirect('/admin/products/list');
        }
    });

}

// lấy chi tiết.
exports.getDetail = function (req, resp) {
    Product.findById(req.params.id, function (err, obj) {
        if (err) {
            return res.status(500).send(err);
        } else {
            var responseData = {
                'obj': obj
            };
            resp.render('admin/product/detail', obj);
        }
    });
}

// đưa về trang sửa sản phẩm với thông tin cũ của sản phẩm đó.
exports.edit = function (req, resp) {
    Product.findById(req.params.id, function (err, obj) {
        if (err) {
            return res.status(500).send(err);
        } else {
            var responseData = {
                'action': '/admin/products/edit/' + req.params.id,
                'obj': obj
            };
            resp.render('admin/product/form', responseData);
        }
    });
}

// lưu thông tin sản phẩm sau khi sửa.
exports.update = function (req, resp) {
    Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: false},
        function (err, obj) {
            if (err) {
                return res.status(500).send(err);
            } else {
                resp.redirect('/admin/products/list');
            }
        });
}

// xóa sản phẩm.
exports.delete = function (req, resp) {
    Product.findByIdAndUpdate(
        req.params.id,
        {
            'status': -1
        },
        {
            new: false
        },
        function (err, obj) {
            if (err) {
                return res.status(500).send(err);
            } else {
                resp.redirect('/admin/products/list');
            }
        });
}