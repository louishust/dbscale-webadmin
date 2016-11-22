from flask import render_template, request, abort, json
from flask_login import login_required
from . import api
from ..models import Cluster
from .. import db
import MySQLdb

@api.route('/add_cluster', methods=['POST'])
def add_cluster():
    cluster = Cluster()
    cluster.name = request.form['name']
    cluster.ip = request.form['ip']
    cluster.port = request.form['port']
    cluster.username = request.form['username']
    cluster.password = request.form['password']

    db.session.add(cluster)
    return json.dumps({'status':'OK'})

@api.route('/query', methods=['POST'])
def query():
    query = request.form['query']
    cid = request.form['id']
    cluster = Cluster.query.filter_by(id=cid).first()
    try:
        conn = MySQLdb.connect(user=cluster.username, passwd=cluster.password, host=cluster.ip, port=cluster.port, charset='utf8', connect_timeout=1)
        cur = conn.cursor()
        cur.execute(query)
        columns = cur.description
        rows = cur.fetchall()
        cur.close()
        conn.close()
    except Exception as e:
        print str(e)
        return json.dumps({'error':str(e)})

    listcols = []
    for col in columns:
        listcols.append(col[0])

    return json.dumps({'status':'OK', 'columns':listcols, 'rows':list(rows)})

@api.route('/get_dbscale', methods=['POST'])
def get_dbscale():
    cid = request.form['id']
    cluster = Cluster.query.filter_by(id=cid).first()
    ret = {'name': cluster.name, 'ip': cluster.ip, 'port': cluster.port}
    return json.dumps({'dbscale': ret})
