from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
import os

# Flask setup
app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Configure SQLite DB
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobgenie.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_type = db.Column(db.String(20), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    company_name = db.Column(db.String(200), nullable=True)

# Create tables (only if not exist)
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('index.html')




@app.route('/admin')
def admin():
    return render_template('admin-dashboard.html')



@app.route('/seeker')
def seeker():
    return render_template('jobseeker-dashboard.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        mode = request.form.get('mode')
        email = request.form.get('email')
        password = request.form.get('password')

        if not all([mode, email, password]):
            flash('Please fill in all fields.', 'error')
            return redirect(url_for('login'))

        user = User.query.filter_by(email=email, user_type=mode).first()

        if user and user.password == password:
            session['user_id'] = user.id
            session['first_name'] = user.first_name
            session['company']=user.company_name
            session['user_type'] = user.user_type
           
            if user.user_type == 'company':
                return redirect(url_for('admin'))
            elif user.user_type == 'jobseeker':
                return redirect(url_for('seeker'))
            else:
                return redirect(url_for('home'))
        else:
            flash('Invalid email, password, or user type.', 'error')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        user_type = request.form.get('userType')
        first_name = request.form.get('firstName')
        last_name = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirmPassword')
        company_name = request.form.get('companyName') if user_type == 'company' else None

        # Validate
        if not all([user_type, first_name, last_name, email, password, confirm_password]):
            flash('Please fill out all required fields.', 'error')
            return redirect(url_for('register'))

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('register'))

        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered. Please use another.', 'error')
            return redirect(url_for('register'))

      
        new_user = User(
            user_type=user_type,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,  
            company_name=company_name
        )
        db.session.add(new_user)
        db.session.commit()

        flash('Registration successful! You can now log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')
if __name__ == '__main__':
    app.run(debug=True)
