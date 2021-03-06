from flask_login import UserMixin
from . import db, login_manager
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class Cluster(db.Model):
    __tablename__ = 'clusters'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True, doc="Cluster name")
    ip = db.Column(db.String(64))
    port = db.Column(db.Integer)
    username = db.Column(db.String(64))
    password = db.Column(db.String(64))
    comment = db.Column(db.String(64))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
