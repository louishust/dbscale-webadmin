var editor             = null;

function initEditor() {
  editor = ace.edit("custom_query");
  editor.setFontSize(13);
  editor.setTheme("ace/theme/tomorrow");
  editor.setShowPrintMargin(false);
  editor.getSession().setMode("ace/mode/mysql");
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);
}

function resetTable() {
  $("#results").
    attr("data-mode", "").
    text("").
    removeClass("empty").
    removeClass("no-crop");
}

function escapeHtml(str) {
  if (str != null || str != undefined) {
    return jQuery("<div/>").text(str).html();
  }

  return "<span class='null'>null</span>";
}

function buildTable(results) {
  resetTable();

  if (results.error) {
    $("<tr><td>ERROR: " + results.error + "</tr></tr>").appendTo("#results");
    $("#results").addClass("empty");
    return;
  }

  if (results.rows.length == 0) {
    $("<tr><td>No records found</tr></tr>").appendTo("#results");
    $("#results").addClass("empty");
    return;
  }

  var cols = "";
  var rows = "";

  results.columns.forEach(function(col) {
    cols += "<th data='" + col + "'>" + col + "</th>";
  });

  results.rows.forEach(function(row) {
    var r = "";
    for (i in row) { r += "<td><div>" + escapeHtml(row[i]) + "</div></td>"; }
    rows += "<tr>" + r + "</tr>";
  });

  $("<thead>" + cols + "</thead><tbody>" + rows + "</tobdy>").appendTo("#results");
}

function executeQuery(query, id, cb) {
  apiCall("post", "/query", { query: query, id: id }, cb);
}

function runQuery() {
  $("#run").prop("disabled", true);
  $("#query_progress").show();

  var query = $.trim(editor.getSelectedText() || editor.getValue());
  var cluster_id = $("#cluster_id").val();

  if (query.length == 0) {
    alert("待执行语句为空！");
    $("#run").prop("disabled", false);
    $("#query_progress").hide();
    return;
  }

  if (cluster_id == 0) {
    alert("没有选择数据源!");
    $("#run").prop("disabled", false);
    $("#query_progress").hide();
    return;
  }

  executeQuery(query, cluster_id, function(data) {
    $("#query_progress").show();
    buildTable(data);
    $("#run").prop("disabled", false);
    $("#query_progress").hide();
  });
}

$(document).ready(function() {
  $("#sql").addClass("active");
  initEditor();
  $("#run").on("click", function() {
    runQuery();
  });
});

