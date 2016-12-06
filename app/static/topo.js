var options = {
  autoResize: false,
  height: '100%',
  width: '100%',
  locale: 'en',
  edges: {
    arrows: 'to',
  },
  layout: {
    hierarchical: {
      enabled: true,
      sortMethod: 'directed',
    }
  },
  groups: {
    rdsnode: {
      shape: 'dot',
      color: 'cyan'
    },
    sdsnode: {
      shape: 'dot',
      color: 'cyan'
    },
    rwdsnode: {
      shape: 'dot',
      color: 'cyan'
    },
    nodeok: {
      shape: "image",
      image: "static/png/136.png"
    },
    nodeerr: {
      shape: "image",
      image: "static/png/134.png"
    },
  },
};

var mnodes = new Array();
var medges = new Array();
var reps = new Array();
var srv_sources = new Array();
var servernamedict = {};
var dsnamedict = {};
var network = null;
var serveriddict = {};
var dbscale_ok = 1;

function executeQuery(query, id, cb) {
  apiCallS("post", "/query", { query: query, id: id }, cb);
}

function getDBScale(id) {
  var dbscale;
  apiCallS("post", "/get_dbscale", { id: id }, function(data) {
    dbscale =  data.dbscale;
  });

  return "DBScale\n" + dbscale.ip + ":" + dbscale.port;
}


function get_servers(id) {
  var query = 'DBSCALE SHOW DATASERVERS;';
  executeQuery(query, id, function(results) {
    if (results.error) {
      dbscale_ok = 0;
      return;
    }
    results.rows.forEach(function(row) {
      var server = {};
      server.name=row[0];
      server.host=row[1];
      server.port=row[2];
      server.status=row[5];
      servernamedict[row[0]] = server;
    });
  });
}


function get_rep_datasource(id) {
  var first = 1;
  var query = "DBSCALE SHOW DATASOURCE TYPE = replication;";
  var i = -1;
  var last_name = "";
  executeQuery(query, id, function(results) {
    if (results.error) {
      dbscale_ok = 0;
      return;
    }
    results.rows.forEach(function(row) {
      if (row[0] != last_name) {
        var rep = {name:"", master:""};
        rep.name = row[0];
        rep.master = row[6];
        rep.slaves = new Array();
        rep.slave_sources = new Array();
        reps.push(rep);
        i++;
        last_name=rep.name;
        if (row[10] != '') {
          reps[i].slaves.push(row[10]);
        } else {
          reps[i].slave_sources.push(row[8]);
        }
      } else {
        if (row[10] != '') {
          reps[i].slaves.push(row[10]);
        } else {
          reps[i].slave_sources.push(row[8]);
        }
      }
    });
  });
}

function get_server_datasource(id) {
  var first = 1;
  var query = "DBSCALE SHOW DATASOURCE TYPE = server;";
  executeQuery(query, id, function(results) {
    if (results.error) {
      dbscale_ok = 0;
      return;
    }
    results.rows.forEach(function(row) {
      if (row[5] == 'NO') {
        var server = {name:"", sname:"", status:""};
        server.name = row[0];
        server.sname = row[2];
        server.status = row[3];
        srv_sources.push(server);
      }
    });
  });
}

