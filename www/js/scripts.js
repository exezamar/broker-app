
var db = null;
var cuenta = 0;
var idTour = '';
var nombreTour = '';
var ubicacionTour = '';
var monedaTour = '';
var tablaTours = '';
var todosTours = [];
var todosProductos = [];


document.addEventListener('deviceready', function()
{

	//CREAR BASE SI NO EXISTE
	db = window.sqlitePlugin.openDatabase({name: 'brokersDev02.db', iosDatabaseLocation: 'Library'});
	db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY, nombre text, ubicacion text, moneda text, fecha text)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY,idTour text, nombre text, precioUnidad text,precioCantidad, descripcion text,cantidadMinima text, CBM text, QTY text, tienda text, foto1 text, foto2 text, foto3 text, cantidadComprada text)");
  }, function (err) {
    alert("An error occurred while initializing the app");
  });

});//fin deviceready

$("#btnPopular").click(function(){

 	   //INGRESAR NUEVO REGISTRO
      db.transaction(function(tx)
      {
        tx.executeSql('INSERT INTO tours (nombre, ubicacion, moneda, fecha) VALUES (?,?,?,?)', [ 'nombre','ubicacion','moneda','fecha']);
      }, function(error) {
        alert('Transaction ERROR: ' + error.message);
      }, function() {
       
		  });//fin transaccion

      //MOSTAR CUANTOS RECORDS HAY
      db.transaction(function(tx)
      {
       tx.executeSql('SELECT count(*) AS mycount FROM tours', [], function(tx, rs) {
        alert('Record count: ' + rs.rows.item(0).mycount);
      }, function(tx, error) {
       alert('SELECT error: ' + error.message);
     });
  		  });//fin transaccion
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
      db.executeSql("SELECT * FROM Tours order by id desc", [], function (resultSet) {
        var count = resultSet.rows.length;
        if (count == 0 ){
          $("#bodyTours").append("<div class='animated contTour blue' id='no-tours'><div>Your shopping tours will show up here.</div></div>");
        }
        else{
          $("#bodyTours").empty();
          for (var i = 0; i < resultSet.rows.length; i++)
          {
            
            var id = resultSet.rows.item(i).id;
            var ubicacion = resultSet.rows.item(i).ubicacion;
            var nombre = resultSet.rows.item(i).nombre;
            var moneda = resultSet.rows.item(i).moneda;
            var fecha = resultSet.rows.item(i).fecha;

            $("#bodyTours").append("<div class='contTour animated  blue' id='tour_"+id+"' idTour="+id+"  style='cursor:pointer !important;'></div>");
            $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
            $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");

          };
        }
        
      }, function(error) {
        alert('SELECT error: ' + error.message);
      });//fin query

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
      //INGRESAR NUEVO REGISTRO
      db.transaction(function(tx)
      {
        tx.executeSql('INSERT INTO tours (nombre, ubicacion, moneda, fecha) VALUES (?,?,?,?)', [ nombre, ubicacion, moneda, fecha]);
      }, function(error) {
        alert('Transaction ERROR: ' + error.message);
      }, function() {
        //guardado exitosamente
        $("#bodyTours").empty();
        db.executeSql("SELECT * FROM Tours order by id desc", [], function (resultSet) {
        for (var i = 0; i < resultSet.rows.length; i++)
        {
          var id = resultSet.rows.item(i).id;
          var ubicacion = resultSet.rows.item(i).ubicacion;
          var nombre = resultSet.rows.item(i).nombre;
          var moneda = resultSet.rows.item(i).moneda;
          var fecha = resultSet.rows.item(i).fecha;
          
          $("#bodyTours").append("<div class='animated contTour blue' id='tour_"+id+"' idTour="+id+" style='cursor:pointer;'></div>");
          $("#tour_"+id).append("<div class='contDescProd'><div class='contInfoProd'><div class='posnomtour'><span>"+nombre+"</span> </div><div class='postienda'> <span>Date: </span><br><span>"+fecha+"</span></div></div><div class='contInfoProd'><div class='contLocation'><span>Location: <br> "+ubicacion+"</div><div class='contCurrency'></span><span>Currency: <br> "+moneda+"</span></div></div></div>");
          $("#tour_"+id).append("<div class='posarrowt'><div><img src='img/arrow-right.svg' class='parrow-right'></div></div>");
        };
      });//fin transaccion

        ocultarSlide('modal-ntour');
        setTimeout(function () {
          mostrarSlide('cont-tours');
          $('#contTodoTours').removeClass('ofuscado');
          $(".inputmodal").each(function(){
            $(this).val(''); 
          });
        }, 100);
      });//fin transaccion

    });

//  $(document).on('click','#bodyTours' , function() {
//   alert('clickeado');

