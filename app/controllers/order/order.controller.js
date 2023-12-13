const db = require("../../models");
nodemailer = require('nodemailer');
const orderservice = require("../../services/order/order.service")


exports.createorders = (req, res) => {
    orderservice.createorder(req, res);
};