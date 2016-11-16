function add_cluster(data, cb) {
  apiCall("post", "/add_cluster", data, cb);
}

$(document).ready(function(){
  $('#add_success').hide();
  $("#coll1").addClass("active");
  $('#submit').on("click", function() {
    add_cluster($('form').serialize() , function(data) {
      console.log(data.status);
      $('#add_success').show();
    });
  });
});
