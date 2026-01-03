const buildJustifiedLine = (words: string[], lineLength: number): string => {
  if (words.length <= 1) return words.join('');
  const totalWordLen = words.reduce((sum, w) => sum + w.length, 0);
  const totalSpaces = lineLength - totalWordLen;
  const gaps = words.length - 1;
  const baseSpaces = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;

  let line = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    const spaces = baseSpaces + ((i - 1) < extraSpaces ? 1 : 0);
    line += ' '.repeat(spaces) + words[i];
  }
  return line;
};

const justify = (text: string, lineLength: number = 80) : { justifiedText: string, wordCount: number } => {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLineWords: number = 0;

  for (const word of words) {
    const spaceToAdd = currentLine.length > 0 ? 1 : 0;
    if (currentLineWords + spaceToAdd + word.length > lineLength) {
      lines.push(buildJustifiedLine(currentLine, lineLength));
      currentLine = [word];
      currentLineWords = word.length;
    } else {
      currentLine.push(word);
      currentLineWords += word.length + spaceToAdd;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }
  
  return {
    justifiedText: lines.join('\n'),
    wordCount: words.length
  };
}

export { justify };
