import os
from flask import Flask
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_login import LoginManager
from flask_cors import CORS

from bson.objectid import ObjectId  # Import ObjectId

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
import chatbot
import analyze
import re

# create the app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# get MongoDB URI from .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set")

# create a new client and connect to the server
client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
# users is database name
db = client["axxess"]

# send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# log button clicks
@app.route("/addButtonClick", methods=["POST"])
def addButtonClick():
    try:
        email = request.json.get("email")
        buttonType = request.json.get("buttonType")
        utc_5 = timezone(timedelta(hours=-5))
        time = datetime.now(utc_5).isoformat() 

        if not email or not buttonType:
            return jsonify({"error": "missing email or button type"})
        
        
        # insert into database based on button type
        if buttonType == "positive":
            new = db["users"].update_one({"email": email}, {"$push": {"positive": {"time": time}}})
        if buttonType == "negative":
            new = db["users"].update_one({"email": email}, {"$push": {"negative": {"time": time}}})


        if new.matched_count == 0:
                return jsonify({"error": "User not found"}), 404

        updated_user = db["users"].find_one({"email": email}, {"_id": 0}) 
        return jsonify(updated_user)
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
# get user information for healthcare provider use
@app.route("/allUsers", methods=["GET"])
def getAllUser():
    try:
        # user = db["users"].find_one({"email": current_user.email}, {"_id": 0, "password": 0})
        # if user["role"] == "administrator":
        users = list(db["users"].find({"role":"patient"},{"_id": 0, "password": 0}))
        return jsonify(users)
        # else:
            # return jsonify({"message": "you do not have access"})
    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

#create login stuff
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
SECRET_KEY = os.getenv("SECRET_KEY")
app.secret_key = SECRET_KEY

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data["_id"]) 
        self.email = user_data["email"]

@login_manager.user_loader
def load_user(user_id):
    user_data = db["users"].find_one({"_id": ObjectId(user_id)})
    return User(user_data) if user_data else None

# register a new user
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        # check if user already exists
        if db.users.find_one({"email": email}):
            return jsonify({"error": "User already exists"}), 400

        # insert user into DB
        user_id = db.users.insert_one({"email": email, "password": password, "role": "patient", "positive": [], "negative":[]}).inserted_id

        return jsonify({"message": "user registered successfully", "user_id": str(user_id)}), 201

    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # find user by email
        user_data = db.users.find_one({"email": email})
        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # verify password
        if not (user_data["password"] == password):
            return jsonify({"error": "Invalid credentials"}), 401

        # create user object & log in
        user = User(user_data)
        login_user(user)

        return jsonify({"message": "Login successful", "user_id": user.id}), 200

    except Exception as e:
        return jsonify({"error": f"Error: {str(e)}"}), 500
    
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

# return the current logged in user's informatio
@app.route("/currentUser", methods=["GET"])
@login_required
def get_current_user():
    if current_user:
        user = db["users"].find_one({"email": current_user.email}, {"_id": 0, "password": 0}) 
        print(user)
        return jsonify(user)
    else:
        return jsonify({"message": "not logged in"})

# chatbot
@app.route('/chatbot', methods=['POST'])
def submit_question():
    # get data from frontend
    question = request.json.get('question')
    context = request.json.get('context')

    answer = chatbot.getAnswer(question, context)

    # send data back as a response
    return jsonify({"answer": answer})

@app.route('/analyze',methods=["GET"]) 
def analyzeResults():
    user = db["users"].find_one({"email": current_user.email})
    # get the times
    positive = user["positive"]
    negative = user["negative"]
    # convert into list
    pos_time = [item['time'] for item in positive]
    neg_time = [item['time'] for item in negative]

    # get analysis
    answer = analyze.getAnswer(pos_time, neg_time)
    
    # format analysis to be used in frontend
    answer = answer.replace("\n", "<br />")
    answer = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', answer)

    return jsonify(answer)

if __name__ == '__main__':
    app.run(debug=True)