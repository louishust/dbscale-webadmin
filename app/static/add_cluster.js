function add_cluster(data, cb) {
  apiCall("post", "/add_cluster", data, cb);
}

$(document).ready(function(){
  $('#add_success').hide();
  $('#submit').on("click", function() {
    var f = $('form')[0];
    if(f.checkValidity()) {
      add_cluster($('form').serialize() , function(data) {
        var message = "添加成功!";
        if (data.error) {
          message = data.error;
        }
        BootstrapDialog.alert({
          message: message
        });
      });
    } else {
      BootstrapDialog.alert(
        '字段不能为空！'
      );
    }
  });
});
