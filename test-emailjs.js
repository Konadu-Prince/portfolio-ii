// Test EmailJS Integration
// This script tests the EmailJS configuration and sends a test email

const EMAIL_CONFIG = {
    PUBLIC_KEY: "fskHEzXL0R69WMIWx",
    SERVICE_ID: "Yservice_jzajkjf", 
    TEMPLATE_ID: "template_d8a084j",
    TO_EMAIL: "konaduprince26@gmail.com"
};

// Test data
const testData = {
    name: "Portfolio Test User",
    email: "test@portfolio.com",
    service: "web-development",
    subject: "🧪 Test Email from Portfolio Contact Form",
    message: `This is a test message to verify that the EmailJS integration is working correctly.

Test Details:
- Time: ${new Date().toLocaleString()}
- Test Type: EmailJS Integration Test
- Source: Portfolio Contact Form
- Status: Automated Test

If you receive this email, it means the contact form is successfully sending emails to your inbox.

Best regards,
Portfolio Contact Form Test System`,
    timestamp: new Date().toISOString()
};

console.log('🧪 EmailJS Test Configuration:');
console.log('Public Key:', EMAIL_CONFIG.PUBLIC_KEY);
console.log('Service ID:', EMAIL_CONFIG.SERVICE_ID);
console.log('Template ID:', EMAIL_CONFIG.TEMPLATE_ID);
console.log('Recipient:', EMAIL_CONFIG.TO_EMAIL);
console.log('Test Data:', testData);

// This would be used in a browser environment
console.log('\n📧 To test EmailJS integration:');
console.log('1. Open: http://localhost:8080/test-contact-form.html');
console.log('2. Fill out the form (pre-filled with test data)');
console.log('3. Click "Send Test Email"');
console.log('4. Check your email at konaduprince26@gmail.com');
console.log('5. Check browser console for detailed logs');

console.log('\n🔍 Expected Results:');
console.log('- If successful: Email received in inbox');
console.log('- If failed: Detailed error message in console');
console.log('- Check browser developer tools for debugging info');
