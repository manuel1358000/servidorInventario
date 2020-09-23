const Sequelize = require('sequelize');
const UsuarioModel = require('../src/models/usuario.js');
const ProductoModel = require('../src/models/producto.js');
const SucursalModel = require('../src/models/sucursal.js');
const DetalleProductoModel = require('../src/models/detalleproducto.js');
const DBURL = 'mysql://root:casagri@basedatos:3306/db_inventario';

const sequelize = new Sequelize(DBURL);

const Usuario = UsuarioModel(sequelize, Sequelize);
const Producto = ProductoModel(sequelize, Sequelize);
const Sucursal = SucursalModel(sequelize, Sequelize);
const DetalleProducto = DetalleProductoModel(sequelize, Sequelize);


Usuario.hasMany(DetalleProducto, { foreignKey: 'idUsuario' });
DetalleProducto.belongsTo(Usuario, { foreignKey: 'idUsuario' });

Producto.hasMany(DetalleProducto, { foreignKey: 'idProducto' });
DetalleProducto.belongsTo(Producto, { foreignKey: 'idProducto' });

Sucursal.hasMany(DetalleProducto, { foreignKey: 'idSucursal' });
DetalleProducto.belongsTo(Sucursal, { foreignKey: 'idSucursal' });


sequelize.sync()
    .then(() => {
        console.log('Tablas Creadas');
    });
module.exports = {
    Usuario,
    Producto,
    Sucursal,
    DetalleProducto
}