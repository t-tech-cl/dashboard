import Request from '../models/Request.js'; // Import the Request model

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
    res.status(500).json({ error: err.message });
  }
};

// Get all requests using Sequelize
export const getRequests = async (req, res) => {
  try {
    // Fetch all requests from the database using Sequelize
    const requests = await Request.findAll();

    // Respond with the list of requests
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all requests using Sequelize
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
      nextRequestNumber = `REQ${(lastNumber + 1).toString().padStart(3, '0')}`;
    } else {
      // If no requests exist, start with the first request number
      nextRequestNumber = 'REQ001';
    }

    res.status(200).json({ nextRequestNumber });
  } catch (error) {
    console.error('Error fetching last request number:', error);
    res.status(500).json({ error: 'Failed to fetch last request number.' });
  }
};
