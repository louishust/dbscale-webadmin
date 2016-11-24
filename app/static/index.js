function resetActive() {
    $("ul").removeClass("active");
    $("li").removeClass("active");
}

$(document).ready(function(){
  $("#sql").click(function() {
    resetActive();
    $(this).addClass("active");
    $("#tab").load('sql');
  });
  $("#add_cluster").click(function() {
    resetActive();
    $(this).addClass("active");
    $("#tab").load('add_cluster');
  });
  $("#show_cluster").click(function() {
    resetActive();
    $(this).addClass("active");
    $("#tab").load('show_cluster');
  });
  $("#show_topo").click(function() {
    resetActive();
    $(this).addClass("active");
    $("#tab").load('topo');
  });

  $("#manager").click(function() {
    resetActive();
    $(this).addClass("active");
  });

  $("#monitor").click(function() {
    resetActive();
    $(this).addClass("active");
  });
});

