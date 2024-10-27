document.getElementById('toggle-chat').addEventListener('click', function () {
    const chatbox = document.getElementById('chatbox')
    chatbox.style.display = chatbox.style.display === 'none' || chatbox.style.display === '' ? 'block' : 'none'
})

document.getElementById('close-chat').addEventListener('click', function () {
    const popup = document.querySelector('.clear-popup');
    popup.style.display = 'block';
});

document.querySelector('.cancel-btn').addEventListener('click', function () {
    const popup = document.querySelector('.clear-popup');
    popup.style.display = 'none';
});

document.querySelector('.clear-btn').addEventListener('click', function () {
    clearChatMessages();
    const popup = document.querySelector('.clear-popup');
    popup.style.display = 'none';
});

function clearChatMessages() {
    const messages = document.getElementById('messages');
    Array.from(messages.children).forEach(child => {
        if (!child.classList.contains('message-container') && !child.classList.contains('message-initial-input')) {
            messages.removeChild(child);
        }
    });
}

document.getElementById('minimize-chat').addEventListener('click', function () {
    document.getElementById('chatbox').style.display = 'none'
})

document.getElementById('send-button').addEventListener('click', function () {
    sendMessage()
})

document.getElementById('message-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage()
    }
})

function addMessage(message, type) {
    const messageContainer = document.getElementById('messages')
    const messageDiv = document.createElement('div')
    messageDiv.className = `message ${type}`
    messageDiv.innerHTML = message
    messageContainer.appendChild(messageDiv)
    messageContainer.scrollTop = messageContainer.scrollHeight
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();

    if (messageText) {
        addMessage(messageText, 'sender');
        input.value = '';

        showLoader();

        const processedMessage = getChatbotResponse(messageText);

        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: processedMessage, input: messageText })
        })
            .then(response => response.json())
            .then(data => {
                if (data.response) {
                    addMessage(data.response, 'receiver');
                } else {
                    addMessage('Error: No response from server', 'receiver');
                }
                hideLoader();
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Error: Unable to send message', 'receiver');
                hideLoader();
            });
    }
}

function printInputMessage(message) {
    console.log("Input Message:", message);
}

function sendInputMessage() {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();

    if (messageText) {
        const processedMessage = processInput(messageText);
        printInputMessage(processedMessage);
        input.value = '';

        showLoader();

        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: processedMessage, input: messageText })
        })
            .then(response => response.json())
            .then(data => {
                if (data.response) {
                    addMessage(data.response, 'receiver');
                } else {
                    addMessage('Error: No response from server', 'receiver');
                }
                hideLoader();
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('Error: Unable to send message', 'receiver');
                hideLoader();
            });
    }
}

function processInput(input) {
    return input.trim().toLowerCase();
}

document.getElementById('send-button').addEventListener('click', sendInputMessage);

document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    messageInput.addEventListener('input', function () {
        this.value = processInput(this.value);
    });

    sendButton.addEventListener('click', function () {
        if (messageInput.value) {
            messageInput.value = processInput(messageInput.value);
        }
    });
});

