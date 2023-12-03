const db = require("../../models");
const config = require("../../config/auth.config");
const { user,Sequelize } = require("../../models/index");
const Doctor = db.doctor
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256,TokenGenerator.BASE62);
const emailservice = require('../email.service');

function generateUniqueId() {
    // Generate a random 5-digit number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
  
    // Combine the letter 'O' with the random digits to form the ID
    const uniqueId = 'DOC' + randomDigits;
  
    return uniqueId;
  }
  

const adddoctor = async (req, res) =>{

    const doctor_id = generateUniqueId();
    const doctor = {
        // clinicid: req.body.clinicid,
        doctorid: doctor_id,
        doctorname: req.body.Doctor_name,
    };
    try{
        const newdoctor = await Doctor.create(doctor)
        const result = {
            // clinicid: newdoctor.clinicid,
            doctorid: newdoctor.doctorid,
            doctorname: newdoctor.doctorname
        };res.send(result);
    } 
    catch (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating adding doctor."
        });
    }
};

module.exports ={
    adddoctor,
}