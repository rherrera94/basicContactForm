
const express= require('express');
const app=express();

app.use(express.static('contact'));
app.use(express.urlencoded({ extended: true }));

/***************Conexión a base de datos local************************/

var mysql=require('mysql');
var conexion= mysql.createConnection({
    host:'localhost',
    user:'rafa',
    password:'rafa',
    database:'diplomado'
});
conexion.connect();

/*********************************************************************/

app.get('/Listado',(req,res)=>{
    conexion.query('SELECT * FROM mensaje',function(error,registros){
        
        if(error){
            res.send (`Error en la consulta <a href=/index.html>Volver</a>`);
            return;    
        }

        if(registros.length!=0){
            var tablahtml=``;// aca voy a guardar toda la informacion de la consulta para mostrarla en pantalla

            registros.forEach(element => {
                //a la tabla que forme le voy agregando cada uno de los elementos que necesito mostrar

                tablahtml+=`<br>`+element.id+`<br> nombre: `+element.nombre+`<br> apellido: `+element.apellido;
                tablahtml+=`<br> celular: `+ element.celular+`<br> mail: `+element.mail+`<br> Mensaje:<br> `+element.mensaje+`<br><br>`;

            });
            
            tablahtml+=`<a href=/index.html>Volver</a>`;
            res.send(tablahtml);
        }
    });
});




/*********************************************************************/

app.post('/formContact',(req,res)=>{

    //tomo los datos provenientes del formulario y reviso que no falte ninguno

    if(!req.body.nombre || !req.body.apellido || !req.body.mail || !req.body.celular ||!req.body.mensaje){
        
        res.send (`debe ingresar toda la informacion para poder enviar un mensaje <a href=/index.html>Volver</a>`);
        return;

    }
    
    //si no falto ninguno lo agrego en la base de datos.
    
    conexion.query('INSERT INTO mensaje (mensaje,nombre,apellido,celular,mail) values (?)',[[req.body.mensaje,req.body.nombre,req.body.apellido,req.body.celular, req.body.mail]],
    function (error,registros){
        
        // en el caso de que exista algun tipo de error en el INSERT lo que va a pasar que es va a tirar error
        // sino envia el mensaje de que ya se envio el mensaje
        
        if (error){ 
            res.send("Error en la consulta");
            return;
        }
        
        if(registros.length!=0){
            res.send(`mensaje enviado <a href=/index.html>Volver</a>`);
        }
    });
    
});

app.listen(5500,()=>{
    console.log('puerto 5500');
});