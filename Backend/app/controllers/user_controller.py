from flask import request
from flask_restx import Namespace, Resource, fields, abort
from app.services.user_service import create_user, get_users, get_user_by_id, update_user, delete_user

ns = Namespace("users", description="Gestion des utilisateurs")

user_model = ns.model("User", {
    "id": fields.Integer(readonly=True),
    "nom": fields.String(required=True),
    "prenom": fields.String(required=True),
    "email": fields.String(required=True, description="L'email de l'utilisateur", example="user@example.com"),
    "password": fields.String(required=True, description="Le mot de passe de l'utilisateur", example="motdepasse123"),
    "role": fields.String(required=True, description="Le rôle de l'utilisateur", example="admin")
})

@ns.route("/")
class UserList(Resource):
    @ns.marshal_list_with(user_model)
    def get(self):
        """Récupère la liste des utilisateurs"""
        return get_users()

    @ns.expect(user_model)
    @ns.marshal_with(user_model, code=201)
    def post(self):
        """Crée un nouvel utilisateur"""
        data = request.json
        if not data.get("email"):
            abort(400, "Email requis")
        if not data.get("password"):
            abort(400, "Mot de passe requis")
        return create_user(data["nom"], data["prenom"], data["email"], data["password"], data["role"]), 201

@ns.route("/<int:user_id>")
@ns.param("user_id", "L'identifiant de l'utilisateur")
class UserResource(Resource):
    @ns.marshal_with(user_model)
    def get(self, user_id):
        """Récupère un utilisateur par son identifiant"""
        user = get_user_by_id(user_id)
        if user:
            return user
        abort(404, "Utilisateur non trouvé")

    @ns.expect(user_model)
    @ns.marshal_with(user_model)
    def put(self, user_id):
        """Met à jour les informations d'un utilisateur"""
        user = update_user(user_id, request.json)
        if user:
            return user
        abort(404, "Utilisateur non trouvé")

    def delete(self, user_id):
        """Supprime un utilisateur"""
        if delete_user(user_id):
            return {"message": "Utilisateur supprimé"}, 200
        abort(404, "Utilisateur non trouvé")
