function delete_cluster(data, cb) {
  apiCallS("post", "/del_cluster", data, cb);
}

$(document).ready(function(){
  $("[data-toggle=tooltip]").tooltip();
  $("button").click(function() {
    var clusterid = this.id;
    var clustername = this.name;
       BootstrapDialog.show({
        message: "确定要删除集群" + clustername + "?",
        buttons: [{
          icon: 'glyphicon glyphicon-remove',
          label: 'Delete',
          cssClass: 'btn-warning',
          action: function(dialogItself){
            delete_cluster({id: clusterid}, function(data) {
              $("#tab").load('show_cluster');
            });
            dialogItself.close();
          }
        },
        {
          label: 'Close',
          action: function(dialogItself){
            dialogItself.close();
          }
        }]
      });
  });
});

