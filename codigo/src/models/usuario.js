module.exports=(sequelize,type)=>{
    const usuario = sequelize.define('usuario',{
        idUsuario:{
            unique:true,
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },
        usuario:{
            type: type.STRING
        },
        contra:{
            type: type.STRING
        }       
    },
    {
        timestamps:true,
        tableName: "usuario"
    })
    return usuario;
}