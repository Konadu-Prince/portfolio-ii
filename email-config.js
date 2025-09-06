// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

const EMAIL_CONFIG = {
    // Your EmailJS Public Key (found in EmailJS dashboard)
    PUBLIC_KEY: "YOUR_PUBLIC_KEY_HERE",
    
    // Your EmailJS Service ID (found in EmailJS services)
    SERVICE_ID: "YOUR_SERVICE_ID_HERE",
    
    // Your EmailJS Template ID (found in EmailJS templates)
    TEMPLATE_ID: "YOUR_TEMPLATE_ID_HERE",
    
    // Your email address where messages will be sent
    TO_EMAIL: "konaduprince26@gmail.com"
};

// EmailJS Template Variables
// These should match the variables in your EmailJS template
const TEMPLATE_VARIABLES = {
    from_name: "{{from_name}}",
    from_email: "{{from_email}}",
    subject: "{{subject}}",
    message: "{{message}}",
    to_email: "{{to_email}}"
};

// Instructions for setting up EmailJS:
/*
1. Go to https://www.emailjs.com/ and create a free account
2. Create a new service (Gmail, Outlook, etc.)
3. Create a new email template with these variables:
   - {{from_name}} - Sender's name
   - {{from_email}} - Sender's email
   - {{subject}} - Email subject
   - {{message}} - Email message
   - {{to_email}} - Your email address
4. Get your Public Key from the Account section
5. Get your Service ID from the Services section
6. Get your Template ID from the Templates section
7. Replace the values in this file with your actual credentials
8. Update the email-config.js file in your project
*/

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAIL_CONFIG, TEMPLATE_VARIABLES };
}
