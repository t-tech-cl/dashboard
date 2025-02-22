import { memo, useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = memo(({ className, pdfBlob }) => {
  const [pdfUrl, setPdfUrl] = useState('https://pdfobject.com/pdf/sample.pdf');
  const [containerWidth, setContainerWidth] = useState('auto');
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url); // Cleanup
    }
  }, [pdfBlob]);

  if (!pdfUrl) return <p>Loading PDF...</p>;

  const handleDocumentLoad = (e) => {
    // Get the PDF document's width
    const pdfWidth = e.doc.width;

    // Set the container's width to match the PDF document's width
    setContainerWidth(`${pdfWidth}px`);
  };

  return (
    <div className={className}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`}>
        <div
          style={{
            width: containerWidth, // Dynamically set the width
            margin: '0 auto' // Center the container
          }}
        >
          <Viewer
            theme="dark"
            fileUrl={pdfUrl}
            onDocumentLoad={handleDocumentLoad}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
          />
        </div>
      </Worker>
    </div>
  );
});

export default PDFViewer;
