# Text Justify API
Implement and deploy a REST API that justifies a text passed as a parameter.

## Technologies

- Node.js
- TypeScript
- Fastify
- Jest

## Getting Started

To start the server, run:
```bash
npx tsx src/index.ts
```

The server uses the `start` function to initialize and listen on port 3000.

## Testing

This project uses Jest as the testing framework with TypeScript for unit tests.

### Unit Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Local Development Testing

Start the development server:
```bash
cd /Users/beatrizbarreto/Documents/Internships/text-justify-api
npm run dev
```

#### Local API Test Commands

**1. Get authentication token:**
```bash
curl -X POST http://127.0.0.1:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**2. Justify text (replace YOUR_TOKEN with token from step 1):**
```bash
curl -X POST http://127.0.0.1:3000/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "This is a sample text that needs to be justified locally."
```

### API Testing with Railway Deployment

The API is deployed and accessible on Railway at: **https://web-production-989b3.up.railway.app**

#### Railway API Test Commands

**1. Get authentication token:**
```bash
curl -X POST https://web-production-989b3.up.railway.app/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**2. Justify text (replace YOUR_TOKEN with token from step 1):**
```bash
curl -X POST https://web-production-989b3.up.railway.app/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "This is a sample text that needs to be justified using the Railway deployed API."
```

### Automated Testing with Input Examples

Test with the provided sample files on both environments:

```bash
# Make the test script executable
chmod +x test-with-input.sh

# Test local development server
./test-with-input.sh

# Test Railway production deployment
./test-with-input.sh railway
```

#### Input Example Files
- `inputExamples/input.txt` - Sample French text to be justified
- `inputExamples/output.txt` - Expected justified output (80 characters per line)
- `inputExamples/input_result.txt` - Results from local API testing
- `inputExamples/railway_result.txt` - Results from Railway API testing

#### View and Validate Results
```bash
# View local test results
cat inputExamples/input_result.txt

# View Railway test results
cat inputExamples/railway_result.txt

# Compare local vs Railway results (should be identical)
diff inputExamples/input_result.txt inputExamples/railway_result.txt

# Check line lengths (should be ≤80 characters)
awk '{print length($0) ": " $0}' inputExamples/railway_result.txt

# Compare with expected output
diff -y inputExamples/output.txt inputExamples/railway_result.txt
```

## Implementation Notes

Auth file generates tokens, performs email verification
It takes one token per email per day, resetting daily
Since not specified at the moment it does not perform email validation.

Text justification implements word wrapping to 80 characters. For full text justification (distributing spaces to make lines exactly 80 characters), additional space distribution logic would be needed.

## Constrains
* The line length of the justified text must be 80 characters.
* The endpoint must be /api/justify and must return justified text after a POST request with a text/plain Content-Type body.
* The API must use a token-based authentication mechanism. For example, an api/token endpoint that returns a token from a POST request with a JSON body { "email": "foo@bar.com" }.
* There must be a rate limit per token for the /api/justify endpoint, set to 80,000 words per day. If this limit is exceeded during the day, return a 402 Payment Required error.