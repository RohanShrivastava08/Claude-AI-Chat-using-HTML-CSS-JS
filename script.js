document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            await generateAIResponse(userMessage);
            userInput.value = '';
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function generateAIResponse(userMessage) {
        const apiUrl = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
        
        // You should replace this with your actual Hugging Face API token
        const apiKey = 'YOUR_API_KEY';

        try {
            addMessage('claude', "Thinking...");

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: userMessage })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const aiResponse = data[0].generated_text;

            // Remove the "Thinking..." message
            chatMessages.removeChild(chatMessages.lastChild);

            addMessage('claude', aiResponse);
        } catch (error) {
            console.error('Error:', error);
            
            // Remove the "Thinking..." message
            chatMessages.removeChild(chatMessages.lastChild);

            addMessage('claude', "I'm sorry, I couldn't process your request at this time.");
        }
    }
});