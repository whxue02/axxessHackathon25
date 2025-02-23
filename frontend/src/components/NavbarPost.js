import "./styles.css"
export default function NavbarPost() {
 return <nav className="nav">
    <a href="/" className = "site-title">MoodMallow</a>
    <ul>
      
         <a href="/history" class="button">History</a>    
         {/*<a href="/administrator" class="button">Admin</a>    */}
         
    </ul>
 </nav>   
}