#!/bin/bash

# Show Changes Script
# This script shows what changes would be committed

echo "🔍 Current Git Status:"
echo "======================"
git status

echo ""
echo "📋 Files with changes:"
echo "======================"
git diff --name-only

echo ""
echo "📝 Detailed changes:"
echo "===================="
git diff

echo ""
echo "📊 Change summary:"
echo "=================="
git diff --stat
