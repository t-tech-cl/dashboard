import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const prepareCanvas = (pdfRef) => {
  const originalContent = pdfRef.current;

  // Create a hidden container for the cloned content
  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'absolute';
  hiddenContainer.style.left = '-9999px'; // Move off-screen
  hiddenContainer.style.width = '800px'; // Set the desired width for the PDF
  hiddenContainer.style.height = 'auto'; // Height will adjust automatically
  document.body.appendChild(hiddenContainer);

  // Clone the original content
  const clonedContent = originalContent.cloneNode(true);
  hiddenContainer.appendChild(clonedContent);

  return { hiddenContainer, clonedContent };
};

const captureCanvas = async (clonedContent) => {
  const canvas = await html2canvas(clonedContent, {
    scale: 2, // Increase scale for better quality
    width: 800, // Set the desired width for the canvas
    windowWidth: 800 // Ensure the content is rendered at the correct width
  });

  return canvas;
};

const generatePdf = (canvas) => {
  const imgData = canvas.toDataURL('image/png');

  // A4 dimensions in mm
  const pdfWidth = 210; // A4 width in mm
  // const pdfHeight = 297; // A4 height in mm

  // Calculate the aspect ratio of the canvas
  const imgWidth = pdfWidth; // Set the image width to match the PDF width
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create a new PDF
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Add the image to the PDF without stretching
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  return pdf;
};

const generatePdfFromCanvas = async (pdfRef) => {
  const { hiddenContainer, clonedContent } = prepareCanvas(pdfRef);

  try {
    const canvas = await captureCanvas(clonedContent);
    const pdf = generatePdf(canvas);
    return pdf;
  } catch (error) {
    console.log(error);
  } finally {
    document.body.removeChild(hiddenContainer);
  }
};

export default generatePdfFromCanvas;
