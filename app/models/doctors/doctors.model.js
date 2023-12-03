module.exports = (sequelize,Sequelize) => {
    const Doctors = sequelize.define("doctor",{
        clinicid:{
            type: Sequelize.STRING
          },
        doctorid:{
            type: Sequelize.STRING
        },
        doctorname:{
            type:Sequelize.STRING,
        }
    },{
        indexes : [
            {
                unique: true,
                fields: ["doctorid","clinicid"]
            }
        ]
    }
    );
    return Doctors;
};