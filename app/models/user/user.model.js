module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    clinicid:{
      type: Sequelize.STRING
    },
    clinicName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    address:{
      type: Sequelize.STRING
    },
    phonenumber:{
      type: Sequelize.STRING
    },
    userToken: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    resetToken: {
      type: Sequelize.STRING
    },
    activeInd: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userToken','email'] // Replace with the actual column name being referenced
      }
    ]
  });

  return User;
};
