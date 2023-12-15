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





const createorder = async (req, res) => {
    try {
        console.log(req.body);

        // Check if req.body and req.body.form are defined
        if (!req.body || !req.body.form) {
            return res.status(400).send({
                message: "Invalid request. 'form' property is missing in the request body.",
            });
        }

        const order_id = generateRandomNumber();
        const checkuser = User.findOne({
            where: {
              clinicid: req.body.form.uniqueid
            }
        });

        // Check if the expected properties are present before accessing them
        const neworder = {
            orderid: order_id,
            clinicid: req.body.form.uniqueid,
            doctorid: req.body.form.doctorid,
            type1: req.body.formdata.result.type1,
            option1: req.body.formdata.result.options1,
            type2: req.body.formdata.result.type2,
            option2: req.body.formdata.result.options2,
            type3: req.body.formdata.result.type3,
            option3: req.body.formdata.result.option3,
            type4: req.body.formdata.result.type4,
            option4: req.body.formdata.result.option4,
            type5: req.body.formdata.result.type5,
            option5: req.body.formdata.result.option5,
            type6: req.body.formdata.result.type6,
            option6: req.body.formdata.result.option6,
            type7: req.body.formdata.result.type7,
            option7: req.body.formdata.result.option7,
            type8: req.body.formdata.result.type8,
            option8: req.body.formdata.result.option8,
            type9: req.body.formdata.result.type9,
            option9: req.body.formdata.result.option9,
            type10: req.body.formdata.result.type10,
            option10: req.body.formdata.result.option10,
            type11: req.body.formdata.result.type11,
            option11: req.body.formdata.result.option11,
            type12: req.body.formdata.result.type12,
            option12: req.body.formdata.result.option12,
            type13: req.body.formdata.result.type13,
            option13: req.body.formdata.result.option13,
            type14: req.body.formdata.result.type14,
            option14: req.body.formdata.result.option14,
            type15: req.body.formdata.result.type15,
            option15: req.body.formdata.result.option15,
            type16: req.body.formdata.result.type16,
            option16: req.body.formdata.result.option16,
            type17: "Selected tooth",
            option17: req.body.tooth,
        };

        // Assuming Order is a Sequelize model
        const new_order = await Order.create(neworder);

        const result = {
            message: "Order has been placed",
        };

        res.status(201).send(result); // 201 Created status for successful creation
        // emailservice.createorderemail(checkuser.email,order_id,req.body.form.doctor_name,neworder.doctorid,req.body.form.clicname);
    } catch (err) {
        console.error(err);  // Log the actual error for debugging

        // Handle specific Sequelize validation error
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).send({
                message: "Validation error. Please check the request data.",
                errors: err.errors.map(error => ({
                    field: error.path,
                    message: error.message,
                })),
            });
        }

        res.status(500).send({
            message: "Some error occurred while creating order.",
        });
    }
};


module.exports = {
    createorder,
};