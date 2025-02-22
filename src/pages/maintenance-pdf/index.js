import PDFFile from 'components/pdf';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { getRequest } from 'store/reducers/maintenanceRequest';
// import PDFViewer from 'components/pdfViewer';

const MaintenanceRequestPDF = () => {
  const { id } = useParams();
  const { request } = useSelector((state) => state.maintenanceRequest);

  useEffect(() => {
    if (!request.requestNumber) getRequest(id);
  }, [id, request.requestNumber]);
  // return <PDFViewer />;
  return <PDFFile request={request} />;
};

export default MaintenanceRequestPDF;
