const db = require("../../models");
const config = require("../../config/auth.config");
const { user, Sequelize } = require("../../models/index");
const User = db.user;
const Userinfo = db.userinfo;
const Professional = db.professional;
const sequelize = db.sequelize;
const Profile = db.profile;
const Admin = db.admin;
const Profbooking = db.profbooking;
const Slot = db.slot;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
//const fetch = require("node-fetch");
const TokenGenerator = require('uuid-token-generator');
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
const authvalidation = require('../../validations/auth.validation')
const emailservice = require('../email.service');
const { email } = require("../../config/config");
const SignupValidation = require("../../validations/signupvalidation");
const SigninValidation = require("../../validations/signinvalidation");

// Example usage
// const id = generateUniqueId();
// console.log(id);

function generateUniqueId() {
  // Generate a random 5-digit number
  const randomDigits = Math.floor(10000 + Math.random() * 90000);

  // Combine the letter 'O' with the random digits to form the ID
  const uniqueId = 'O' + randomDigits;

  return uniqueId;
}


// Create a user
const register = async (req, res) => {
  // const admin = await Admin.findOne({
  //   where: { adminToken: req.body.adminToken } ,
  //   attributes: { exclude: ['createdAt', 'updatedAt'] },
  // });
  // if (!admin) {
  //   return res.status(404).send({
  //     message: "Admin not found with token " + req.body.adminToken
  //   });
  // }
  const checkuser = User.findOne({
    where: {
      email: req.body.email
    }
  });

  const clinic_id = generateUniqueId();

  const user = {
    clinicid: clinic_id,
    clinicName: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phonenumber: req.body.phonenumber,
    password: bcrypt.hashSync(req.body.password, 8),
    userToken: tokgen2.generate(),
  };



  try {
    // Save professional in the database


    const newUser = await User.create(user);
    const newprofile = await Profile.create(user);
    // Exclude the specified fields from the output
    const result = {
      // fullName: newUser.firstName+' '+newUser.lastName,
      // clinicid: newUser.clinicid,
      clinicName: newUser.clinicName,
      address: newUser.clinicName,
      phonenumber: newUser.phonenumber,
      email: newUser.email,
      password: newUser.password,
      userToken: newUser.userToken,

    };
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        "Some error occurred while creating user."
    });
  }

};


// user login
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const accessToken = jwt.sign({ id: user.userToken }, config.secret, {
      expiresIn: "1d"
    });

    const fullName = `${user.clinicName}`;
    const status = `${user.status}`

    res.status(200).send({
      userToken: user.userToken,
      accessToken,
      fullName, status,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};




const getstatus = async (req, res) => {

  try {
    const user = await User.findOne({
      where: { userToken: req.body.userToken },
    });

    //   console.log(doctor)
    const { email, userToken, clinicName, status } = user;
    const clinicname = `${clinicName}`;

    res.status(200).send({
      clinicname,
      email,
      userToken, status
    });
  }
  catch (err) {
    res.status(500).send({
      message: 'Error retrieving status with userToken',
    });
  }


};


const forgotpassword = async (req, res) => {

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Email not exists." });
      } else {

        const resetToken = tokgen2.generate();

        User.update({ resetToken: resetToken }, {
          where: { userToken: user.userToken }

        }).then(
          emailservice.sendResetPasswordEmail(user.email, resetToken)
        )

        return res.status(200).send({ message: "Reset link send to the registered email id" });

      }

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const resetpassword = async (req, res) => {

  User.findOne({
    where: {
      resetToken: req.body.resetToken
    }
  })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "The reset link is not valid" });
      }



      // Update user with new encrypted password
      User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { userToken: user.userToken }

      }).then(
        emailservice.PasswordResetSuccess(user.email, 'Password Changed Successfully')
      )

      return res.status(200).send({ message: "Password Changed successfully" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

const passwordreset = async (req, res) => {
  console.log(req);
  User.findOne({
    where: {
      resetToken: req.body.resetToken,
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User is not valid" });
      }


      // Update user with new encrypted password
      User.update({ password: bcrypt.hashSync(req.body.password, 8) }, {
        where: { userToken: req.body.id }

      }).then(
        emailservice.PasswordResetSuccess(user.email, 'Password Changed Successfully')
      )

      return res.status(200).send({ message: "Password reset successfully" });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};
//const conformpassword = async (req, res) => {
const allRegisterUser = async (req, res) => {
  User.findAndCountAll({
    attributes: { exclude: ['password', 'id', 'resetToken', 'createdAt', 'updatedAt'] }
  })
    .then(data => {
      console.log(data);
      res.send({
        count: data.count,
        users: data.rows
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
}



const getAllUser = async (req, res) => {
  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }
  User.findAll({
    include: [
      {
        model: Userinfo,
        as: 'userDetail',
        where: { userId: Sequelize.col('User.id') }

      }
    ]
  })
    .then(users => {
      if (!users) {
        return res.status(404).send({
          message: 'Users not found'
        });
      }

      const formattedUsers = users.map(user => {
        const userDetail = user.userDetail;
        const fullName = `${user.firstName} ${user.lastName}`;

        return {
          fullName,
          photo: user.photo,
          email: user.email,
          userToken: user.userToken,
          mobileNumber: userDetail.mobileNumber,
          address: userDetail.address,
          activeInd: userDetail.activeInd,

        };
      });


      res.status(200).send(formattedUsers);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Users'
      });
    });
};
const getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userToken: req.body.userToken },
    });

    const profile = await Profile.findOne({
      where: { clinicid: user.clinicid }
    });

    if (!user) {
      return res.status(404).send({
        message: 'User not found with userToken',
      });
    }

    const { email, userToken, photo, clinicName, status } = user;
    const clinicname = `${clinicName}`;

    res.status(200).send({
      clinicname, profile,
      photo,
      email,
      userToken, status
    });
  } catch (err) {
    res.status(500).send({
      message: 'Error retrieving User with userToken',
    });
  }
};


