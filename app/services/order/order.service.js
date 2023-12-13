const db = require("../../models");
const config = require("../../config/auth.config");
const Admin = db.admin;
const Admininfo = db.admininfo;
const User = db.user;
const Status = db.status;
const Order = db.order;
const Profile = db.profile;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const emailservice = require('../../services/email.service');


function generateRandomNumber() {
    // Function to generate a random two-digit number
    function getRandomTwoDigitNumber() {
        return Math.floor(Math.random() * 90 + 10);
    }

    // Function to format the current date, month, hour, and minute
    function formatTimeComponent(component) {
        return component < 10 ? '0' + component : component;
    }

    const randomTwoDigitNumber1 = getRandomTwoDigitNumber();
    const randomTwoDigitNumber2 = getRandomTwoDigitNumber();

    const currentDate = formatTimeComponent(new Date().getDate());
    const currentMonth = formatTimeComponent(new Date().getMonth() + 1);
    const currentHour = formatTimeComponent(new Date().getHours());
    const currentMinute = formatTimeComponent(new Date().getMinutes());

    // Construct the final random number
    const randomNumber =
        'ORD' +
        randomTwoDigitNumber1 +
        randomTwoDigitNumber2 +
        currentDate +
        currentMonth +
        currentHour +
        currentMinute;

    return randomNumber;
}



const createorder = async (res, req) => {

    const order_id = generateRandomNumber();

    const neworder = {
        orderid: order_id,
        clinicid: req.body.form.clinicid,
        doctorid: req.body.form.doctorid,
        type1: req.body.formdata.result.type1,
        option1: req.body.formdata.result.option1,
        type2: req.body.formdata.result.type1,
        option2: req.body.formdata.result.option1,
        type3: req.body.formdata.result.type1,
        option3: req.body.formdata.result.option1,
        type4: req.body.formdata.result.type1,
        option4: req.body.formdata.result.option1,
        type5: req.body.formdata.result.type1,
        option5: req.body.formdata.result.option1,
        type6: req.body.formdata.result.type1,
        option6: req.body.formdata.result.option1,
        type7: req.body.formdata.result.type1,
        option7: req.body.formdata.result.option1,
        type8: req.body.formdata.result.type1,
        option8: req.body.formdata.result.option1,
        type9: req.body.formdata.result.type1,
        option9: req.body.formdata.result.option1,
        type10: req.body.formdata.result.type1,
        option10: req.body.formdata.result.option1,
        type11: req.body.formdata.result.type1,
        option11: req.body.formdata.result.option1,
        type12: req.body.formdata.result.type1,
        option12: req.body.formdata.result.option1,
        type13: req.body.formdata.result.type1,
        option13: req.body.formdata.result.option1,
        type14: req.body.formdata.result.type1,
        option14: req.body.formdata.result.option1,
        type15: req.body.formdata.result.type1,
        option15: req.body.formdata.result.option1,
        type16: req.body.formdata.result.type1,
        option16: req.body.formdata.result.option1,
        type17: req.body.formdata.result.type1,
        option17: req.body.formdata.result.option1,
        type18: req.body.formdata.result.type1,
        option18: req.body.formdata.result.option1,
        type19: req.body.formdata.result.type1,
        option19: req.body.formdata.result.option1,
    };

    try {
        const new_order = await Order.create(neworder)

        const result = {
            meessage: "Order has been place",
        };
        res.send(result);
    } catch (err) {
        res.status(500).send({
            message:
                "Some error occurred while creating order."
        });
    }

};

module.exports = {
    createorder,
};