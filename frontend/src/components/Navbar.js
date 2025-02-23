import "./styles.css"
export default function NavBar() {
 return <nav className="nav">
    <a href="/" className = "site-title">MoodMallow</a>
    <ul>
      
         <a href="/login" class="button">Log in</a>
         <a href="/signup" class="button">Sign Up</a>
      
     
    </ul>
 </nav>   
}