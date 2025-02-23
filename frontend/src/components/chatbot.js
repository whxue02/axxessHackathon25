import { useState } from "react"
import axios from "axios"
import './chatbot.css'

const Chatbot = () => {
    // initialize variables
    const [messages, setMessages] = useState([{text: "I'm an AI-powered dietitian, designed to provide personalized and accurate nutrition advice to users. My primary goal is to help individuals make informed food choices that cater to their unique nutritional needs and goals. I can offer guidance on meal planning, nutrition strategies, and healthy eating habits. How may I assist you today?", sender: "bot"}])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)

    const handleSendMessage = () => {
        if (input.trim()) {
            // Add user's message to the chat
            setMessages([...messages, { text: input, sender: "user" }]);
            setInput(""); // Clear the input field
            setTyping(true)
        }
        
        axios.post("http://127.0.0.1:5000/api/chatbot", {question: input, context: messages}).
        then((response) => {
            console.log(response)
            setMessages([...messages, { text: input, sender: "user" }, {text: response.data.answer, sender: "bot"}])
            setTyping(false)
        })
        .catch((error) => {
            console.error("there was an error sending data:", error)
            setTyping(false)
        })
    }

    const handleKeyDown = (e) => {
      if (e.keyCode === 13) {
        // Check if Enter key is pressed
        handleSendMessage(); // Trigger send message
      }
    };


    return (
    <div className="chatbot">
      <div className="chat-window">
        {/* Display the messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "user-message" : "bot-message"}
          >
            {message.text}
          </div>
        ))}
        {/* Typing indicator for AI */}
        {typing && (
          <div className="typing-indicator">
            <span>...</span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value) }
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot