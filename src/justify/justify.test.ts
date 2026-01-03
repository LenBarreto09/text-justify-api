import { justify } from './justify.js';

describe('Justify Module', () => {
  it('should justify simple text to default 80 character lines', () => {
      const text = 'This is a test of text justification.';
      const result = justify(text);
      
      expect(result).toHaveProperty('justifiedText');
      expect(result).toHaveProperty('wordCount');
      expect(result.wordCount).toBe(9);
      expect(result.justifiedText).toBe('This is a test of text justification.');
    });

    it('should justify text to custom line length', () => {
      const text = 'Short text here';
      const result = justify(text, 20);
      
      const firstLine = result.justifiedText.split('\n')[0];
      expect(firstLine).toBeDefined();
      expect(firstLine!.length).toBeLessThanOrEqual(20);
      expect(result.wordCount).toBe(3);
    });

    it('should handle text that requires multiple lines', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .';
      const result = justify(text);
      
      const lines = result.justifiedText.split('\n');
      expect(lines.length).toBeGreaterThan(1);
      
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        expect(line).toBeDefined();
        expect(line!.length).toBeLessThanOrEqual(80);
      }
      
      expect(result.wordCount).toBe(20);
    });

    it('should count words correctly', () => {
      const text = 'One two three four five';
      const result = justify(text);
      
      expect(result.wordCount).toBe(5);
    });

    it('should handle empty string', () => {
      const result = justify('');
      
      expect(result.justifiedText).toBe('');
      expect(result.wordCount).toBe(0);
    });

    it('should handle string with only whitespace', () => {
      const result = justify('   \n\t   ');
      
      expect(result.justifiedText).toBe('');
      expect(result.wordCount).toBe(0);
    });

    it('should handle single word', () => {
      const result = justify('Hello');
      
      expect(result.justifiedText).toBe('Hello');
      expect(result.wordCount).toBe(1);
    });

    it('should handle text with multiple spaces between words', () => {
      const text = 'Word1    Word2     Word3';
      const result = justify(text, 30);
      
      expect(result.wordCount).toBe(3);
      expect(result.justifiedText).toContain('Word1');
      expect(result.justifiedText).toContain('Word2');
      expect(result.justifiedText).toContain('Word3');
    });

    it('should handle text that exactly fits line length', () => {
      const text = 'Exactly twenty chars';
      const result = justify(text, 20);
      
      expect(result.justifiedText.length).toBeLessThanOrEqual(20);
      expect(result.wordCount).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum line length of 1', () => {
      const text = 'A B';
      const result = justify(text, 1);
      
      const lines = result.justifiedText.split('\n');
      expect(lines.length).toBe(2);
      expect(lines[0]).toBe('A');
      expect(lines[1]).toBe('B');
    });

    it('should handle line length of 0', () => {
      const text = 'Hello world';
      const result = justify(text, 0);
      
      expect(result.wordCount).toBe(2);
      expect(result.justifiedText).toBeDefined();
    });

    it('should handle very large text input', () => {
      const largeText = 'Word '.repeat(1000).trim();
      const result = justify(largeText, 80);
      
      expect(result.wordCount).toBe(1000);
      const lines = result.justifiedText.split('\n');
      expect(lines.length).toBeGreaterThan(10);
    });
  });
  describe('Last Line Handling', () => {
    it('should not justify the last line (left-aligned)', () => {
      const text = 'First line should be justified. Last line should not be justified.';
      const result = justify(text, 30);
      
      const lines = result.justifiedText.split('\n');
      const lastLine = lines[lines.length - 1];
      
      expect(lastLine).toMatch(/^[A-Za-z].*[A-Za-z]\.$/);
    });
  });
