const { DataTypes }=require("sequelize");
const sequelize=require("../routes/database");


const User = sequelize.define('User', {
    UserNameSurname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId:{
      type:DataTypes.UUID,
      unique:true,
      allowNull:false
    },
    userMail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  module.exports = User;