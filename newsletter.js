document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('#newsletter .form');
    const emailInput = newsletterForm.querySelector('input');
    const signupButton = newsletterForm.querySelector('button');
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.style.marginTop = '10px';
    newsletterForm.appendChild(messageContainer);

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    signupButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        messageContainer.textContent = '';
        messageContainer.style.color = '';

        if (!email) {
            messageContainer.textContent = 'Enter an email address';
            messageContainer.style.color = 'red';
            return;
        }

        if (!validateEmail(email)) {
            messageContainer.textContent = 'Enter a valid email';
            messageContainer.style.color = 'red';
            return;
        }

        // Successful signup
        messageContainer.textContent = 'Thanks for subscribing!';
        messageContainer.style.color = 'green';
        emailInput.value = '';

        // Add your backend submission logic here
        console.log('Subscribed email:', email);
    });
});