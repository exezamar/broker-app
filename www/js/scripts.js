
var db = null;
var cuenta = 0;
var idTour = '';
var nombreTour = '';
var ubicacionTour = '';
var monedaTour = '';
var tablaTours = '';
var todosTours = [];
var todosProductos = [];
var idProduct = '';


document.addEventListener('deviceready', function()
{
  
	//CREAR BASE SI NO EXISTE
	// db = window.sqlitePlugin.openDatabase({name: 'iBroker01.db', location: 'default'});

	// db.transaction(function (tx) {

 //    tx.executeSql("CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY, nombre text, ubicacion text, moneda text, fecha text)");
 //    tx.executeSql("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY,idTour text, nombre text, precioUnidad text,precioCantidad, descripcion text,cantidadMinima text, CBM text, QTY text, tienda text, foto1 text, foto2 text, foto3 text, cantidadComprada text)");
    
 //  }, function (err) {
 //    alert("Error al crear la base de datos.");
 //  });

 //AJAX PARA POSTEAR LOGIN Y DE NO TENER TOKEN MOSTRAR LOGIN
  var email = window.localStorage.getItem("email");
  
  if (email != null)
  {
    ocultarSlide("cont-login");
    setTimeout(function () {
      mostrarSlide('cont-menu')
    }, 500);
  }


});//fin deviceready

$("#btnPopular").click(function(){
 
 	   //INGRESAR NUEVO REGISTRO
    //   db.transaction(function(tx)
    //   {
    //     tx.executeSql('INSERT INTO tours (nombre, ubicacion, moneda, fecha) VALUES (?,?,?,?)', [ 'nombre','ubicacion','moneda','fecha']);
    //   }, function(error) {
    //     alert('Transaction ERROR: ' + error.message);
    //   }, function() {
        
		  // });//fin transaccion

    //   //MOSTAR CUANTOS RECORDS HAY
    //   db.transaction(function(tx)
    //   {
    //    tx.executeSql('SELECT count(*) AS mycount FROM tours', [], function(tx, rs) {
    //     alert('Record count: ' + rs.rows.item(0).mycount);
    //   }, function(tx, error) {
    //    alert('SELECT error: ' + error.message);
    //  });
  		//   });//fin transaccion

 });//fin btnPopular



function ocultarSlide(nombre){
  $("#"+nombre).removeClass('bounceInLeft');
  $("#"+nombre).addClass('bounceOutLeft');
  setTimeout(function () {
    $("#"+nombre).addClass('oculto');
  }, 500);
}
function mostrarSlide(nombre){
  $("#"+nombre).removeClass('bounceOutLeft');
  $("#"+nombre).removeClass('oculto');
  $("#"+nombre).addClass('bounceInRight');
}

function ofuscar(div){ $("#"+div).addClass('ofuscado');}





