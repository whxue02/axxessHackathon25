from flask import Flask, jsonify, request, current_app, g
from flask_login import LoginManager
from flask_pymongo import PyMongo
from flask_cors import CORS

from bson.objectid import ObjectId  # Import ObjectId

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS

# create the app
app = Flask(__name__)
CORS(app, supports_credentials=True)