module.exports=(sequelize,type)=>{
    const detalleProducto = sequelize.define('detalleProducto',{
        cantidad:{
            type: type.INTEGER
        },
    },
    {
        timestamps:true,
        tableName: "detalleProducto"
    }
    )
    return detalleProducto;
}