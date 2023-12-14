module.exports = (sequelize, Sequelize) => {
  const Userstatus = sequelize.define("status", {
    clinicid: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    statuscode: {
      type: Sequelize.STRING,
      defaultValue: "WA4000",
    },
    description: {
      type: Sequelize.STRING,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['clinicid'] // Replace with the actual column name being referenced
      }
    ]
  });

  return Userstatus;
};