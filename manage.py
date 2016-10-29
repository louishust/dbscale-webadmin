#!/usr/bin/env python
import os

from app import create_app, db
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@manager.command
def deploy():
    """Run deployment tasks."""
    from flask_migrate import upgrade
    from app.models import User

    # migrate database to latest revision
    upgrade()

    # add admin user
    user_admin = User(username='admin');
    user_admin.password = 'admin'
    db.session.add(user_admin)

if __name__ == '__main__':
    manager.run()