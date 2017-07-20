
var db = null;
var cuenta = 0;

document.addEventListener('deviceready', function()
{
	//CREAR BASE SI NO EXISTE
	db = window.sqlitePlugin.openDatabase({name: 'broker.db', location: 'default'});
	db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS tours (id text primary key, nombre text, ubicacion text, moneda text)");
    }, function (err) {
        alert("An error occurred while initializing the app");
    });


});//fin deviceready

 $("#btnPopular").click(function(){
      
 	   //INGRESAR NUEVO REGISTRO
       db.transaction(function(tx)
       {
		  tx.executeSql('INSERT INTO tours (nombre, ubicacion, moneda) VALUES (?,?,?)', [ 'Alice','Alice','Alice']);
		  }, function(error) {
		   alert('Transaction ERROR: ' + error.message);
		  }, function() {
		    console.log('Populated database OK');
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

$("#bmTours").click(function(){
    ocultarSlide("cont-menu");
    setTimeout(function () {
      mostrarSlide('cont-tours')
    }, 500);
    //BUSCAMOS LOS TOURS
    db.executeSql("SELECT * FROM Tours order by id desc", [], function (resultSet) {
    var count = resultSet.rows.length;
    var nombre = resultSet.rows.item(10).nombre;
    for (var i = 0; i < resultSet.rows.length; i++)
    {
    	alert(resultSet.rows.item(i).nombre);
    };

	 
	}, function(error) {
	  alert('SELECT error: ' + error.message);
	});


    $('#tablaTours').DataTable( 
      {
         order:[],
         "paging": true,
        "initComplete": function(settings, json) {swal.close();},

     });

  });
$("#bntour").click(function(){
  $("#modal-ntour").removeClass('oculto');

  $("#modal-ntour").addClass('fadeIn');

  });




});//fin onready