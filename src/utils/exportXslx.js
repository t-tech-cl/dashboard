import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (registroData, summaryData, fileName = 'Matriz_Control_Mantencion.xlsx') => {
  // Define headers for 'Registro' sheet with formatting
  const registroHeaders = [
    [
      'N° de Solicitud',
      'Nombre Solicitante',
      'Trabajo solicitado',
      'Área/Equipo Afectada',
      'Estatus Abierta/Cerrada',
      'DERIVADO A:',
      'Fecha Solicitud',
      'Nueva fecha',
      'Fecha Termino',
      'Fecha de termino Real',
      'Plazo programado',
      'Días de Atraso Totales'
    ]
  ];

  // Define headers for 'Hoja1' summary sheet with formatting
  const summaryHeaders = [['Estatus', 'Cantidad', '%']];

  // Convert JSON data into worksheet format
  const registroSheet = XLSX.utils.aoa_to_sheet(registroHeaders);
  XLSX.utils.sheet_add_json(registroSheet, registroData, { origin: 'A2', skipHeader: true });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryHeaders);
  XLSX.utils.sheet_add_json(summarySheet, summaryData, { origin: 'A2', skipHeader: true });

  // Apply column widths
  registroSheet['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 }
  ];
  summarySheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }];

  // Apply styles for headers (bold + background color #45b0e1)
  const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: '45b0e1' } } };
  registroHeaders[0].forEach((_, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (!registroSheet[cellRef]) registroSheet[cellRef] = {};
    registroSheet[cellRef].s = headerStyle;
  });

  summaryHeaders[0].forEach((_, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (!summarySheet[cellRef]) summarySheet[cellRef] = {};
    summarySheet[cellRef].s = headerStyle;
  });

  // Apply conditional formatting for 'Estatus Abierta/Cerrada' column (assuming it's column E)
  registroData.forEach((row, index) => {
    const cellRef = `E${index + 2}`; // Adjust row index
    let color = 'FFFFFF'; // Default white
    switch (row['Estatus Abierta/Cerrada']) {
      case 'finished_delayed':
        color = 'FF0000'; // Red
        break;
      case 'finished':
        color = '00FF00'; // Green
        break;
      case 'finished_upfront':
        color = '0000FF'; // Blue
        break;
      case 'delayed':
        color = 'FFA500'; // Orange
        break;
      case 'ongoing':
        color = 'FFFF00'; // Yellow
        break;
    }
    if (!registroSheet[cellRef]) registroSheet[cellRef] = {}; // Ensure the cell exists
    registroSheet[cellRef].s = { fill: { fgColor: { rgb: color } } };
  });

  // Create a workbook and append the sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, registroSheet, 'Registro');
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Hoja1');

  // Generate and download the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const fileBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(fileBlob, fileName);
};

const importFromExcel = (file, setData) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    setData(jsonData);
  };
  reader.readAsArrayBuffer(file);
};

export { exportToExcel, importFromExcel };
