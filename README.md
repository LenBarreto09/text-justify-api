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

This project uses Jest as the testing framework with TypeScript.

### Test Scripts

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
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