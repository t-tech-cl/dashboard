// import PDFDocument from 'pdfkit';
import PdfPrinter from 'pdfmake';
import fs from 'fs';
import Request from '../models/Request.js'; // Import the Request model
import ExternalReport from '../models/ExternalReport.js';

// Create a new request using Sequelize
export const createRequest = async (req, res) => {
  const {
    requestNumber,
    userID,
    requestDate,
    description,
    equipmentArea,
    brand,
    location,
    serialNumber,
    assignedTo,
    reason,
    managerObservations,
    isClean,
    receptionDate,
    cleaningObservations
  } = req.body;

  try {
    // Create a new request using Sequelize
    const newRequest = await Request.create({
      requestNumber,
      userID,
      requestDate,
      description,
      equipmentArea,
      brand,
      location,
      serialNumber,
      assignedTo,
      reason,
      managerObservations,
      isClean,
      receptionDate,
      cleaningObservations
    });

    // Respond with success
    return res.status(200).json({
      message: 'Request created successfully',
      requestId: newRequest.requestID
    });
  } catch (err) {
    console.error('Error creating request:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Get all requests using Sequelize
export const getAllRequests = async (req, res) => {
  try {
    // Fetch all requests from the database using Sequelize
    const requests = await Request.findAll({
      attributes: ['requestNumber'],
      order: [['requestNumber', 'DESC']]
    });

    // Respond with the list of requests
    return res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Get request using Sequelize
export const getRequest = async (req, res) => {
  const { requestNumber } = req.query;
  try {
    const request = await Request.findOne({
      where: { requestNumber }
    });
    const externalReport = await ExternalReport.findOne({
      where: { requestID: request.requestID }
    });

    return res.status(200).json({ ...request.dataValues, externalReport });
  } catch (err) {
    console.error('Error fetching requests:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Get last request using Sequelize
export const getLastRequestNumber = async (req, res) => {
  try {
    // Find the request with the highest ID
    const lastRequest = await Request.findOne({
      attributes: ['requestNumber'],
      order: [['requestID', 'DESC']]
    });

    let nextRequestNumber;

    if (lastRequest) {
      // Extract the numeric part of the last request number
      const lastNumber = parseInt(lastRequest.requestNumber.replace(/[^0-9]/g, ''), 10);
      // Increment the number and format it as a string with leading zeros
      nextRequestNumber = `${(lastNumber + 1).toString().padStart(5, '0')}`;
    } else {
      // If no requests exist, start with the first request number
      nextRequestNumber = '000001';
    }

    return res.status(200).json({ nextRequestNumber });
  } catch (error) {
    console.error('Error fetching last request number:', error);
    return res.status(500).json({ error: 'Failed to fetch last request number.' });
  }
};

export const generateRequestPDF = async () => {
  const printer = new PdfPrinter();

  const docDefinition = {
    content: [
      { text: 'SOLICITUD DE MANTENIMIENTO', style: 'header', alignment: 'center' },
      {
        columns: [
          { text: 'Código: R-POE-06-03', alignment: 'right' },
          { text: 'Versión: 01', alignment: 'right' },
          { text: 'Fecha Elab.: 28-05-2024', alignment: 'right' },
          { text: 'Fecha Modif.:', alignment: 'right' }
        ],
        margin: [0, 10]
      },
      {
        text: 'IDENTIFICACIÓN DEL SOLICITANTE',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      },
      {
        table: {
          widths: ['25%', '75%'],
          body: [
            ['N° SOLICITUD:', ' '],
            ['NOMBRE:', ' '],
            ['CARGO:', ' '],
            ['ÁREA:', ' '],
            ['FIRMA:', ' ']
          ]
        },
        margin: [0, 10]
      },
      {
        text: 'IDENTIFICACIÓN DE LA SOLICITUD',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            ['FECHA SOLICITUD:', ' '],
            ['TIPO DE SOLICITUD:', 'Preventiva [ ] Correctiva [ ] Instalaciones [ ]'],
            ['DESCRIPCIÓN:', ' '],
            ['EQUIPO/ÁREA:', ' '],
            ['MARCA:', ' '],
            ['UBICACIÓN:', ' '],
            ['NÚMERO:', ' ']
          ]
        },
        margin: [0, 10]
      },
      {
        text: 'EVALUACIÓN JEFE DE MANTENCIÓN',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      },
      {
        table: {
          widths: ['25%', '75%'],
          body: [
            ['DERIVA A:', ' '],
            ['MOTIVO:', ' '],
            ['OBSERVACIONES:', ' ']
          ]
        },
        margin: [0, 10]
      },
      {
        text: 'REPORTE EMPRESA EXTERNA',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      },
      {
        table: {
          widths: ['25%', '75%'],
          body: [
            ['FECHA:', ' '],
            ['DESCRIPCIÓN:', ' '],
            ['TIPO DOCUMENTO:', ' '],
            ['N° DOCUMENTO:', ' '],
            ['OBSERVACIONES:', ' ']
          ]
        },
        margin: [0, 10]
      },
      {
        text: 'IDENTIFICACIÓN DE RECEPCIÓN',
        style: 'subheader',
        margin: [0, 20, 0, 5]
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            ['FECHA:', ' '],
            ['LIMPIEZA Y ORDEN:', 'Sí [ ] No [ ]'],
            ['OBSERVACIONES:', ' ']
          ]
        },
        margin: [0, 10]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 12,
        bold: true
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream('Solicitud_de_Mantenimiento-pdfmake.pdf'));
  pdfDoc.end();
};
