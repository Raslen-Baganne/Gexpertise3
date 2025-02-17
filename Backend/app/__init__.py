from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restx import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Crée et configure l'application Flask."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configuration JWT
    app.config["JWT_SECRET_KEY"] = "your-secret-key-change-it"  # Change this in production!
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
    
    # Configuration CORS plus permissive pour le développement
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)

    # Initialisation de l'API avec Swagger
    api = Api(app, title="API Auth", version="1.0", description="API d'authentification")

    # Importation des contrôleurs à partir de l'application
    from app.controllers.user_controller import ns as user_ns
    from app.controllers.auth_controller import auth_ns
    from app.controllers.user_folder_controller import ns as user_folder_ns

    # Ajout des namespaces à l'API
    api.add_namespace(user_ns, path="/api/users")
    api.add_namespace(auth_ns, path="/api/auth")
    api.add_namespace(user_folder_ns, path="/api/user-folder")

    return app