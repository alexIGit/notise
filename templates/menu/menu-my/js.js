$(document).ready(function() {
  $('.toggle-nav').click(function(e){
    $(this).toggleClass("active");
    $(".menu ul").toggleClass('active');
    $(".hamburger, .cross").toggleClass('open');  
  
    e.preventDefault();



  }); 
 
  /* активный пункт меню */
  // $('.menu a').each(function() {
  //   var location = window.location.href;
  //   var link = this.href;

  //   if( location == link ) {
  //     $(this).addClass('current-item');
  //   }
  // }); 



  // document.getElementById("toggle-nav").onclick = function(){  
  //   this.classList.toggle("open");
  // };
  
     
});   
   