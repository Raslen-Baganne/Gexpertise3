from app.models.user import User
from app import db

def create_user(nom, prenom, email, password, role):
    """Création d'un utilisateur avec un mot de passe crypté."""
    user = User(nom=nom, prenom=prenom, email=email, password=password, role=role)
    db.session.add(user)
    db.session.commit()
    return user

def get_users():
    """Récupère tous les utilisateurs."""
    return User.query.all()

def get_user_by_id(user_id):
    """Récupère un utilisateur par son ID."""
    return User.query.get(user_id)

def update_user(user_id, data):
    """Met à jour un utilisateur."""
    user = get_user_by_id(user_id)
    if not user:
        return None
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return user

def delete_user(user_id):
    """Supprime un utilisateur."""
    user = get_user_by_id(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    return False

def authenticate_user(email, password):
    """Authentifie un utilisateur en comparant les mots de passe."""
    user = User.query.filter_by(email=email).first()
    if user and user.decrypt_password(user.password) == password:
        return user
    return None
