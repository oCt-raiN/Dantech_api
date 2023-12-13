module.exports = app => {
    const order = require("../../controllers/order/order.controller")


    var router = require("express").Router();
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post("/createorder", order.createorders)


    app.use('/api/order', router);
};    