import '../Mood.css'
import Chatbot from '../components/chatbot'

export default function Mood() {
    return (
        <div>
            <div class="container">
            <div class="box">
                <h1>How do you feel?</h1>
                <div class="btn-group">
                    <button class="image-button">
                        <img src="good-mascot.png" alt="good"></img>
                    </button>

                    <button class="image-button">
                        <img src="bad-mascot.png" alt="bad"></img>
                    </button>
                </div>
            </div>
            <Chatbot/>
            </div>

        </div>
        
    )
}