function show_topo() {
  var dbscale = {};
  var id = 1;
  var cluster_id = $("#cluster_id").val();

  get_servers(cluster_id);
  get_server_datasource(cluster_id);
  get_rep_datasource(cluster_id);

  dbscale.id = id;
  dbscale.label = getDBScale(cluster_id);
  if (dbscale_ok == 0) {
    dbscale.group = 'nodeerr';
  } else {
    dbscale.group = 'nodeok';
  }
  mnodes.push(dbscale);
  var server = {'name' : 'dbscale'};
  serveriddict[id] = server;


  /** add server data source */
  srv_sources.forEach(function(srv) {
    var edge1 = {};
    var edge2 = {};
    var ds_node = {};
    var srv_node = {};
    var server = {'name' : srv.name};
    var server1 = {};
    /** add datasource node */
    ds_node.id = ++id;
    ds_node.label = srv.name;
    ds_node.group = 'sdsnode';
    mnodes.push(ds_node);
    dsnamedict[srv.name] = ds_node.id;
    serveriddict[id] = server;

    /* add edge from dbscale to datasource node */
    edge1.from = dbscale.id;
    edge1.to = ds_node.id;
    edge1.dashes= true;
    medges.push(edge1);

    /* add server node */
    srv_node.id = ++id;
    srv_node.label = srv.sname;
    server1.name=srv.sname;
    serveriddict[id] = server1;
    if (srv.status == 'Server normal') {
      srv_node.group = 'nodeok';
    } else {
      srv_node.group = 'nodeerr';
    }
    mnodes.push(srv_node);

    /* add edge from datasource to server node */
    edge2.from = ds_node.id;
    edge2.to = srv_node.id;
    edge2.dashes= false;
    medges.push(edge2);
  });

  reps.forEach(function(rep) {
    var edge1 = {};
    var edge2 = {};
    var master = {};
    var ds_node = {};
    var server = {'name' : rep.name};
    var server1 = {};
    /** add datasource node */
    ds_node.id = ++id;
    ds_node.label = rep.name;
    ds_node.group = 'rdsnode';
    mnodes.push(ds_node);
    dsnamedict[rep.name] = ds_node.id;
    serveriddict[id] = server;

    /* add edge from dbscale to datasource node */
    edge1.from = dbscale.id;
    edge1.to = ds_node.id;
    edge1.dashes= true;
    medges.push(edge1);

    /* add master node */
    master.id = ++id;
    master.label = rep.master + "\n" + servernamedict[rep.master].host
                    + ":" + servernamedict[rep.master].port;
    master.group = 'nodeok';
    mnodes.push(master);
    serveriddict[id] = servernamedict[rep.master];
    dsnamedict[rep.master] = master.id;

    /* add edge from dsnode to master */
    edge2.from = ds_node.id;
    edge2.to = master.id;
    edge2.dashes= true;
    medges.push(edge2);

    /* add slave node */
    rep.slaves.forEach(function(slave) {
      var edge = {};
      var node = {};
      node.id = ++id;
      node.label = slave + "\n" + servernamedict[slave].host + ":" + servernamedict[slave].port;
      node.group = 'nodeok';
      serveriddict[id] = servernamedict[slave];
      mnodes.push(node);
      edge.from = master.id;
      edge.to = node.id;
      medges.push(edge);
    });
  });

  /* add edge from rep dsnode to slave source node */
  reps.forEach(function(rep) {
    rep.slave_sources.forEach(function(slave) {
      var ds_id = dsnamedict[rep.master];
      var slave_id = dsnamedict[slave];
      var edge = {};

      edge.from = ds_id;
      edge.to = slave_id;
      medges.push(edge);
    });
  });


  var vnodes = new vis.DataSet(mnodes);
  var vedges = new vis.DataSet(medges);
  var data = {nodes: vnodes,edges: vedges};
  var container = document.getElementById('mynetwork');
  network = new vis.Network(container, data, options);

  network.on("selectNode", function (params) {
    if (params.nodes[0] == 1) {
      var id = $("#cluster_id").val();
      BootstrapDialog.show({
        message: $('<div class="table-responsive"></div>').load('dbscale_info', {id: id})
      });
    } else {
      var server = serveriddict[params.nodes[0]];
       BootstrapDialog.show({
        message: server.name
      });
    }
    network.unselectAll();
  });
}


$(document).ready(function() {
  $('.selectpicker').selectpicker({});
  $("#cluster_id").on("change", function() {
    if (network != null) {
      network.destroy();
      network = null;
      mnodes = new Array();
      medges = new Array();
      reps = new Array();
      srv_sources = new Array();
      servernamedict = {};
      serveriddict = {};
      dbscale_ok =1;
    }

    var cluster_id = $("#cluster_id").val();
    if (cluster_id != "") {
      show_topo();
    }
  });
});

