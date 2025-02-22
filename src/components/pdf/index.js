import PDFViewer from 'components/pdfViewer';
import { useCallback, useEffect, useRef, useState } from 'react';
import PdfDocument from 'components/pdfDocument';
import generatePdfFromCanvas from 'utils/canvas';
import TransitionModal from 'components/modal';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

const PDFFile = ({ request }) => {
  const [blob, setBlob] = useState();
  const pdfRef = useRef();
  const {
    request: { requestNumber }
  } = useSelector((state) => state.maintenanceRequest);

  const buildBlob = useCallback(async () => {
    const pdf = await generatePdfFromCanvas(pdfRef);
    const pdfBlob = generatePdfBlob(pdf);

    setBlob(pdfBlob);
  }, []);

  useEffect(() => {
    !blob && request && buildBlob();
  }, [buildBlob, blob, request]);

  const generatePdfBlob = (pdf) => {
    // Generate the PDF as a Blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  };

  const handleDownload = async () => {
    try {
      saveAs(blob, `Solicitud_mantenimiento_${requestNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div style={{ rowGap: 30, marginTop: 20, marginBottom: 40 }}>
      <TransitionModal handleDownload={handleDownload}>
        <PDFViewer pdfBlob={blob} />
      </TransitionModal>

      <PdfDocument request={request} pdfRef={pdfRef} onChange={buildBlob} />
    </div>
  );
};

export default PDFFile;
