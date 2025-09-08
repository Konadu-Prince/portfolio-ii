#!/bin/bash

# Push to Remote Script
# This script pushes local commits to the remote repository

echo "🔍 Checking local commits ahead of remote..."
git status

echo ""
echo "📋 Recent commits:"
echo "=================="
git log --oneline -5

echo ""
echo "🚀 Do you want to push these commits to remote? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "📡 Pushing to remote..."
    git push
    echo "✅ Changes pushed successfully!"
else
    echo "❌ Push cancelled."
fi
