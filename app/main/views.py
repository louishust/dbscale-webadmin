from flask import render_template
from flask_login import login_required
from . import main
from ..models import Cluster

@main.route('/', methods=['GET'])
@login_required
def index():
    return render_template('index.html')


@main.route('/sql', methods=['GET'])
@login_required
def sql():
    clusters = Cluster.query
    return render_template('sql.html', clusters=clusters)

@main.route('/add_cluster', methods=['GET'])
@login_required
def add_cluster():
    return render_template('add_cluster.html')

@main.route('/show_cluster', methods=['GET'])
@login_required
def show_cluster():
    clusters = Cluster.query
    return render_template('show_cluster.html', clusters=clusters)
