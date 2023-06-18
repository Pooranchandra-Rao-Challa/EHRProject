//const { ajax } = require("jquery");
//const DocumentContext = require("pdfmake/src/documentContext");


let arrow = document.querySelectorAll(".arrow");
if(arrow)
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement;//selecting main parent of arrow
 arrow[i].parentElement.classList.toggle("active");
  });
}


function CloseAppointment(){
  var appevent = jQuery.Event( "click" );
  $( "#appointmentClose").trigger( appevent );
}

function OpenSaveSuccessAppointment(){
  $( "#modal-message-success").css("display", "block");
}
function CloseSaveSuccessAppointment(){
  $( "#modal-message-success").css("display", "none");
}

function RequiredFormCountrolMouseEnter(){
  //$(src).css('background-color','red');
  $(this).toggleClass("active");
  alert($(this).attr('id'));
  //alert(src);
}

function JSONPCalls(url,callback){
  alert(url)
  $.ajax({
    type: "GET",
    url: url,
    dataType: "jsonp",
    success: function (xml) {
        alert(xml);
        //result = xml.code;
        //document.myform.result1.value = result;
    },
    error: function(err){
      alert(JSON.stringify(err))
    }
});
}

function toggleCCDAdropdown(){
  $("a.ccda-seletion").on('click',function() {
    $("#ccda-dropdwon").dropdown("toggle");
 });

}

