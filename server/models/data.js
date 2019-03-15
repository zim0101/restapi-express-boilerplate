'use strict';
module.exports = (sequelize, DataTypes) => {
  const Data = sequelize.define('Data', {
    data: DataTypes.STRING
  }, {});
  Data.associate = function(models) {
    // associations can be defined here
  };
  return Data;
};