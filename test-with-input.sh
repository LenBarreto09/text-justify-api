#!/bin/bash

# Text Justify API - Testing with Input Examples
# ==============================================
# Tests both local and Railway production environments

# Configuration
LOCAL_URL="http://127.0.0.1:3000"
RAILWAY_URL="https://web-production-989b3.up.railway.app"
INPUT_FILE="inputExamples/input.txt"
EXPECTED_OUTPUT="inputExamples/output.txt"
RESULT_FILE="inputExamples/input_result.txt"

# Default to local testing
API_URL="$LOCAL_URL"
ENVIRONMENT="local"

# Check command line arguments
if [ "$1" = "railway" ] || [ "$1" = "production" ]; then
    API_URL="$RAILWAY_URL"
    ENVIRONMENT="Railway production"
    RESULT_FILE="inputExamples/railway_result.txt"
fi

echo "🧪 Testing Text Justify API with input examples"
echo "==============================================="
echo "Environment: $ENVIRONMENT"
echo "API URL: $API_URL"
echo ""

# Check if server is running
check_server() {
    curl -s -m 10 "$API_URL/api/token" > /dev/null 2>&1
    return $?
}

echo "📡 Checking if server is accessible..."
if ! check_server; then
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "❌ Local server is not running!"
        echo "Please start the server first:"
        echo "   cd /Users/beatrizbarreto/Documents/Internships/text-justify-api"
        echo "   npm run dev"
        echo ""
        echo "Or test the Railway production:"
        echo "   ./test-with-input.sh railway"
    else
        echo "❌ Railway server is not accessible!"
        echo "Please check if your deployment is running at:"
        echo "   $RAILWAY_URL"
    fi
    exit 1
fi
echo "✅ Server is accessible!"

# Step 1: Get authentication token
echo ""
echo "🔑 Step 1: Getting authentication token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/api/token" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}')

echo "Token response: $TOKEN_RESPONSE"

# Extract token using grep and sed
TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | sed 's/"token":"\(.*\)"/\1/')

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token!"
    echo "Response was: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Got token: ${TOKEN:0:20}..."

# Step 2: Read input file
echo ""
echo "📖 Step 2: Reading input file..."
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Input file not found: $INPUT_FILE"
    echo "Make sure you're running this from the project root directory"
    exit 1
fi

INPUT_TEXT=$(cat "$INPUT_FILE")
echo "✅ Input file loaded ($(echo "$INPUT_TEXT" | wc -c) characters)"

# Step 3: Send text for justification
echo ""
echo "📝 Step 3: Sending text for justification..."
JUSTIFIED_TEXT=$(curl -s -X POST "$API_URL/api/justify" \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$INPUT_TEXT")

# Check if we got an error response
if echo "$JUSTIFIED_TEXT" | grep -q "error"; then
    echo "❌ API returned an error:"
    echo "$JUSTIFIED_TEXT"
    exit 1
fi

echo "✅ Text justified successfully"

# Step 4: Save result
echo ""
echo "💾 Step 4: Saving result to $RESULT_FILE..."
echo "$JUSTIFIED_TEXT" > "$RESULT_FILE"
echo "✅ Result saved"

# Step 5: Compare with expected output (if exists)
echo ""
echo "🔍 Step 5: Comparing with expected output..."
if [ -f "$EXPECTED_OUTPUT" ]; then
    if diff -q "$EXPECTED_OUTPUT" "$RESULT_FILE" > /dev/null; then
        echo "✅ Perfect match! Your API output matches the expected result."
    else
        echo "⚠️  Differences found between expected and actual output:"
        echo ""
        echo "First 10 lines comparison:"
        echo "========================="
        echo "Expected (left) vs Actual (right):"
        diff -y "$EXPECTED_OUTPUT" "$RESULT_FILE" | head -10
        echo ""
        echo "Full differences:"
        diff -u "$EXPECTED_OUTPUT" "$RESULT_FILE" | head -20
    fi
else
    echo "ℹ️  No expected output file found for comparison."
fi

# Step 6: Display results
echo ""
echo "📋 Step 6: Results Summary"
echo "========================="
echo "Environment: $ENVIRONMENT"
echo "API URL: $API_URL"
echo "Input file: $INPUT_FILE"
echo "Output file: $RESULT_FILE"
echo "Expected: $EXPECTED_OUTPUT"
echo ""
echo "📊 Statistics:"
echo "Input length: $(echo "$INPUT_TEXT" | wc -c) characters"
echo "Input words: $(echo "$INPUT_TEXT" | wc -w) words"
echo "Output lines: $(cat "$RESULT_FILE" | wc -l) lines"
echo "Max line length: $(cat "$RESULT_FILE" | wc -L) characters"
echo ""
echo "🎉 Test completed successfully!"
echo ""
echo "Commands to view results:"
echo "========================"
echo "View justified text:"
echo "  cat $RESULT_FILE"
echo ""
echo "Compare with expected (side by side):"
echo "  diff -y $EXPECTED_OUTPUT $RESULT_FILE"
echo ""
echo "Show line lengths (should be ≤80 chars):"
echo "  awk '{print length(\$0) \": \" \$0}' $RESULT_FILE"
