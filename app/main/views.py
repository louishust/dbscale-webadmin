from flask import render_template
from flask_login import login_required
from . import main

@main.route('/', methods=['GET'])
@login_required
def index():
    return render_template('index.html')


@main.route('/sql', methods=['GET'])
@login_required
def sql():
    return render_template('sql.html')

@main.route('/add_cluster', methods=['GET'])
@login_required
def add_cluster():
    return render_template('add_cluster.html')
