// OCR Parser file uses Tesseract.js to extract text from uploaded certificate images or PDFs
// The extracted text is then sent to the admin review page for confirmation before saving
// Vinicius Brito

const Tesseract = require('tesseract.js');

// Extracting text from a certificate image or PDF using OCR
const parseText = async (filePath) => {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
    logger: m => console.log('OCR Progress:', m.status) // showing OCR progress in terminal
});
  return text;
};

module.exports = { parseText };