function apiCall(method, path, params, cb) {
  var timeout = 300000; // 5 mins is enough

  $.ajax({
    timeout: timeout,
    url: "api" + path,
    method: method,
    cache: false,
    data: params,
    success: function(data) {
      cb(jQuery.parseJSON(data));
    },
    error: function(xhr, status, data) {
      if (status == "timeout") {
        return cb({ error: "Query timeout after " + (timeout / 1000) + "s" });
      }

      cb(jQuery.parseJSON(xhr.responseText));
    }
  });
}


function apiCallS(method, path, params, cb) {
  var timeout = 300000; // 5 mins is enough

  $.ajax({
    timeout: timeout,
    url: "api" + path,
    method: method,
    cache: false,
    async: false,
    data: params,
    success: function(data) {
      cb(jQuery.parseJSON(data));
    },
    error: function(xhr, status, data) {
      if (status == "timeout") {
        return cb({ error: "Query timeout after " + (timeout / 1000) + "s" });
      }

      cb(jQuery.parseJSON(xhr.responseText));
    }
  });
}
