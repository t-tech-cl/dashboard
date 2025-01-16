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
    res.status(201).json({
      message: 'Request created successfully',
      requestId: newRequest.RequestID
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
