const db = require("../../models");
const config = require("../../config/auth.config");
const { user,Sequelize } = require("../../models/index");
const Profile = db.profile
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256,TokenGenerator.BASE62);
const emailservice = require('../email.service');

const profilereg = async (req, res) => {
    const profile_data ={
        // clinicid: req.body.id,
        // image: req.body.img,
        clinicName: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phonenumber: req.body.phonenumber,
        alternativenumber: req.body.alternativenumber,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        country: req.body.country,
        bankacnumber: req.body.bank_acNo,
        ifsc: req.body.ifsc,
        bankbranch: req.body.bank_brnch,
        upiid: req.body.upi_id,
        gst: req.body.gst,
    };

    try {
        const newprofile = await Profile.create(profile_data);

        const result = {
            // fullName: newUser.firstName+' '+newUser.lastName,
            // clinicid: newUser.clinicid,
            // image: newprofile.clinicName,
            clinicName: newprofile.clinicName,
            email: newprofile.email,
            address: newprofile.address,
            phonenumber: newprofile.phonenumber,
            alternativenumber: newprofile.alternativenumber,
            city: newprofile.city,
            state: newprofile.state,
            pincode: newprofile.pincode,
            country: newprofile.country,
            bankacnumber: newprofile.bankacnumber,
            ifsc: newprofile.ifsc,
            bankbranch: newprofile.bankbranch,
            upiid: newprofile.upiid,
            gst: newprofile.gst,                  
          };
          res.send(result);
        } catch (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating profile."
            });

    }
};



  module.exports ={
    profilereg,
  }