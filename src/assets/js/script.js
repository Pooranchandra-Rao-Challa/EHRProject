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
// $(".bx-menu").click(function(){
//   $(".sidebar").toggleClass("close");
// });
