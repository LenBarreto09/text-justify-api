#!/bin/bash

echo "🧪 Testing Text Justify API Locally"
echo "=================================="

# Function to test if server is running
check_server() {
    curl -s http://127.0.0.1:3000/api/token > /dev/null 2>&1
    return $?
}

echo "📡 Starting server..."
echo "Run this command in one terminal:"
echo "cd /Users/beatrizbarreto/Documents/Internships/text-justify-api && npm start"
echo ""
echo "Then run these tests in another terminal:"
echo ""

echo "🔑 Test 1: Get a token"
echo "curl -X POST http://127.0.0.1:3000/api/token \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"test@example.com\"}'"
echo ""

echo "📝 Test 2: Justify text (replace YOUR_TOKEN with token from step 1)"
echo "curl -X POST http://127.0.0.1:3000/api/justify \\"
echo "  -H 'Content-Type: text/plain' \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -d 'This is a sample text that needs to be justified to test our text justification API endpoint functionality.'"
echo ""

echo "❌ Test 3: Test invalid token"
echo "curl -X POST http://127.0.0.1:3000/api/justify \\"
echo "  -H 'Content-Type: text/plain' \\"
echo "  -H 'Authorization: Bearer invalid-token' \\"
echo "  -d 'This should fail with 401 error'"
echo ""

echo "📊 Test 4: Test rate limiting (after many requests)"
echo "# After sending 80,000+ words, you should get rate limited"
echo ""

echo "🔍 Complete Test Example:"
echo "========================"
echo ""
echo "# Step 1: Get token"
echo "TOKEN=\$(curl -s -X POST http://127.0.0.1:3000/api/token \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"test@example.com\"}' | \\"
echo "  grep -o '\"token\":\"[^\"]*\"' | \\"
echo "  sed 's/\"token\":\"\(.*\)\"/\1/')"
echo ""
echo "# Step 2: Use token to justify text"
echo "curl -X POST http://127.0.0.1:3000/api/justify \\"
echo "  -H 'Content-Type: text/plain' \\"
echo "  -H \"Authorization: Bearer \$TOKEN\" \\"
echo "  -d 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'"
