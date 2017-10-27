module.exports = (sequelize, DataTypes) => {
   return sequelize.define('film', {
     title: DataTypes.STRING,
     releaseDate: DataTypes.DATEONLY,
     tagline: DataTypes.STRING,
     revenue: DataTypes.BIGINT,
     budget: DataTypes.BIGINT,
     runtime: DataTypes.INTEGER,
     originalLanguage: DataTypes.STRING,
     status: DataTypes.STRING
   }, {
     timestamps: false
   });
 }