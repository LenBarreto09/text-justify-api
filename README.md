# Text Justify API
Implement and deploy a REST API that justifies a text passed as a parameter.

## Technologies

- Node.js
- TypeScript
- Fastify

## Implementation Notes

Auth file generates tokens, performs email verification
It takes one token per email per day, resetting daily
Since not specified at the moment it does not perform email validation.

Text justification implements word wrapping to 80 characters. For full text justification (distributing spaces to make lines exactly 80 characters), additional space distribution logic would be needed.