
var db = null;
var cuenta = 0;

document.addEventListener('deviceready', function()
{
   
	//CREAR BASE SI NO EXISTE
	db = window.sqlitePlugin.openDatabase({name: 'brokersDev00.db', iosDatabaseLocation: 'Library'});
	db.transaction(function (tx) {
        
        tx.executeSql("CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY, nombre text, ubicacion text, moneda text, fecha text)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY,idTour text, nombre text, precioUnidad text,precioCantidad, descripcion text,cantidadMinima text, CBM text, QTY text, tienda text, foto1 text, foto2 text, foto3 text)");
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
		    alert('Populated database OK');
		});//fin transaccion

       //MOSTAR CUANTOS RECORDS HAY
      	db.transaction(function(tx) {
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

function ofuscar(div){
  $("#"+div).addClass('ofuscado');
}

$(document).ready( function() {
    $(".ui-loader").hide();
    function onSuccess(imageData){
      var src = 'data:image/jpg;base64, ';
      $("#image").attr('src', src+imageData);
      $("#image").attr('src', imageData);

      // alert(src+imageData);
    }
    function onFail(error){
      alert('error');
    }

    function getPhoto(source) {
          // Retrieve image file location from specified source
          navigator.camera.getPicture(onSuccess, onFail, { quality: 50, 
            destinationType: destinationType.FILE_URI,
            sourceType: source });
        }


$("#bsFoto").click(function(){
      navigator.camera.getPicture(onSuccess, onFail,
      {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
      });
});

$("#login").click(function(){

    ocultarSlide("cont-login");
    setTimeout(function () {
      mostrarSlide('cont-menu')
    }, 500);

});
var tablaTours = '';
$("#bmTours").click(function(){
    ocultarSlide("cont-menu");
    setTimeout(function () {
      mostrarSlide('cont-tours');
       $("div.dataTables_scroll").css({"clear":"both !important"});
      
    }, 500);
      //CREAR TABLA PARA TOURS
    db.executeSql("SELECT * FROM Tours order by id desc", [], function (resultSet) {
          var count = resultSet.rows.length;
         for (var i = 0; i < resultSet.rows.length; i++)
         {
          var id = resultSet.rows.item(i).id;
          var ubicacion = resultSet.rows.item(i).ubicacion;
          var nombre = resultSet.rows.item(i).nombre;
          var moneda = resultSet.rows.item(i).moneda;
          var fecha = resultSet.rows.item(i).fecha;
          $("#bodyTours").append("<tr idTour='"+id+"'><td style='color:black !important;font-size:1em;'>"+nombre+"</td><td>"+ubicacion+"</td><td>"+fecha+"</td></tr>")
         };

         tablaTours = $('#tablaTours').DataTable( 
         {
           order:[],
           "paging": false,
           "initComplete": function(settings, json) {
          },
         
         });
       

        }, function(error) {
           alert('SELECT error: ' + error.message);
      });//fin query
  tablaTours.dataTable({"scrollY": "250px"});
  });//fin btnTours

$("#bntour").click(function(){
  
	ofuscar('contTodoTours');
  setTimeout(function () {
    mostrarSlide('modal-ntour');
    }, 200);


  });

$("#bcmntour").click(function(){
	ocultarSlide('modal-ntour');
	setTimeout(function () {
    	mostrarSlide('cont-tours');
    $('#contTodoTours').removeClass('ofuscado');

		$(".inputmodal").each(function(){
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
        //ToDo: agregar el nuevo registro a la datatable.
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
  $(document).on('click','#tablaTours > tbody > tr > td', function() {
          var padre = $(this).parent();
          var idTour = padre.attr('idTour');

          alert();
  });//fin clickTablaTours


});//fin onready