function getChatbotResponse(query) {
    let response = ''

    switch (query.toLowerCase()) {
        case 'financing':
        case 'finance':
        case 'financial':
            response = `<div class="message-daq">
                        <strong>Description:</strong>
                        <p>At Baumalight, we offer a variety of flexible financing plans tailored to fit your budget and equipment needs.</p>
                      </div>
                      <div class="message-daq">
                        <strong>Links:</strong>
                        <ul>
                          <li><a href="#">Explore our Financing Options <img src="./static/images/external.png" alt="" class="link-icon-sm" /></a></li>
                          <li><a href="#">Financing FAQ <img src="./static/images/external.png" alt="" class="link-icon-sm" /></a></li>
                          <li><a href="#">Speak to a Financing Expert <img src="./static/images/external.png" alt="" class="link-icon-sm" /></a></li>
                        </ul>
                      </div>
                      <div class="message-daq">
                        <strong>Questions:</strong>
                        <button class="clickable-question statement-container1" data-question="Would you like to know more about specific financing terms?">Would you like to know more about specific financing terms?</button>
                        <button class="clickable-question statement-container1" data-question="Are you interested in financing for a specific piece of equipment?">Are you interested in financing for a specific piece of equipment?</button>
                        <button class="clickable-question statement-container1" data-question="Would you prefer leasing or purchasing with financing options?">Would you prefer leasing or purchasing with financing options?</button>
                        <div class="feedback-icons">
                          <i class="fa-regular fa-thumbs-up thumb-icon" id="thumbs-up"></i>
                          <i class="fa-regular fa-thumbs-down thumb-icon" id="thumbs-down"></i>
                        </div>
                      </div>`
            break;

        default:
            response = `<div class="message-daq">
                                                <strong>Description:</strong>
                                                  <p>Sorry, I don't have information on that topic yet. Please try another query!</p>
                                                     <div class="feedback-icons">
                                                        <i class="fa-regular fa-thumbs-up thumb-icon" id="thumbs-up"></i>
                                            <i class="fa-regular fa-thumbs-down thumb-icon id="thumbs-down"></i>
                                                     </div>
                                                 </div>`
    }

    return response
}

document.addEventListener('DOMContentLoaded', function () {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.querySelector('.chatbox-messages');

    function sendMessage(text) {
        messageInput.value = text;

        const inputEvent = new Event('input', { bubbles: true });
        messageInput.dispatchEvent(inputEvent);

        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        sendButton.dispatchEvent(clickEvent);
    }

    function activateQuestionListeners() {
        chatContainer.addEventListener('click', function (e) {
            const clickedQuestion = e.target.closest('.clickable-question');
            if (clickedQuestion) {
                const questionText = clickedQuestion.dataset.question || clickedQuestion.textContent;
                sendMessage(questionText.trim());
            }
        });
    }

    activateQuestionListeners();
});

document.addEventListener('DOMContentLoaded', function () {
    const chatbox = document.getElementById('messages')

    chatbox.addEventListener('click', function (event) {
        if (event.target.classList.contains('thumb-icon')) {
            const iconType = event.target.id
            let feedbackMessage = document.createElement('div')
            feedbackMessage.classList.add('message-daqr')

            const thumbsUp = document.getElementById('thumbs-up')
            const thumbsDown = document.getElementById('thumbs-down')

            if (iconType === 'thumbs-up') {
                feedbackMessage.innerHTML = 'Thank you for your feedback!'
                thumbsDown.style.pointerEvents = 'none'
                thumbsUp.style.pointerEvents = 'none'
            } else if (iconType === 'thumbs-down') {
                feedbackMessage.innerHTML = 'Sorry to hear that! We value your feedback.'
                thumbsUp.style.pointerEvents = 'none'
                thumbsDown.style.pointerEvents = 'none'
            }

            chatbox.appendChild(feedbackMessage)

            chatbox.scrollTop = chatbox.scrollHeight

            event.target.style.opacity = 0.5
        }
    })
})

function showLoader() {
    const loader = document.getElementById('message-loader')
    loader.style.display = 'block'
}

function hideLoader() {
    const loader = document.getElementById('message-loader')
    loader.style.display = 'none'
}

document.addEventListener('DOMContentLoaded', function () {
    const initialMessages = document.querySelectorAll('.message-initial')
    const chatbox = document.getElementById('chatbox')

    initialMessages.forEach((message) => {
        message.addEventListener('click', function () {
            const url = this.getAttribute('data-url')
            if (url) {
                window.location.href = url
                chatbox.style.display = 'none'
            }
        })
    })
})

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('chatbox').addEventListener('click', function (event) {
        if (event.target.classList.contains('thumb-icon')) {
            const iconType = event.target.id
            if (iconType === 'thumbs-up') {
            } else if (iconType === 'thumbs-down') {
            }
            event.target.style.opacity = 0.5
        }
    })
})

