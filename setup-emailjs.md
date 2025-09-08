# 🚀 Quick EmailJS Setup Guide

## The Issue
The current EmailJS configuration uses **demo/placeholder credentials** that don't work. That's why you're getting the "undefined" error.

## ✅ Quick Fix (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** (it's free)
3. Verify your email

### Step 2: Add Email Service
1. In EmailJS dashboard → **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (or your email provider)
4. Follow the setup (usually just connect your Gmail)
5. **Copy the Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

```
Subject: New Contact: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
Sent from your portfolio contact form.
```

4. **Copy the Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Public Key
1. Go to **"Account"** → **"API Keys"**
2. **Copy your Public Key** (looks like: `xxxxxxxxxxxxxxx`)

### Step 5: Update Configuration
Replace the credentials in these files:
- `script.js` (line ~509)
- `test-contact-form.html` (line ~127)
- `image-gallery.js` (line ~610)

```javascript
getEmailConfig() {
    return {
        PUBLIC_KEY: "YOUR_ACTUAL_PUBLIC_KEY_HERE",
        SERVICE_ID: "YOUR_ACTUAL_SERVICE_ID_HERE", 
        TEMPLATE_ID: "YOUR_ACTUAL_TEMPLATE_ID_HERE",
        TO_EMAIL: "konaduprince26@gmail.com"
    };
}
```

## 🔧 Current Fallback Solution

Until you set up EmailJS, the contact form will show a **"Send Email Directly"** button that opens your email client with the message pre-filled.

## 🧪 Test After Setup

1. Update the credentials in the files above
2. Refresh your browser
3. Try the contact form again
4. Check your email inbox!

## 📞 Need Help?

If you need help with the setup, I can guide you through it step by step!
