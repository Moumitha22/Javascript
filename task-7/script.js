const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const inputInitHeight = messageInput.scrollHeight;

function getTimeStamp() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(message, type, isTyping = false) {    
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat", type);
    
    if (isTyping) {
        messageDiv.classList.add("typing");
        messageDiv.innerText = message;
    } else {
        messageDiv.innerHTML = `
        <p>${message}</p>
        <div class="timestamp">${getTimeStamp()}</div>
        `;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; 
    return messageDiv;
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === "") return;

    appendMessage(message, "outgoing");
    messageInput.value = "";
    messageInput.style.height = `${inputInitHeight}px`; // Reset height

    // Bot typing
    const typingIndicator = appendMessage("Bot is typing...", "incoming", true);

    setTimeout(() => {
        typingIndicator.remove(); // Remove typing indicator
        const botResponses = [
            "Hey there! How can I help?",
            "That sounds great!",
            "Interesting... tell me more!",
            "I'm here to chat 😊",
            "Can you elaborate?",
            "Nice talking to you!"
        ];
        const botMessage = botResponses[Math.floor(Math.random() * botResponses.length)];
        appendMessage(botMessage, "incoming");
    }, 1200);
}

sendBtn.addEventListener("click", () => sendMessage());

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {  
        event.preventDefault();
        sendMessage();
    }
});

// Adjust textarea height dynamically
messageInput.addEventListener("input", () => {
    sendBtn.style.visibility = messageInput.value.trim() ? "visible" : "hidden";
    messageInput.style.height = `${inputInitHeight}px`; // Reset height before expanding
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 180)}px`; // Expand but limit to 180px
});
