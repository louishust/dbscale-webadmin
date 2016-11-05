from flask import render_template, jsonify, request, abort
from flask_login import login_required
from . import api
from ..models import Cluster
from .. import db

@api.route('/add_cluster', methods=['POST'])
def add_cluster():
    print(request.method)
    cluster = Cluster()
    cluster.name = request.form['name']
    cluster.ip = request.form['ip']
    cluster.port = request.form['port']
    cluster.username = request.form['username']
    cluster.password = request.form['password']

    db.session.add(cluster)
    return jsonify({'ret': 0}), 201


@api.route('/test', methods=['GET'])
def test():
    return 'Hello, World!'