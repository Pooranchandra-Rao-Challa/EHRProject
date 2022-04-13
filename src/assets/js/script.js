let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  debugger
  arrow[i].addEventListener("click", (e)=>{
 let arrowParent = e.target.parentElement;//selecting main parent of arrow
 arrow[i].parentElement.classList.toggle("active");
//  arrowParent.classList.toggle("showMenu");
  });
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", ()=>{
  debugger
  sidebar.classList.toggle("close");
});

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
/*
var mouse_is_patientsearch = false;

$(document).ready(function()
{
    $('.smartview-patient-search-result').handleIn(function(){
      mouse_is_patientsearch=true;
    }, function(){
      mouse_is_patientsearch=false;
    });
    var appevent = jQuery.Event( "click" );
    $("body").trigger(function(){
        if(!mouse_is_patientsearch) $('.form_wrapper').hide();
    });
});


var closePatientSearchClicked = false;

$('.smartview-patient-search-result').on('click', function () {
    closePatientSearchClicked = true;
});

$('#myModal').on('hide.bs.modal', function (e) {
    if (!closePatientSearchClicked) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    closePatientSearchClicked = false;
});
*/


$(function() {
  $( "document" ).on('click','',function(event){
    //if($('.smartview-patient-search-result'))
    alert($('.smartview-patient-search-result'));
  });

});
