"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS 
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager, create_access_token
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'admin123'
app.config['JWT_SECRET_KEY'] = 'admin123'

cors = CORS(app)

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
jwt = JWTManager(app)

setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Obtiene los datos del user y token de un usuario existente
@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Faltan datos (email o contraseña)"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Faltan datos (email o contraseña)"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.password == password: 
        if user.is_active:
            access_token = create_access_token(identity=user.id)
            return jsonify(token=access_token, user=user.serialize()), 200
        else:
            return jsonify({"msg": "Usuario no activo"}), 400
    else:
        return jsonify({"msg": "El correo o contraseña es incorrecto"}), 401

from flask_jwt_extended import create_access_token

# Registra un nuevo usuario
@app.route('/api/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({"msg": "Faltan datos (email o contraseña)"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Faltan datos (email o contraseña)"}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"msg": "El correo eléctronico ya está en uso"}), 409

    try:
        new_user = User(email=email, password=password, is_active=True) 
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=new_user.id)

        return jsonify({
            "msg": "Usuario registrado",
            "user": new_user.serialize(),
            "token": access_token 
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar al usuario", "error": str(e)}), 500

    
# Obtiene todos los usuarios
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({"msg": "Erro al obtener usuarios", "error": str(e)}), 500

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
