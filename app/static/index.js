$(document).ready(function(){
  $("li").click(function() {
    $("li").removeClass("active");
    $(this).addClass("active");
  });
  $("#sql").click(function() {
    window.location.href="sql";
  });
  $("#add_cluster").click(function() {
    window.location.href="add_cluster";
  });
  $("#show_cluster").click(function() {
    window.location.href="show_cluster";
  });
  $("#show_topo").click(function() {
    window.location.href="topo";
  });
});