const getOneUserAdmin = async (req, res) => {
  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }
  User.findOne({
    where: { userToken: req.body.userToken },
    include: [
      {
        model: Userinfo,
        as: 'userDetail'
      }
    ]
  })
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: 'User not found with userToken 1'
        });
      }

      const { email, userToken, photo } = User;
      const userDetail = User.userDetail;
      const fullName = `${User.firstName} ${User.lastName}`;

      res.status(200).send({
        fullName,
        photo,
        email,
        userToken,
        mobileNumber: userDetail.mobileNumber,
        address: userDetail.address,
        activeInd: userDetail.activeInd
      });
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving User with userToken '
      });
    });

}

const createuserinfo = async (req, res) => {
  User.findOne({
    where: {
      userToken: req.body.userToken
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "User not found with given token"
        });
      }
      const userId = user.id;
      Userinfo.findOne({
        where: {
          userId: userId
        }
      })
        .then(userInfo => {
          if (userInfo) {
            return res.status(400).send({
              message: "Userinfo already exists for the given User."
            });
          }
          Userinfo.create({
            userId: userId,
            mobileNumber: req.body.mobileNumber,
            address: req.body.address
          })
            .then(createdUserInfo => {
              const response = {
                userToken: user.userToken,
                activeInd: createdUserInfo.activeInd,
                mobileNumber: createdUserInfo.mobileNumber,
                address: createdUserInfo.address,
              };
              res.send(response);
            })
            .catch(err => {
              res.status(500).send({
                message: err.message || "Some error occurred while creating the Userinfo."
              });
            });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving the Userinfo."
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the User."
      });
    });
};

const updateuserinfo = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        userToken: req.body.userToken
      }
    });
    if (!user) {
      return res.status(401).send({
        message: "User not found with given token"
      });
    }

    const userId = user.id;
    let userInfo = await Userinfo.findOne({
      where: {
        userId: userId
      }
    });

    if (!userInfo) {
      return res.status(404).send({
        message: "Userinfo not found for the given User."
      });
    }

    userInfo = await userInfo.update({

      mobileNumber: req.body.mobileNumber,
      address: req.body.address
    });

    const response = {
      userToken: req.body.userToken,
      activeInd: userInfo.activeInd,
      mobileNumber: userInfo.mobileNumber,
      address: userInfo.address,
    };
    res.send(response);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating the Userinfo."
    });
  }
};

const updateUser = async (req, res) => {
  User.update(

    {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    },
    {
      where: {
        userToken: req.body.userToken
      }
    }
  )
    .then(rowsAffected => {
      if (rowsAffected[0] === 0) {
        return res.status(404).send({
          message: "user not found with token " + req.body.userToken
        });
      }
      res.send({
        message: "user was updated successfully with token " + req.body.userToken
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the professional."
      });
    });
};


// admin confirm cancel user
const adminCancelUser = async (req, res) => {
  const user = await User.findOne({
    where: { userToken: req.body.userToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!user) {
    return res.status(404).send({
      message: "User info not found with userToken " + req.body.userToken
    });
  }

  const admin = await Admin.findOne({
    where: { adminToken: req.body.adminToken },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!admin) {
    return res.status(404).send({
      message: "Admin not found with token " + req.body.adminToken
    });
  }

  User.update(
    {
      activeInd: req.body.activeInd,
    },
    {
      where: {
        id: user.id,
      },
    }
  ).then((data) => {
    console.log(data);
    // Only include the necessary fields in the response
    const responseData = {
      message: 'user cancel successfully',
      userToken: user.userToken,
      adminToken: admin.adminToken,
    };
    res.send(responseData);
  }).catch((err) => {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating user.',
    });
  });
}


// Only count user with activeInd set to 1
const allUserCount = async (req, res) => {
  try {
    const userCount = await User.count({
      where: {
        activeInd: 1
      }
    });
    res.send({ userCount });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred while retrieving user count: " + err.message
    });
  }
};

module.exports = {

  register,
  login,
  forgotpassword,
  resetpassword,
  passwordreset,
  allRegisterUser,
  getAllUser,
  getOneUser,
  getOneUserAdmin,
  createuserinfo,
  updateuserinfo,
  updateUser,
  adminCancelUser,
  allUserCount,
  getstatus

};