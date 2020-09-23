module.exports=(sequelize,type)=>{
    const producto = sequelize.define('producto',{
        idProducto: {
            unique: true,
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codigoGenerado:{
            type: type.STRING
        },       
        nombre:{
            type: type.STRING(300)
        },       
        unidadMedida:{
            type: type.STRING(50)
        }           
    },
    {
        timestamps:true,
        tableName: "producto"
    }
    );
    return producto;
}