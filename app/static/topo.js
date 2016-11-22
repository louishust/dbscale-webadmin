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
var servers = new Array();
var reps = new Array();
var servernamedict = {};
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
      servers.push(server);
      servernamedict[row[0]] = server;
    });
  });
}

function get_rep_datasource(id) {
  var rep = {name:"", master:""};
  var first = 1;
  var query = "DBSCALE SHOW DATASOURCE TYPE = replication;";
  executeQuery(query, id, function(results) {
    if (results.error) {
      dbscale_ok = 0;
      return;
    }
    results.rows.forEach(function(row) {
        if (row[0] != ' ') {
          if (first == 0) {
            reps.push(rep);
          }
          rep.slaves = new Array();
          rep.name = row[0];
          rep.master = row[4];
          rep.slaves.push(row[7]);
        } else {
          first = 0;
          rep.slaves.push(row[7]);
        }
    });
    reps.push(rep);
  });
}

function show_topo() {
  var dbscale = {};
  var id = 1;
  var cluster_id = $("#cluster_id").val();

  get_servers(cluster_id);
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

  reps.forEach(function(rep) {
    var edge = {};
    var master = {};
    /* add master */
    master.id = ++id;
    master.label = rep.master + "\n" + servernamedict[rep.master].host
                    + ":" + servernamedict[rep.master].port;
    master.group = 'nodeok';
    mnodes.push(master);
    serveriddict[id] = servernamedict[rep.master];
    edge.from = dbscale.id;
    edge.to = master.id;
    medges.push(edge);
    /* add slaves */
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
  $("#cluster_id").on("change", function() {
    if (network != null) {
      network.destroy();
      network = null;
      mnodes = new Array();
      medges = new Array();
      servers = new Array();
      reps = new Array();
      servernamedict = {};
      serveriddict = {};
    }

    var cluster_id = $("#cluster_id").val();
    if (cluster_id != "") {
      show_topo();
    }
  });
});

