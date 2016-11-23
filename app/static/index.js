$(document).ready(function(){
  $("li").click(function() {
  });
  $("#sql").click(function() {
    $("#tab").load('sql');
  });
  $("#add_cluster").click(function() {
    $("#tab").load('add_cluster');
    $("li").removeClass("active");
    $(this).addClass("active");
  });
  $("#show_cluster").click(function() {
    $("#tab").load('show_cluster');
    $("li").removeClass("active");
    $(this).addClass("active");
  });
  $("#show_topo").click(function() {
    $("#tab").load('topo');
    $("li").removeClass("active");
    $(this).addClass("active");
  });
});

