# Email Messaging System Setup

This guide will help you set up the email messaging system for your portfolio gallery.

## Prerequisites

- A free EmailJS account
- Access to your email service (Gmail, Outlook, etc.)

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and note down your **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section
3. Copy this key

## Step 5: Configure Your Portfolio

1. Open `image-gallery.js` in your project
2. Find the `getEmailConfig()` method
3. Replace the placeholder values:

```javascript
getEmailConfig() {
    return {
        PUBLIC_KEY: "your_actual_public_key_here",
        SERVICE_ID: "your_actual_service_id_here", 
        TEMPLATE_ID: "your_actual_template_id_here",
        TO_EMAIL: "konaduprince26@gmail.com"
    };
}
```

## Step 6: Test the System

1. Open your gallery page
2. Scroll to the contact section
3. Fill out and submit the contact form
4. Check your email for the message

## Troubleshooting

### Common Issues:

1. **"EmailJS not configured" error**
   - Make sure you've replaced all placeholder values in the config
   - Verify your Public Key, Service ID, and Template ID are correct

2. **"Failed to send message" error**
   - Check your email service setup in EmailJS
   - Verify your email template variables match the code
   - Check browser console for detailed error messages

3. **Messages not received**
   - Check your spam folder
   - Verify your email service is properly connected
   - Test with a different email address

### Template Variables

Make sure your EmailJS template includes these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Email message
- `{{to_email}}` - Your email address

## Security Notes

- Never commit your actual EmailJS credentials to public repositories
- The Public Key is safe to use in client-side code
- Consider using environment variables for production deployments

## Support

If you need help setting up EmailJS, refer to their official documentation:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)

## Alternative: Direct Email Links

If you prefer not to use EmailJS, you can modify the contact form to use direct email links:

```html
<a href="mailto:konaduprince26@gmail.com?subject=Portfolio Contact&body=Hello Konadu," class="btn btn-primary">
    <i class="fas fa-envelope"></i>
    Send Email
</a>
```

This will open the user's default email client with a pre-filled email.
