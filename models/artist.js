module.exports = (sequelize, DataTypes) => {
   return sequelize.define('artist', {
     name: DataTypes.STRING,
     birthday: DataTypes.DATEONLY,
     deathday: DataTypes.DATEONLY,
     gender: DataTypes.INTEGER,
     placeOfBirth: DataTypes.STRING
   }, {
     timestamps: false
   });
 }