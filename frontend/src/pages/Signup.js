import '../Login.css'

export default function Login() {
    return (
        <div class="split-screen">
            <div class="left">
                <img src="login-mascot.png" alt="Login Mascot" width="50%" height="auto"></img>
            </div>
            <div class="login-container">
                <h1>Login</h1>
                <form action ="#" method="POST">
                    <div class="name">
                        <label for="name">Name</label>
                        <input type="name" id="name" name="name" placeholder="Name" required>
                        </input>
                    </div>

                    <div class="input">
                        <label for="username">Username</label>
                        <input type="username" id="username" name="username" placeholder="Username" required>
                        </input>
                    </div>

                    <div class="input">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" required>
                        </input>
                    </div>

                    <button class="submit-button" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}