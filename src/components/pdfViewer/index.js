import { memo } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = memo(({ className, fileUrl = 'https://pdfobject.com/pdf/sample.pdf' }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className={className}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`}>
        <Viewer theme="dark" fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
});

export default PDFViewer;
