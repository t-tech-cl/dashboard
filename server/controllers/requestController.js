import Request from '../models/Request.js'; // Import the Request model
import ExternalReport from '../models/ExternalReport.js';

// Create a new request using Sequelize
export const createRequest = async (req, res) => {
  const {
    applicantName,
    applicantRole,
    applicantArea,
    requestNumber,
    userID,
    requestDate,
    description,
    equipmentArea,
    brand,
    location,
    serialNumber,
    documentNumber,
    documentType,
    assignedTo,
    reason,
    managerObservations,
    receptionDate,
    cleaningObservations,
    reportDate,
    reportDescription,
    reportObservations,
    reportAssignedTo,
    reportReason,
    status
  } = req.body;

  const isClean = req.body.isClean === 'si' ? 1 : 0;

  try {
    let request = await Request.findOne({
      where: {
        requestNumber
      }
    });

    if (request && request.requestID) {
      request.set({
        applicantName,
        applicantRole,
        applicantArea,
        userID,
        requestDate,
        description,
        equipmentArea,
        brand,
        status,
        location,
        serialNumber,
        assignedTo,
        reason,
        managerObservations,
        isClean: isClean ? 1 : 0,
        receptionDate,
        cleaningObservations
      });

      let externalReport = await ExternalReport.findOne({
        where: {
          requestID: Number(requestNumber)
        }
      });

      externalReport.set({
        documentNumber,
        documentType,
        reportDate,
        description: reportDescription,
        observations: reportObservations,
        assignedTo: reportAssignedTo,
        reason: reportReason
      });

      await Promise.all([request.save(), externalReport.save()]);

      await request.save();
    } else {
      request = await Request.create({
        applicantName,
        applicantRole,
        applicantArea,
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
        cleaningObservations,
        status
      });

      var externalReport = await ExternalReport.create({
        requestID: parseInt(requestNumber),
        documentNumber,
        documentType,
        reportDate,
        description: reportDescription,
        observations: reportObservations,
        assignedTo: reportAssignedTo,
        reason: reportReason
      });
    }

    // Respond with success
    return res.status(200).json({
      message: 'Request created successfully',
      requestId: request.requestID,
      externalReportId: externalReport.reportID
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
      attributes: ['requestNumber', 'lastUpdateDate', 'status'],
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
      where: { requestID: Number(request.requestNumber) }
    });

    return res.status(200).json({ ...request.dataValues, externalReport: externalReport.dataValues });
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
      nextRequestNumber = `${(lastNumber + 1).toString().padStart(6, '0')}`;
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

export const getAll = async (req, res) => {
  try {
    const requests = await Request.findAll();
    return res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

export const getAllExternalReports = async (req, res) => {
  try {
    const requests = await ExternalReport.findAll();
    return res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};
