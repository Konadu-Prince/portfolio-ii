#!/bin/bash

# Commit Helper Script
# This script commits locally and asks for confirmation before pushing to remote

echo "🔍 Checking for changes..."
git status --porcelain

if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit. Working tree is clean."
    exit 0
fi

echo ""
echo "📋 Changes found:"
echo "=================="
git diff --stat

echo ""
echo "📝 Detailed changes:"
echo "===================="
git diff

echo ""
echo "💬 Enter commit message (or press Enter for default):"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update files - $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "📤 Committing changes locally..."
git add .
git commit -m "$commit_message"
echo "✅ Changes committed locally!"

echo ""
echo "🚀 Do you want to push to remote repository? (y/n)"
read -r push_response

if [[ "$push_response" =~ ^[Yy]$ ]]; then
    echo "📡 Pushing to remote..."
    git push
    echo "✅ Changes pushed successfully!"
else
    echo "⏸️  Changes committed locally. Push manually when ready with: git push"
fi