// });
$("#bodyTours").find(".contTour:first").trigger("click");
$('#bodyTours').on('click touchstart','.contTour' , function() {

   idTour = $(this).attr('idTour');
   nombreTour = $(this).children('td').eq(0).text();
   ubicacionTour = $(this).children('td').eq(1).text();
   var query = 'SELECT * FROM Products where "idTour" = "'+idTour+'" order by id desc';
   db.executeSql(query, [], function (resultSet) 
   {
        var count = resultSet.rows.length;
        $("#contTodosProdu").empty();
        if (count == 0) {
          $("#contTodosProdu").append("<div id='no-products' class='contPrduct '><div style='color:white;'>There are no products for this tour at this time.</div></div>");
        }
        else{
          for (var i = 0; i < resultSet.rows.length; i++)
          {
            var id = resultSet.rows.item(i).id;
            var nombre = resultSet.rows.item(i).nombre;
            var tienda = resultSet.rows.item(i).tienda;
            var precioUnidad = resultSet.rows.item(i).precioUnidad;
            var precioCantidad = resultSet.rows.item(i).precioCantidad;

            $("#contTodosProdu").append("<div id=prod"+i+ " class='contPrduct' idProduct="+id+"></div>");  
            $("#prod"+i).append("<div class='contImagenProd'><img src='img/sinFoto.png' class='imgProduct'> </div>");
            $("#prod"+i).append("<div class='contDescProd'><div class='contInfoProd'> <div class='posnomprod'><span>"+nombre+"</span> </div><div class='postienda'><span>Store ID: </span><br><span>"+tienda+"</span></div></div><div class='contInfoProd'><div class='contUnitPrice'><span>Unit price: <br>"+precioUnidad+"</span></div><div class='contBulkPrice'> <span>Bulk price: <br> "+precioCantidad+"</span></div></div><div class='minfoprod'><div> <img src='img/arrow-right.svg' class='parrow-right'></div></div>");
          };
        }//fin else
     });//fin query
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

      // var foto1 = $("#").val();
      // var foto2 = $("#").val();
      // var foto3 = $("#").val();
      //INGRESAR NUEVO REGISTRO
        db.transaction(function(tx)
        {
          tx.executeSql('INSERT INTO products (idTour, nombre, precioUnidad, precioCantidad, descripcion,cantidadMinima,CBM,QTY,tienda, cantidadComprada ) VALUES (?,?,?,?,?,?,?,?,?,?)', [ idTour, nombreProd, precioUnidad, precioCantidad,descripcion,minima,cbm,qty,tienda,cantidadComprada]);
        }, function(error) {
          alert('Transaction ERROR: ' + error.message);
        }, function(tx) {

          var random = Math.floor((Math.random() * 1000) + 100);
          var id='888'; //toDO conseguir el id del registro que acabo de crear. BUG.
          $("#contTodosProdu").prepend("<div id=prod"+random+ " class='contPrduct' idProduct="+id+"></div>");  
          $("#prod"+random).append("<div class='contImagenProd'><img src='img/sinFoto.png' class='imgProduct'> </div>");
          $("#prod"+random).append("<div class='contDescProd'><div class='contInfoProd'> <div class='posnomprod'><span>"+nombreProd+"</span> </div><div class='postienda'><span>Store ID: </span><br><span>"+tienda+"</span></div></div><div class='contInfoProd'><div class='contUnitPrice'><span>Unit price: <br>"+precioUnidad+"</span></div><div class='contBulkPrice'> <span>Bulk price: <br> "+precioCantidad+"</span></div></div><div class='minfoprod'><div> <img src='img/arrow-right.svg' class='parrow-right'></div></div>");
          $("#contTodosProdu").animate({ scrollTop: 0 }, "fast");  
          $(".inputmodal").val('');
              ocultarSlide('modal-nproducto');
              $("#no-products").addClass('oculto');
              setTimeout(function () {
                    mostrarSlide('cont-products');
                  }, 200);
        });//fin transaccion
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
$(document).on('touchstart','.contPrduct', function()
{
      
      var id = $(this).attr('idProduct');
      var query = 'SELECT * FROM Products where "id" = "'+id+'"';
        db.executeSql(query, [], function (resultSet) 
        {
             var count = resultSet.rows.length;
             if (count == 0) {
              alert('no se encontro el id del producto');
             }
             else{
               
                 var id = resultSet.rows.item(0).id;
                 prodId = id;
                 prodNom = resultSet.rows.item(0).nombre;
                 prodTienda = resultSet.rows.item(0).tienda;
                 prodQTY = resultSet.rows.item(0).QTY;
                 prodCBM = resultSet.rows.item(0).CBM;
                 prodPrecioUn = resultSet.rows.item(0).precioUnidad;
                 prodPrecioCant = resultSet.rows.item(0).precioCantidad;
                 prodCantidadComprada = resultSet.rows.item(0).cantidadComprada;
                 prodDescripcion = resultSet.rows.item(0).descripcion;
                 prodCantMin = resultSet.rows.item(0).cantidadMinima;

                 $("#nomprodinf").text(prodNom);
                 $("#nomtiendainf").text(prodTienda);
                 $("#descprodinfo").text(prodDescripcion);
                 $("#totpriccalcinf").text(prodPrecioUn);
                 $("#bulkprodinf").text(prodPrecioCant);
                 $("#cbmincalcinf").text(prodCantMin);
                 $("#qtyprodinf").text(prodQTY);
                 $("#cbmcalcinf").text(prodCBM);
                 $("#totpriccalcinf2").val(prodCantidadComprada);

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
                 // $("#contTodosProdu").append("<div id=prod"+i+ " class='contPrduct' idProduct="+id+"></div>");  
                 // $("#prod"+i).append("<div class='contImagenProd'><img src='img/sinFoto.png' class='imgProduct'> </div>");
               
             }//fin else
          });//fin query
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
  $("#bafp1").click(function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URI
        });

        function onSuccess(imageData) {
            var image = document.getElementById('imgprod1');
            // image.src = "data:image/jpeg;base64," + imageData;
            image.src = imageData;
            // $("#imgprod1").removeClass('oculto');
            // alert(imageData);
            
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
            
      

    
  });
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
     
     //EDITAR REGISTRO
       db.transaction(function(tx)
       {
         tx.executeSql('UPDATE products SET cantidadMinima = "'+prodCantMin+'",cantidadComprada = "'+prodCantidadComprada+'",CBM = "'+prodCBM+'", QTY = "'+prodQTY+'", tienda = "'+prodTienda+'", precioUnidad = "'+prodPrecioUn+'", precioCantidad = "'+prodPrecioCant+'", nombre = "'+prodNom+'", descripcion = "'+prodDescripcion+'" WHERE id = "'+prodId+'"');
       }, function(error) {
         alert('Transaction ERROR: ' + error.message);
       }, function(tx) {
         //ACTUALIZAR DATOS EN INFO
        $("#nomprodinf").text(prodNom);
        $("#nomtiendainf").text(prodTienda);
        $("#descprodinfo").text(prodDescripcion);
        $("#totpriccalcinf").text(prodPrecioUn);
        $("#bulkprodinf").text(prodPrecioCant);
        $("#cbmincalcinf").text(prodCantMin);
        $("#qtyprodinf").text(prodQTY);
        $("#cbmcalcinf").text(prodCBM);
        $("#totpriccalcinf2").val(prodCantidadComprada);
        ocultarSlide('modal-editanproducto');
        setTimeout(function () {
              mostrarSlide('modal-infoproducto');
            }, 200);

       });//fin transaccion
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
          db.transaction(function(tx)
          {
            tx.executeSql('DELETE FROM Products WHERE id = '+prodId+'');
          }, function(error) {
            alert('Transaction ERROR: ' + error.message);
          }, function(tx) {
            ocultarSlide('modal-editanproducto');
            setTimeout(function () {
                  mostrarSlide('cont-tours');
                }, 200);
            swal('Product deleted','','success');
          });//fin transaccion

        
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
     db.executeSql("SELECT * FROM tours order by id desc", [], function (resultSet) {
       var count = resultSet.rows.length;
       for (var i = 0; i < resultSet.rows.length; i++)
         {
           var minilista = [];
           var id = resultSet.rows.item(i).id;
           var ubicacion = resultSet.rows.item(i).ubicacion;
           var nombre = resultSet.rows.item(i).nombre;
           var moneda = resultSet.rows.item(i).moneda;
           var fecha = resultSet.rows.item(i).fecha;

           minilista.push(nombre,ubicacion,fecha,moneda);
           todosTours.push(minilista);
         };
       
     }, function(error) {
       alert('SELECT error: ' + error.message);
     });//fin query
     //BUSCAR PRODUCTOS
     db.executeSql("SELECT * FROM products order by id desc", [], function (resultSet) {
       var count = resultSet.rows.length;
       for (var i = 0; i < resultSet.rows.length; i++)
         {
           var minilistaP = [];
           var idTour = resultSet.rows.item(i).idTour;
           var nombre = resultSet.rows.item(i).nombre;
           var precioUnidad = resultSet.rows.item(i).precioUnidad;
           var precioCantidad = resultSet.rows.item(i).precioCantidad;
           var descripcion = resultSet.rows.item(i).descripcion;
           var cantidadMinima = resultSet.rows.item(i).cantidadMinima;
           var CBM = resultSet.rows.item(i).CBM;
           var QTY = resultSet.rows.item(i).QTY;
           var foto1 = resultSet.rows.item(i).foto1;
           var foto2 = resultSet.rows.item(i).foto2;
           var foto3 = resultSet.rows.item(i).foto3;
           var cantidadComprada = resultSet.rows.item(i).cantidadComprada;
         
           minilistaP.push(idTour,nombre,precioUnidad,precioCantidad,cantidadMinima,descripcion,CBM,QTY,foto1,foto2,foto3,cantidadComprada);
           todosProductos.push(minilistaP);
         };
     }, function(error) {
       alert('SELECT error: ' + error.message);
     });//fin query

     $.ajax({
               url:'http://ibroker.extroversia.com/sync',
               type: 'post',
               data: {
                productos: todosProductos,
                tours: todosTours,
              },
               success: function(respuesta) {
                       swal.close();
                       alert(respuesta);
               },//fin success
               error: function(xhr,err){
                     alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                     alert("responseText: "+xhr.responseText);
                 }
       });//fin ajax
   });
  });//fin sync
});//fin onready
