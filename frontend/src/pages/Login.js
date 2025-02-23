import '../Login.css'
import { useState } from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

export default function Login() {
    const [userInfo,setUserInfo] = useState({email:"", password:""})
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value} = e.target;
            setUserInfo({ ...userInfo, [name]: value });

    }

    const handleSubmit = async (e) => {
        console.log(userInfo)
        try {
            e.preventDefault();
            const response = await axios.post('http://127.0.0.1:5000/login', {email: userInfo.email, password: userInfo.password});
            console.log("Result:", response.data);
            console.log(response.data.message)
            if (response.data.message == "Login successful") { 
                navigate('/mood'); 
            } else {
                alert("Login failed: " + response.data.message);
            }

        } catch (error) {
            alert("login failed", error);
        }
    }

    return (
        <div class="split-screen">
            <div class="left">
                <img src="login-mascot.png" alt="Login Mascot" width="50%" height="auto"></img>
            </div>
            <div class="login-container">
                <h1>Login</h1>
                <form action ="#" method="POST">
                    <div class="input">
                        <label for="username">Email</label>
                        <input type="username" id="email" name="email" placeholder="Email" required onChange={(e) => handleChange(e)}>
                        </input>
                    </div>

                    <div class="input">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" required onChange={(e) => handleChange(e)}>
                        </input>
                    </div>

                    <button class="submit-button" type="submit" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </div>
    )
}