$(document).ready( function() {
  $(".ui-loader").hide();
  function onSuccess1(imageData){

    var src = 'data:image/jpg;base64,'+imageData;

     $("#imgprod1").removeClass('oculto');
     // $("#imgprod1").attr('src', src+imageData);
     $("#imgprod1").attr('src', src);

      // alert(src+imageData);
    }
    function onFail(error){
     // alert('error');
    }


        $("#login").click(function(){
          //ajax para postear login y guardar token
          var email = $('#txtUser').val();
          window.localStorage.setItem("email", email);
          var value = window.localStorage.getItem("email");
          
          ocultarSlide("cont-login");
          setTimeout(function () {
            mostrarSlide('cont-menu')
          }, 500);

        });

        
        
    $("#bmTours").click(function(){
      ocultarSlide("cont-menu");
      setTimeout(function () {
        mostrarSlide('cont-tours');
        $("div.dataTables_scroll").css({"clear":"both !important"});

      }, 500);
      //BUSCAR TOURS
      //AJAX PARA BUSCAR LOS TOURS GUARDADOS EN AL NUBE:
      var email = window.localStorage.getItem("email");
      if (email == null)
      {
        email = 'sinInfo@buscarTours@gmail.com';
      }
      $.ajax({
                url:'http://ibroker.extroversia.com/buscarTours',
                type: 'post',
                data: { email:email},
                success: function(respuesta) {
                        var count = respuesta.length;
                        if (count == 0 ){
                           $("#bodyTours").append("<div class='animated contTour blue' id='no-tours'><div>Your shopping tours will show up here.</div></div>");
                         }
                         else{
                           $("#bodyTours").empty();
                           for (var i = 0; i < respuesta.length; i++)
                           {
                             
                             var id = respuesta[i]['id'];
                             var ubicacion = respuesta[i]['ubicacion'];
                             var nombre = respuesta[i]['nombre'];
                             var moneda = respuesta[i]['moneda'];
                             var fecha = respuesta[i]['fecha'];

                             $("#bodyTours").append("<div class='contTour animated  blue' id='tour_"+id+"' idTour="+id+"  style='cursor:pointer !important;'></div>");
                             $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
                             $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");

                           };

                          };

                },//fin success
                error: function(xhr,err){
                      //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                      alert("error: "+xhr.responseText);
                  }
        });//fin ajax


  });//fin btnTours

$("#bntour").click(function(){
	ofuscar('contTodoTours');
  setTimeout(function () {
    mostrarSlide('modal-ntour');
  }, 200);
});

$("#bcmntour").click(function(){
	ocultarSlide('modal-ntour');
	setTimeout(function ()
  {
    mostrarSlide('cont-tours');
    $('#contTodoTours').removeClass('ofuscado');
    $(".inputmodal").each(function()
    {
      $(this).val(''); 
    });
  }, 100);

});
$("#btnCrearTour").click(function(){
  var nombre = $("#nnuevtour").val();
  var ubicacion = $("#ubinuevtour").val();
  var fecha = $("#fechnuevtour").val();
  var moneda = $( "#inputMoneda option:selected" ).text();
  // var email = 'exe.zamar@gmail.com';
  var email = window.localStorage.getItem("email");
  if (email == '')
  {
    email = 'sinInfo@gmail.com';
  }
  //AJAX PARA INGRESAR UN NUEVO TOUR TANTO EN LA APP COMO EN LA NUBE
  $.ajax({
            url:'http://ibroker.extroversia.com/crearTour',
            type: 'post',
            data: { 
              email:email,
              nombre:nombre,
              ubicacion:ubicacion,
              fecha:fecha,
              moneda:moneda,

            },
            success: function(respuesta) {
                $("#bodyTours").empty();
                for (var i = 0; i < respuesta.length; i++)
                {
                  var id = respuesta[i].id;
                  var ubicacion = respuesta[i].ubicacion;
                  var nombre = respuesta[i].nombre;
                  var moneda = respuesta[i].moneda;
                  var fecha = respuesta[i].fecha;
                  
                  $("#bodyTours").append("<div class='animated contTour blue' id='tour_"+id+"' idTour="+id+" style='cursor:pointer;'></div>");
                  $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
                  $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");
                };
            },//fin success
            error: function(xhr,err){
                  //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                  alert("error: "+xhr.responseText);
              }
    });//fin ajax
    ocultarSlide('modal-ntour');
    setTimeout(function () {
      mostrarSlide('cont-tours');
      $('#contTodoTours').removeClass('ofuscado');
      $(".inputmodal").each(function(){
        $(this).val(''); 
      });
    }, 100);

 });

//  $(document).on('click','#bodyTours' , function() {
//   alert('clickeado');

// });
// $("#bodyTours").find(".contTour:first").trigger("click");
$('#bodyTours').on('click touch','.contTour' , function() {

   idTour = $(this).attr('idTour');
   nombreTour = $(this).children('td').eq(0).text();
   ubicacionTour = $(this).children('td').eq(1).text();
   //ajax para buscar todos los productos
   // var idTour = 'id del tour';
   $.ajax({
             url:'http://ibroker.extroversia.com/buscarProductos',
             type: 'post',
             data: { 
               idTour:idTour
             },
             success: function(respuesta) {
                         var count = respuesta.length;
                         $("#contTodosProdu").empty();
                         if (count == 0) {
                           $("#contTodosProdu").append("<div id='no-products' class='contPrduct '><div style='color:white;'>There are no products for this tour at this time.</div></div>");
                         }
                         else{
                           for (var i = 0; i < count; i++)
                           {
                             var id = respuesta[i].id;
                             var nombre = respuesta[i].nombre;
                             var tienda = respuesta[i].tienda;
                             var precioUnidad = respuesta[i].precioUnidad;
                             var precioCantidad = respuesta[i].precioCantidad;
                             var foto1 = respuesta[i].foto1;
                             // if (resultSet.rows.item(i).foto1 == null) {foto1 = 'img/sinFoto.png'};
                              // alert(foto1);
                              // alert('esto db: '+resultSet.rows.item(i).foto1);
                             $("#contTodosProdu").append("<div id=prod"+i+ " class='contPrduct' idProduct="+id+"></div>");  
                             $("#prod"+i).append("<div class='contImagenProd'><img src='"+foto1+"' class='imgProduct'> </div>");
                             $("#prod"+i).append("<div class='contDescProd'><div class='contInfoProd'> <div class='posnomprod'><span>"+nombre+"</span> </div><div class='postienda'><span>Store ID: </span><br><span>"+tienda+"</span></div></div><div class='contInfoProd'><div class='contUnitPrice'><span>Unit price: <br>"+precioUnidad+"</span></div><div class='contBulkPrice'> <span>Bulk price: <br> "+precioCantidad+"</span></div></div><div class='minfoprod'><div> <img src='img/arrow-right.svg' class='parrow-right'></div></div>");
                            
                           
                             
                             
                             // alert('src es '+test);
                           };
                         }//fin else
             },//fin success
             error: function(xhr,err){
                   //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                   alert("error: "+xhr.responseText);
               }
     });//fin ajax
     $("#tnombtour").text(nombreTour);
     $("#tubictour").text(ubicacionTour);
     $("#tnombtour2").text(nombreTour);
     $("#tubictour2").text(ubicacionTour);
    ocultarSlide('cont-tours');
    setTimeout(function () {
            mostrarSlide('cont-products');
          }, 200);
  });//fin clickTablaTours
  $("#btnVolverTour").click(function(){
    ocultarSlide('cont-products');
    setTimeout(function () {
          mostrarSlide('cont-tours');
        }, 200);
  });

  $("#contNewProduct").click(function(){
    ocultarSlide('cont-products');

    setTimeout(function () {
          mostrarSlide('modal-nproducto');
        }, 200);
  });

  $("#btnVolverNProd").click(function(){
    ocultarSlide('modal-nproducto');
    setTimeout(function () {
          mostrarSlide('cont-products');
        }, 200);
  });

  $("#btnCrearProducto").click(function(){

      var nombreProd = $("#nnuevprod").val();
      var descripcion = $("#descnuevprod").val();
      var tienda = $("#storenuevprod").val();
      var qty = $("#qtynuevprod").val();
      var cbm = $("#cbmnuevprod").val();
      var precioUnidad = $("#upricenuevprod").val();
      var precioCantidad = $("#bpricenuevprod").val();
      var minima = $("#minamnuevprod").val();
      var cantidadComprada = $("#cantcompranuevprod").val();
      var foto1 =  $("#imgprod1").attr('src');
      var foto2 =  $("#imgprod2").attr('src');
      var foto3 =  $("#imgprod3").attr('src');
      var email = window.localStorage.getItem("email");
        //AJAX PARA CREAR PRODUCTO
      swal({
            title: "Saving changes", 
            text: "please wait.", 
            showCancelButton: false,
            showConfirmButton: false
      });  
        $.ajax({
                  url:'http://ibroker.extroversia.com/crearProducto',
                  type: 'post',
                  data: { 
                    nombreProd:nombreProd,
                    descripcion:descripcion,
                    tienda:tienda,
                    qty:qty,
                    cbm:cbm,
                    precioUnidad:precioUnidad,
                    precioCantidad:precioCantidad,
                    minima:minima,
                    cantidadComprada:cantidadComprada,
                    foto1:foto1,
                    foto2:foto2,
                    foto3:foto3,
                    idTour:idTour,
                    email:email
                  },
                  success: function(respuesta) {
                      swal.close();
                      $("#bodyTours").empty();
                      for (var i = 0; i < respuesta.length; i++)
                      {
                        var id = respuesta[i].id;
                        var ubicacion = respuesta[i].ubicacion;
                        var nombre = respuesta[i].nombre;
                        var moneda = respuesta[i].moneda;
                        var fecha = respuesta[i].fecha;
                        
                        $("#bodyTours").append("<div class='animated contTour blue' id='tour_"+id+"' idTour="+id+" style='cursor:pointer;'></div>");
                        $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
                        $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");
                        ocultarSlide('modal-nproducto');
                        setTimeout(function() {
                          mostrarSlide('cont-tours');
                        }, 200);
                      };
                  },//fin success
                  error: function(xhr,err){
                        //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                        alert("error: "+xhr.responseText);
                    }
          });//fin ajax

     
      // alert(foto1);
      // var foto1 = $("#").val();
      // var foto2 = $("#").val();
      // var foto3 = $("#").val();
      //INGRESAR NUEVO REGISTRO
        // db.transaction(function(tx)
        // {
        //   tx.executeSql('INSERT INTO products (idTour, nombre, precioUnidad, precioCantidad, descripcion,cantidadMinima,CBM,QTY,tienda, cantidadComprada,foto1,foto2,foto3 ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [ idTour, nombreProd, precioUnidad, precioCantidad,descripcion,minima,cbm,qty,tienda,cantidadComprada,foto1,foto2,foto3]);
        // }, function(error) {
        //   alert('Transaction ERROR: ' + error.message);
        // }, function(tx) {

        //   var random = Math.floor((Math.random() * 1000) + 100);
        //   var id='888'; //toDO conseguir el id del registro que acabo de crear. BUG.
        //   $("#contTodosProdu").prepend("<div id=prod"+random+ " class='contPrduct' idProduct="+id+"></div>");  
        //   $("#prod"+random).append("<div class='contImagenProd'><img src='"+foto1+"' class='imgProduct'> </div>");
        //   $("#prod"+random).append("<div class='contDescProd'><div class='contInfoProd'> <div class='posnomprod'><span>"+nombreProd+"</span> </div><div class='postienda'><span>Store ID: </span><br><span>"+tienda+"</span></div></div><div class='contInfoProd'><div class='contUnitPrice'><span>Unit price: <br>"+precioUnidad+"</span></div><div class='contBulkPrice'> <span>Bulk price: <br> "+precioCantidad+"</span></div></div><div class='minfoprod'><div> <img src='img/arrow-right.svg' class='parrow-right'></div></div>");
        //   $("#contTodosProdu").animate({ scrollTop: 0 }, "fast");  
        //   $(".inputmodal").val('');
        //       ocultarSlide('modal-nproducto');
        //       $("#no-products").addClass('oculto');
        //       setTimeout(function () {
        //             mostrarSlide('cont-products');
        //           }, 200);
        // });//fin transaccion
  });// fin btnCrearProducto


  $("#buscarProductos" ).keyup(function() {
      var valor = $( "#buscarProductos" ).val();
      $(".contPrduct" ).each(function()
      {
         $('.contPrduct:not(:contains('+valor+'))').addClass('oculto');
         $('.contPrduct:contains('+valor+')').removeClass('oculto');
      });
  });

  $("#buscarTours" ).keyup(function() {
      var valor = $( "#buscarTours" ).val();
      console.log('valor es '+valor);
      $(".contTour" ).each(function()
      {
         $('.contTour:not(:contains('+valor+'))').addClass('oculto');
         $('.contTour:contains('+valor+')').removeClass('oculto');
      });
  });
var prodCBM = '';
var prodQTY = '';
var prodNom = '';
var prodTienda = '';
var prodPrecioUn = '';
var prodPrecioCant = '';
var prodCantidadComprada = '';
var prodDescripcion ='';
var prodCantMin = '';
var prodId = '';
var foto1= '';
var idProductoG = '';
$(document).on('click touch','.contPrduct', function()
{
      //buscar producto
      var id = $(this).attr('idProduct');
      idProductoG = id;
      swal({
            title: "Fetching data", 
            text: "please wait.", 
            showCancelButton: false,
            showConfirmButton: false
      });  
      $.ajax({
                url:'http://ibroker.extroversia.com/infoProducto',
                type: 'post',
                data: { idProducto:id},
                success: function(respuesta) {
                       swal.close();
                       if (respuesta == 'No encontrado') {
                         alert('no se encontro el id del producto');
                        }
                        else{
                          
                            var id = respuesta['id'];
                            
                            prodId = id;
                            prodNom = respuesta['nombre'];
                            prodTienda = respuesta['tienda'];
                            prodQTY = respuesta['QTY'];
                            prodCBM = respuesta['CBM'];
                            prodPrecioUn = respuesta['precioUnidad'];
                            prodPrecioCant = respuesta['precioCantidad'];
                            prodCantidadComprada = respuesta['cantidadComprada'];
                            prodDescripcion = respuesta['descripcion'];
                            prodCantMin = respuesta['cantidadMinima'];
                            foto1 = respuesta['foto1'];
                            // alert(foto1);
                            $("#nomprodinf").text(prodNom);
                            $("#nomtiendainf").text(prodTienda);
                            $("#descprodinfo").text(prodDescripcion);
                            $("#totpriccalcinf").text(prodPrecioUn);
                            $("#bulkprodinf").text(prodPrecioCant);
                            $("#cbmincalcinf").text(prodCantMin);
                            $("#qtyprodinf").text(prodQTY);
                            $("#cbmcalcinf").text(prodCBM);
                            $("#totpriccalcinf2").val(prodCantidadComprada);

                            $("#imgProductoGrande").css('background-image','url('+foto1+')');

                            var cbmcalculado = Number(prodCBM);
                            var unidad = Number(prodPrecioUn);
                            var comprada = Number(prodCantidadComprada);
                            var total = unidad*comprada;

                            $("#cbmcalcprodinf").text(cbmcalculado);
                            $("#imptotalprodinf").text(total);

                            ocultarSlide('cont-products');
                            setTimeout(function () {
                            mostrarSlide('modal-infoproducto');
                              
                             }, 200);
                            $("#contTodosProdu").append("<div id=prod"+id+ " class='contPrduct' idProduct="+id+"></div>");  
                            $("#prod"+id).append("<div class='contImagenProd'><img src='img/sinFoto.png' class='imgProduct'> </div>");
                          
                        }//fin else

                },//fin success
                error: function(xhr,err){
                      //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                      alert("error: "+xhr.responseText);
                  }
        });//fin ajax
 }); //fin contPrduct
  $("#btnVolverInfoProd").click(function(){
    ocultarSlide('modal-infoproducto');
    setTimeout(function () {
          mostrarSlide('cont-products');
        }, 200);
  });

  $("#totpriccalcinf2").keyup(function() {

     var cantidad = Number($(this).val());
     var total = 0;
     var precioUnidad = Number($("#totpriccalcinf").text());
     total = cantidad*precioUnidad;
     $("#imptotalprodinf").text(total);
     var totcbm = Number(prodCBM);
     var totalBulto = totcbm * cantidad;
     $("#cbmcalcprodinf").text(totalBulto);

     // var paquete = Number(prodCBM) * Number(prodQTY);
     var cantPaquetes =  cantidad / Number(prodQTY);
     $("#totPackages").text(cantPaquetes);
  });

  function movePic(file){ 
      window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError); 

  } 

  //Callback function when the file system uri has been resolved
  function resolveOnSuccess(entry){ 
      var d = new Date();
      var n = d.getTime();
      //new file name
      var newFileName = n + ".jpg";
      var myFolderApp = "ibroker";

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
      //The folder is created if doesn't exist
      fileSys.root.getDirectory( myFolderApp,
                      {create:true, exclusive: false},
                      function(directory) {
                          entry.moveTo(directory, newFileName,  successMove, resOnError);
                      },
                      resOnError);
                      },
      resOnError);
  }

  //Callback function when the file has been moved successfully - inserting the complete path
  function successMove(entry) {
      //I do my insert with "entry.fullPath" as for the path
     // alert('successmove'+entry.fullPath);
      var image = document.getElementById('imgprod1');
      image.src = entry.toURL();
      // alert('full path es'+image.src);
  };

  function resOnError(error) {
      alert(error.code);
  };
  function sendPicture (file) {

    var fs = new CoFS();

    fs.readFile(file, function (err, data) {

        if (err) {
            return errHandler(err);
        }

        var fd = new FormData();

        fd.append('attachment', new Blob(data));
        fd.append('uuid', uuid);
        fd.append('userRoleId', userRole);

        console.log("Data of file:" + data.toString('base64'));
        return data.toString('base64');

    });
  };
  var formFoto1 = new FormData();
  $("#bafp1").click(function(){
        navigator.camera.getPicture(onSuccessFoto1, onFail, { quality: 50,
            // destinationType: Camera.DestinationType.DATA_URL ,
            destinationType: Camera.DestinationType.FILE_URI ,
            // sourceType:  Camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:true
        });
        
        function onSuccessFoto1(imageData) {
          $("#imgprod1").attr('src', 'img/sinFoto.png');
          // $("#imgprod1").removeClass('oculto');
         var dato = imageData;
         var fd = new FormData();
              window.resolveLocalFileSystemURL(dato, function(fileEntry) {
                  fileEntry.file(function(file) {
                      var reader = new FileReader();
                      // swal('Subiendo imagen','please wait');
                          reader.onloadend = function(e) {
                               var imgBlob = new Blob([ this.result ], { type: "image/jpeg" } );
                               fd.append('attachment', imgBlob);
                               fd.append('uuid', dato.uuid);
                               fd.append('userRoleId', 12345);
                               // console.log(fd);
                               $.ajax({
                                  url:'http://ibroker.extroversia.com/nuevaFoto',
                                  data: fd,
                                  type: 'POST',
                                  contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                                  processData: false, // NEEDED, DON'T OMIT THIS
                                  success: function(respuesta) {
                                     // swal.close();
                                    $("#imgprod1").attr('src', respuesta);
                                  
                                    var test =  $("#imgprod1").attr('src');
                                    // alert('test es'+test);
                                      
                                      },//fin success
                                    error: function (error) {
                                      swal('Problemas!','No se pudo subir la imagen','error');
                                    }
                                  });//fin ajax
                          };
                          reader.readAsArrayBuffer(file);

                  }, function(e){$scope.errorHandler(e)});
             }, function(e){$scope.errorHandler(e)});
        };//fin onSuccess1
        function onFail(message) {
            alert('Failed because: ' + message);
        }
  });//fin bafp1

  $("#btnEditarProducto").click(function(){
      ocultarSlide('modal-infoproducto');
      $("#ednnuevprod").val(prodNom);
      $("#eddescnuevprod").val(prodDescripcion);
      $("#edstorenuevprod").val(prodTienda);
      $("#edqtynuevprod").val(prodQTY);
      $("#edcbmnuevprod").val(prodCBM);
      $("#edupricenuevprod").val(prodPrecioUn);
      $("#edbpricenuevprod").val(prodPrecioCant);
      $("#edminamnuevprod").val(prodCantMin);
      $("#edcantComprada").val(prodCantidadComprada);

      
      setTimeout(function () {
            mostrarSlide('modal-editanproducto');
          }, 200);
    });
  $("#btnVolverEdProd").click(function(){
    ocultarSlide('modal-editanproducto');
    setTimeout(function () {
          mostrarSlide('modal-infoproducto');
        }, 200);
  });

  $("#btnGuardarCambiosProducto").click(function(){
    
     prodCBM = $("#edcbmnuevprod").val();
     prodQTY = $("#edqtynuevprod").val();
     prodNom = $("#ednnuevprod").val();
     prodTienda = $("#edstorenuevprod").val();
     prodPrecioUn = $("#edupricenuevprod").val();
     prodPrecioCant = $("#edbpricenuevprod").val();
     prodCantidadComprada = $("#edcantComprada").val();
     prodDescripcion = $("#eddescnuevprod").val();
     prodCantMin =  $("#edminamnuevprod").val();
     var nombreProd = $("#ednnuevprod").val(); 
     var descripcion = $("#eddescnuevprod").val();
     var foto1 = $("#bafp1").attr('src');
     var foto2 = $("#bafp2").attr('src');
     var foto3 = $("#bafp3").attr('src');
     var email = window.localStorage.getItem("email");
     swal({
           title: "Saving changes", 
           text: "please wait.", 
           showCancelButton: false,
           showConfirmButton: false
     });  
       $.ajax({
                 url:'http://ibroker.extroversia.com/editarProducto',
                 type: 'post',
                 data: { 
                   nombreProd:nombreProd,
                   descripcion:descripcion,
                   tienda:prodTienda,
                   QTY:prodQTY,
                   CBM:prodCBM,
                   precioUnidad:prodPrecioUn,
                   precioCantidad:prodPrecioCant,
                   minima:prodCantMin,
                   cantidadComprada:prodCantidadComprada,
                   foto1:foto1,
                   foto2:foto2,
                   foto3:foto3,
                   idTour:idTour,
                   email:email,
                   idProducto:idProductoG
                 },
                 success: function(respuesta) {
                     swal.close();
                     $("#bodyTours").empty();
                     for (var i = 0; i < respuesta.length; i++)
                     {
                       var id = respuesta[i].id;
                       var ubicacion = respuesta[i].ubicacion;
                       var nombre = respuesta[i].nombre;
                       var moneda = respuesta[i].moneda;
                       var fecha = respuesta[i].fecha;
                       
                       $("#bodyTours").append("<div class='animated contTour blue' id='tour_"+id+"' idTour="+id+" style='cursor:pointer;'></div>");
                       $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
                       $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");
                       ocultarSlide('modal-editanproducto');
                       setTimeout(function() {
                         mostrarSlide('cont-products');
                       }, 200);
                     };
                 },//fin success
                 error: function(xhr,err){
                       //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                       alert("error: "+xhr.responseText);
                   }
         });//fin ajax
     //EDITAR REGISTRO
       // db.transaction(function(tx)
       // {
       //   tx.executeSql('UPDATE products SET cantidadMinima = "'+prodCantMin+'",cantidadComprada = "'+prodCantidadComprada+'",CBM = "'+prodCBM+'", QTY = "'+prodQTY+'", tienda = "'+prodTienda+'", precioUnidad = "'+prodPrecioUn+'", precioCantidad = "'+prodPrecioCant+'", nombre = "'+prodNom+'", descripcion = "'+prodDescripcion+'" WHERE id = "'+prodId+'"');
       // }, function(error) {
       //   alert('Transaction ERROR: ' + error.message);
       // }, function(tx) {
       //   //ACTUALIZAR DATOS EN INFO
       //  $("#nomprodinf").text(prodNom);
       //  $("#nomtiendainf").text(prodTienda);
       //  $("#descprodinfo").text(prodDescripcion);
       //  $("#totpriccalcinf").text(prodPrecioUn);
       //  $("#bulkprodinf").text(prodPrecioCant);
       //  $("#cbmincalcinf").text(prodCantMin);
       //  $("#qtyprodinf").text(prodQTY);
       //  $("#cbmcalcinf").text(prodCBM);
       //  $("#totpriccalcinf2").val(prodCantidadComprada);
       //  ocultarSlide('modal-editanproducto');
       //  setTimeout(function () {
       //        mostrarSlide('modal-infoproducto');
       //      }, 200);

       // });//fin transaccion

       //ajax para editar el producto
  });//fin guardar cambios
  $("#btnEliminarProd").click(function(){
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary file!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      closeOnConfirm: false,
      closeOnCancel: true
    },
    function(isConfirm){
      if (isConfirm) {
        
        //ELIMINAR REGISTRO
          // db.transaction(function(tx)
          // {
          //   tx.executeSql('DELETE FROM Products WHERE id = '+prodId+'');
          // }, function(error) {
          //   alert('Transaction ERROR: ' + error.message);
          // }, function(tx) {
          //   ocultarSlide('modal-editanproducto');
          //   setTimeout(function () {
          //         mostrarSlide('cont-tours');
          //       }, 200);
          //   swal('Product deleted','','success');
          // });//fin transaccion
          swal({
                title: "Saving changes", 
                text: "please wait.", 
                showCancelButton: false,
                showConfirmButton: false
          });
          //ajax para eliminar el producto
          $.ajax({
                    url:'http://ibroker.extroversia.com/eliminarProducto',
                    type: 'post',
                    data: { 
                      idProducto:idProductoG
                    },
                    success: function(respuesta) {
                        swal.close();
                        if (respuesta =='borrado')
                        {
                            ocultarSlide('modal-editanproducto');
                            setTimeout(function () {
                                  mostrarSlide('cont-tours');
                                }, 200);
                            swal('Product deleted','','success');
                        }
                        else{
                          swal('Product id not found','We were unable to locate the product','error');
                        }
                        
                    },//fin success
                    error: function(xhr,err){
                          //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                          alert("error: "+xhr.responseText);
                      }
            });//fin ajax

        
      } else {
        //swal("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  });//fin eliminar producto

  $('#syncDB').click(function(){
  //pedir nombre de usuario

   swal({
     title: "What's your Email address?",
     text: "You will need it to access the cloud",
     type: "input",
     showCancelButton: true,
     closeOnConfirm: false,
     animation: "slide-from-top",
     inputPlaceholder: "E-mail"
   },
   function(inputValue){
     if (inputValue === false) return false;
     
     if (inputValue === "") {
       swal.showInputError("Email address is invalid");
       return false
     }
     swal({
          title: "Uploading information", 
          text: "This could take several minutes.", 
          showCancelButton: false,
          showConfirmButton: false
      });


     //BUSCAR TOURS
     db.executeSql("SELECT * FROM tours order by id desc", [], function (resultSet)
     {
       var count = resultSet.rows.length;
       for (var i = 0; i <= resultSet.rows.length; i++)
         {
          
           var minilista = [];
           var id = resultSet.rows.item(i).id;
           var ubicacion = resultSet.rows.item(i).ubicacion;
           var nombre = resultSet.rows.item(i).nombre;
           var moneda = resultSet.rows.item(i).moneda;
           var fecha = resultSet.rows.item(i).fecha;

           minilista.push(nombre,ubicacion,fecha,moneda);
           $.ajax({
                     url:'http://ibroker.extroversia.com/nuevoTour',
                     type: 'post',
                     data: { 
                      nombre: nombre,
                      ubicacion: ubicacion,
                      moneda: moneda,
                      fecha: fecha,
                      referencia: id,
                      usuario: inputValue
                     },
                     success: function(respuesta) {
                          
                     },//fin success
                     error: function(xhr,err){
                           //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                           alert("error: "+xhr.responseText);
                       }
             });//fin ajax
         };
       
     }, function(error) {
       alert('SELECT error: ' + error.message);
     });//fin query
      
  //BUSCAR PRODUCTOS
  db.executeSql("SELECT * FROM products order by id desc", [], function (resultSet) {
    var count = resultSet.rows.length;
    for (var i = 0; i <= resultSet.rows.length; i++)
      {
        var minilistaP = [];
        var idTour = resultSet.rows.item(i).idTour;
        var nombre = resultSet.rows.item(i).nombre;
        var precioUnidad = resultSet.rows.item(i).precioUnidad;
        var precioCantidad = resultSet.rows.item(i).precioCantidad;
        var descripcion = resultSet.rows.item(i).descripcion;
        var cantidadMinima = resultSet.rows.item(i).cantidadMinima;
        var tienda = resultSet.rows.item(i).tienda;
        var CBM = resultSet.rows.item(i).CBM;
        var QTY = resultSet.rows.item(i).QTY;
        var foto1 = resultSet.rows.item(i).foto1;
        var foto2 = resultSet.rows.item(i).foto2;
        var foto3 = resultSet.rows.item(i).foto3;
        var cantidadComprada = resultSet.rows.item(i).cantidadComprada;
        var formDataFoto = new FormData();
      //  minilistaP.push(idTour,nombre,precioUnidad,precioCantidad,cantidadMinima,descripcion,CBM,QTY,cantidadComprada);
        var idBackend = '';

        $.ajax({
                  url:'http://ibroker.extroversia.com/buscarProductos',
                  type: 'post',
                  data: { 
                    idTour: idTour
                  },
                  success: function(respuesta) {
                          // tengo de respuesta el id creado alla, entonces subo un ajax con las fotos y le asigno ese id
                           // idBackend = respuesta;
                  },//fin success
                  error: function(xhr,err){
                        //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                        alert("error: "+xhr.responseText);
                    }
          });//fin ajax
      };//fin for
      
  }, function(error) {
    alert('SELECT error: ' + error.message);
  });//fin query

    swal('Data has been saved','','success');

    });//fin valida inputValue
  });//fin sync



$(".totoBasta").click(function(){

  ocultarSlide("cont-tours");
  setTimeout(function () {
    mostrarSlide('cont-menu');
  }, 500);

});


});//fin onready

