from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length

class LoginForm(FlaskForm):
    username = StringField('UserName', validators=[Required(message='user re'), Length(1, 64, message='user leng')])
    password = PasswordField('Password', validators=[Required(message='pw re')])
    remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Log In')
