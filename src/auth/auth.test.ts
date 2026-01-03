import { createToken, verifyToken, incrementWordCount, clearAllTokens } from './auth.js';

describe('Auth Module', () => {
  beforeEach(() => {
    // Clear all tokens before each test to ensure isolation
    clearAllTokens();
  });

  describe('createToken', () => {
    it('should create a token for a new email', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should return the same token for the same email', () => {
      const email = 'user1@test.com';
      const token1 = createToken(email);
      const token2 = createToken(email);
      
      expect(token1).toBe(token2);
    });

    it('should create different tokens for different emails', () => {
      const email1 = 'user1@test.com';
      const email2 = 'user2@test.com';
      
      const token1 = createToken(email1);
      const token2 = createToken(email2);
      
      expect(token1).not.toBe(token2);
    });

    it('should handle empty email string', () => {
      const token = createToken('');
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should return token data for valid token', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      const tokenData = verifyToken(token);
      
      expect(tokenData).not.toBeNull();
      expect(tokenData?.email).toBe(email);
      expect(tokenData?.wordsUsed).toBe(0);
      expect(tokenData?.lastReset).toBe(new Date().toDateString());
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid-token-123';
      const tokenData = verifyToken(invalidToken);
      
      expect(tokenData).toBeNull();
    });

    it('should return null for empty token', () => {
      const tokenData = verifyToken('');
      
      expect(tokenData).toBeNull();
    });

    it('should return null for undefined token', () => {
      const tokenData = verifyToken(undefined as any);
      
      expect(tokenData).toBeNull();
    });
  });

  describe('incrementWordCount', () => {
    it('should increment word count for valid token', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      const result = incrementWordCount(token, 100);
      expect(result).toBe(true);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(100);
    });

    it('should accumulate word counts across multiple calls', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      incrementWordCount(token, 100);
      incrementWordCount(token, 200);
      incrementWordCount(token, 300);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(600);
    });

    it('should return false for invalid token', () => {
      const invalidToken = 'invalid-token-123';
      const result = incrementWordCount(invalidToken, 100);
      
      expect(result).toBe(false);
    });

    it('should return false when exceeding daily limit (80,000 words)', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      let result = incrementWordCount(token, 79999);
      expect(result).toBe(true);
      
      result = incrementWordCount(token, 1);
      expect(result).toBe(false);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(80000);
    });

    it('should handle edge case, 80,000 words', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      const result = incrementWordCount(token, 80000);
      expect(result).toBe(true);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(80000);
    });

    it('should reject requests exceeding limit', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      const result = incrementWordCount(token, 80001);
      expect(result).toBe(false);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(0);
    });

    it('should handle zero word count', () => {
      const email = 'user1@test.com';
      const token = createToken(email);
      
      const result = incrementWordCount(token, 0);
      expect(result).toBe(true);
      
      const tokenData = verifyToken(token);
      expect(tokenData?.wordsUsed).toBe(0);
    });
  });
});
