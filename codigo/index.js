const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
var conexionbd = require('./src/conexiondb/conexion.js');
const { Usuario, Producto, Sucursal, DetalleProducto} = require('./sequelize/sequelize');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { Op } = require("sequelize");
var Sequelize = require("sequelize");


app.put('/actualizarExistencia',async(req,res)=>{
    if (!req.query.hasOwnProperty('valor')||!req.query.hasOwnProperty('existencia')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        DetalleProducto.update({
            cantidad:req.query.valor,
        },
        {where:{id:req.query.existencia}}
        ).then(detalleProducto => {
            res.status(200).json({ 'estado': true, 'data':detalleProducto });
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }
});


//buscar producto por Codigo Barras
app.get('/sumaExistencias',async(req,res)=>{
    if (!req.query.hasOwnProperty('sucursal')||!req.query.hasOwnProperty('producto')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        DetalleProducto.findAll({
            attributes: [
                'idProducto',
                'idSucursal',
                [Sequelize.fn('sum',Sequelize.col('cantidad')),'totalproductos']
            ],
            group:['idProducto'],
            where:{
                idSucursal: req.query.sucursal,
                idProducto: req.query.producto
            },
        }).then(detalleProducto => {
            res.status(200).json({ 'estado': true, data: detalleProducto });
            return ;
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }            
});

//buscar producto por Codigo Barras
app.get('/codigoEscaner',async(req,res)=>{
    if (!req.query.hasOwnProperty('valor')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        Producto.findOne({
            attributes: ['idProducto', 'codigoGenerado','nombre','unidadMedida'],
            where:{
                codigoGenerado: req.query.valor
            },
        }).then(producto => {
            if(!producto){
                res.status(200).json({ 'estado': true, data: [] });
                return ;
            }else{
                res.status(200).json({ 'estado': true, data: producto });
                return ;
            }
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }            
});

//busqueda de producto por codigo
app.get('/buscarProducto',async(req,res)=>{
    if (!req.query.hasOwnProperty('valor')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        Producto.findAll({
            attributes: ['idProducto', 'codigoGenerado','nombre','unidadMedida'],
            where:{
                codigoGenerado: {
                    [Op.substring]: req.query.valor,
                }
            },
        }).then(detalles => {
            res.status(200).json({ 'estado': true, data: detalles });
            return;
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }            
});
//busqueda de producto por id
app.get('/buscarProductoId',async(req,res)=>{
    if (!req.query.hasOwnProperty('valor')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        Producto.findAll({
            attributes: ['idProducto', 'codigoGenerado','nombre','unidadMedida'],
            where:{
                idProducto: req.query.valor
            },
        }).then(detalles => {
            res.status(200).json({ 'estado': true, data: detalles });
            return;
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }            
});

//listado de productos con paginacion

app.get('/listadoProductos', async(req, res) => {
    if (!req.query.hasOwnProperty('indice')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    } else {
        Producto.findAll({
            limit: 10,
            offset: parseInt(req.query.indice),
            attributes: ['idProducto', 'codigoGenerado','nombre','unidadMedida'],
        }).then(producto => {
            res.status(200).json({ 'estado': true, data: producto });
            return;
        }).catch((error) => {
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }
});


//listado de sucursales
app.get('/obtenerSucursales',async(req,res)=>{
    Sucursal.findAll({
        attributes: ['idSucursal', 'nombre'],
    }).then(sucursales => {
        res.status(200).json({ 'estado': true, data: sucursales});
        return;
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
        return;
    });
});



//agregar una existencia existencias
app.post('/crearExistencia',async(req,res)=>{
    if (!req.body.hasOwnProperty('cantidad')||!req.body.hasOwnProperty('idProducto')||!req.body.hasOwnProperty('idUsuario')||!req.body.hasOwnProperty('idSucursal')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        DetalleProducto.create({
            cantidad: req.body.cantidad,
            idUsuario: req.body.idUsuario,
            idProducto:req.body.idProducto,
            idSucursal:req.body.idSucursal
        }).then(
            DetalleProducto => {
                res.status(200).json({ 'estado': true, 'mensaje': 'Se agrego la cantidad de existencia al producto' });
                return;
            }
        ).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al crear un cupon, intente nuevamente' });
            return;
        });
    }
});

//obtener listado de cantidad de existencias
app.get('/obtenerExistencias',async(req,res)=>{
    if (!req.query.hasOwnProperty('idProducto')||!req.query.hasOwnProperty('idSucursal')||!req.query.hasOwnProperty('indice')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        DetalleProducto.findAll({
            limit: 10,
            offset: parseInt(req.query.indice),
            attributes: ['cantidad','idProducto','idSucursal','updatedAt','id'],
            where:{
                idProducto: req.query.idProducto,
                idSucursal:req.query.idSucursal
            },
            include: [{
                model: Usuario,
                attributes: ['idUsuario', 'usuario'],
            
            }]
        }).then(detallesProductos => {
            res.status(200).json({ 'estado': true, data: detallesProductos});
            return;
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el recurso solicitado' });
            return;
        });
    }
});





//eliminar una existencia
app.delete('/eliminarExistencia',async(req,res)=>{
    if (!req.query.hasOwnProperty('id')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al obtener el recurso' });
        return;
    }else{
        DetalleProducto.destroy({
            where: {
                id:req.query.id
            }
        }).then(()=>{
            res.status(200).json({ 'estado': true, 'mensaje': 'Existencia eliminada exitosamente' });
            return;
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error al eliminar una existencia, intente nuevamente' });
            return;
        });
    }
});

//iniciar sesion
app.get('/iniciarSesion', function(req, res) {
    if (!req.query.hasOwnProperty('usuario') || !req.query.hasOwnProperty('contra')) {
        res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error en el servidor' });
        return;
    } else {
        Usuario.findOne({
            where: {
                usuario: req.query.usuario
            }
        }).then(usuario => {
            if (!usuario) {
                res.status(401).json({ 'estado': false, 'mensaje': 'No existe una cuenta asociada con el usuario ingresado, intente nuevamente' });
                return;
            } else {
                if (req.query.contra == usuario.contra) {
                    res.status(200).json({ 'estado': true,'codigo':usuario.idUsuario });
                    return;
                } else {
                    res.status(401).json({ 'estado': false, 'mensaje': 'Inicio de sesion invalido, intente nuevamente' });
                    return;
                }
            }
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ 'estado': false, 'mensaje': 'Ocurrio un error iniciar sesion el usuario' });
            return;
        });
    }
});




//pagina no encontrada
app.get('*', function(req, res) {
    res.status(404).json({ estado: false, error: 404, mensaje: 'No tienes acces a esta ruta' });
    return;
});

app.listen(port, () => {
    console.log('Escuchando en el puesto ' + port);
});