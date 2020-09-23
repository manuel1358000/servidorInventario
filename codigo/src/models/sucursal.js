const FotografiaModel = require('../models/sucursal.js');
module.exports = (sequelize, type) => {
    const sucursal = sequelize.define('sucursal', {
        idSucursal: {
            unique: true,
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: type.STRING(1000)
        }
    }, {
        timestamps: true,
        tableName: "sucursal"
    });
    return sucursal;
}