import { randomUUID } from "crypto";

interface TokenData {
  email: string;
  wordsUsed: number;
  lastReset: string;
}

const tokensByEmail = new Map<string, string>();
const tokens = new Map<string, TokenData>();

const createToken = (email: string) => {
  const existingToken = tokensByEmail.get(email);
  if (existingToken) {
    return existingToken;
  }

  const token = randomUUID();
  tokens.set(token, { email, wordsUsed: 0, lastReset: new Date().toDateString() });
  tokensByEmail.set(email, token);
  return token;
}

const verifyToken = (token: string) => {
  const data = tokens.get(token);
  if (!data) return null;
  return data;
}

const incrementWordCount = (token: string, words: number) => {
  const data = tokens.get(token);
  if (!data) return false;

  const today = new Date().toDateString();
  if (data.lastReset !== today) {
    data.wordsUsed = 0;
    data.lastReset = today;
  }

  if (data.wordsUsed + words > 80000) return false;
  data.wordsUsed += words;
  return true;
}

// Test helper function to clear all tokens (only for testing)
const clearAllTokens = () => {
  tokens.clear();
  tokensByEmail.clear();
}

export { createToken, verifyToken, incrementWordCount, clearAllTokens };
