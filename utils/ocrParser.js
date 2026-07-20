// CertTrack - OCR Parser
// This file uses Tesseract.js to extract text from uploaded certificate images or PDFs
// For PDFs, it uses ImageMagick via child_process to convert to image first
// The extracted text is then sent to the admin review page for confirmation before saving
// Vinicius Brito

const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Extracting text from a certificate image or PDF using OCR
const parseText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  let imagePathToProcess = filePath;
  let tempImageCreated = false;

  // If the file is a PDF, convert to image using ImageMagick directly
  if (ext === '.pdf') {
    const outputPath = filePath.replace('.pdf', '_converted.png');
    
    // Using ImageMagick convert command directly
    execSync(`/opt/homebrew/bin/convert -density 200 "${filePath}[0]" -quality 90 "${outputPath}"`);
    
    imagePathToProcess = outputPath;
    tempImageCreated = true;
  }

  // Running OCR on the image
  const { data: { text } } = await Tesseract.recognize(imagePathToProcess, 'eng', {
    logger: m => console.log('OCR Progress:', m.status)
  });

  // Removing temporary converted image if it was created
  if (tempImageCreated && fs.existsSync(imagePathToProcess)) {
    fs.unlinkSync(imagePathToProcess);
  }

  return text;
};

module.exports = { parseText };