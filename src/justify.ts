const justify = (text: string, lineLength: number = 80) : string => {
  const words = text.split(' ').filter(word => word.length > 0);
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLineLen: number = 0;

  for (const word of words) {
    if (currentLineLen + word.length > lineLength) {
      lines.push(currentLine.join(' '));
      currentLine = [word];
      currentLineLen = word.length;
    } else {
      currentLine.push(word);
      currentLineLen += word.length + 1;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }
  
  return lines.join('\n');
}

export { justify };
