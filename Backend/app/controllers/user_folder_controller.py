import os
import logging
from flask import jsonify, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.user import User

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Création du namespace
ns = Namespace('user-folder', description='Gestion des dossiers utilisateurs')

# Modèles de réponse pour la documentation Swagger
folder_response = ns.model('FolderResponse', {
    'folderExists': fields.Boolean(description="Indique si le dossier existe"),
    'folderName': fields.String(description="Nom du dossier de l'utilisateur"),
    'message': fields.String(description="Message de succès ou d'erreur")
})

@ns.route('')
class UserFolder(Resource):
    @jwt_required()
    @ns.response(200, 'Succès', folder_response)
    @ns.response(400, 'Erreur de requête')
    @ns.response(500, 'Erreur serveur')
    def get(self):
        """Vérifie l'existence du dossier de l'utilisateur"""
        try:
            # Récupération de l'identité de l'utilisateur
            user_id = get_jwt_identity()
            claims = get_jwt()
            email = claims.get('email')
            
            if not email:
                user = User.query.get(user_id)
                if not user:
                    return {
                        'error': 'Utilisateur non trouvé'
                    }, 404
                email = user.email

            logger.info(f"Checking folder for user: {email}")
            
            # Prendre la partie avant @ et remplacer les points par des underscores
            folder_name = email.split('@')[0].replace('.', '_')
            
            # Vérification du dossier Ressources
            base_resource_path = os.path.join(current_app.root_path, '..', 'Ressources')
            if not os.path.exists(base_resource_path):
                logger.info(f"Creating base resource directory: {base_resource_path}")
                os.makedirs(base_resource_path)
            
            # Vérification du dossier utilisateur
            resource_path = os.path.join(base_resource_path, folder_name)
            folder_exists = os.path.exists(resource_path)
            
            logger.info(f"Folder check result for {email}: exists={folder_exists}, path={resource_path}")
            return {
                'folderExists': folder_exists,
                'folderName': folder_name,
                'message': 'Dossier trouvé' if folder_exists else 'Dossier non trouvé'
            }
        except Exception as e:
            logger.error(f"Error in check_user_folder: {str(e)}")
            return {
                'error': f'Erreur lors de la vérification du dossier: {str(e)}'
            }, 500

    @jwt_required()
    @ns.response(201, 'Dossier créé', folder_response)
    @ns.response(200, 'Dossier existant', folder_response)
    @ns.response(400, 'Erreur de requête')
    @ns.response(500, 'Erreur serveur')
    def post(self):
        """Crée un nouveau dossier pour l'utilisateur"""
        try:
            # Récupération de l'identité de l'utilisateur
            user_id = get_jwt_identity()
            claims = get_jwt()
            email = claims.get('email')
            
            if not email:
                user = User.query.get(user_id)
                if not user:
                    return {
                        'error': 'Utilisateur non trouvé'
                    }, 404
                email = user.email

            logger.info(f"Creating folder for user: {email}")
            
            # Prendre la partie avant @ et remplacer les points par des underscores
            folder_name = email.split('@')[0].replace('.', '_')
            
            # Création du dossier Ressources s'il n'existe pas
            base_resource_path = os.path.join(current_app.root_path, '..', 'Ressources')
            if not os.path.exists(base_resource_path):
                logger.info(f"Creating base resource directory: {base_resource_path}")
                os.makedirs(base_resource_path)
            
            # Création du dossier utilisateur
            resource_path = os.path.join(base_resource_path, folder_name)
            
            if not os.path.exists(resource_path):
                logger.info(f"Creating user folder: {resource_path}")
                os.makedirs(resource_path)
                return {
                    'folderExists': True,
                    'folderName': folder_name,
                    'message': 'Dossier créé avec succès'
                }, 201
            else:
                logger.info(f"Folder already exists: {resource_path}")
                return {
                    'folderExists': True,
                    'folderName': folder_name,
                    'message': 'Le dossier existe déjà'
                }, 200
                
        except Exception as e:
            logger.error(f"Error in create_user_folder: {str(e)}")
            return {
                'error': f'Erreur lors de la création du dossier: {str(e)}'
            }, 500
