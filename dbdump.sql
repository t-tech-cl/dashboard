CREATE DATABASE MaintenanceSystem;

USE MaintenanceSystem;

-- Table to store user credentials and roles
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords for security
    role ENUM('Admin', 'Manager', 'User') DEFAULT 'User', -- Define roles for access control
    email VARCHAR(100) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Consolidated table to store requests and all related data
CREATE TABLE Requests (
    requestID INT AUTO_INCREMENT PRIMARY KEY,
    requestNumber VARCHAR(50) NOT NULL UNIQUE,
    userID INT NOT NULL, -- Link to the user who created the request
    requestDate DATE NOT NULL,
    lastUpdatedBy INT, -- Link to the user who last updated the request
    lastUpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    description TEXT,
    equipmentArea VARCHAR(100),
    brand VARCHAR(100),
    location VARCHAR(100),
    serialNumber VARCHAR(50),
    assignedTo INT, -- Link to the user assigned to handle the request
    reason VARCHAR(255),
    managerObservations TEXT,
    isClean TINYINT(1), -- Changed to TINYINT(1) for boolean-like data
    receptionDate DATE,
    cleaningObservations TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (lastUpdatedBy) REFERENCES Users(userID) ON DELETE SET NULL,
    FOREIGN KEY (assignedTo) REFERENCES Users(userID) ON DELETE SET NULL
);

-- Table to store manager evaluation and cleaning status (optional, based on your requirements)
CREATE TABLE RequestEvaluations (
    evaluationID INT AUTO_INCREMENT PRIMARY KEY,
    requestID INT NOT NULL,
    assignedTo INT, -- Link to the user assigned to handle the request
    reason VARCHAR(255),
    managerObservations TEXT,
    isClean TINYINT(1), -- Changed to TINYINT(1) for boolean-like data
    receptionDate DATE,
    cleaningObservations TEXT,
    FOREIGN KEY (requestID) REFERENCES Requests(requestID) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES Users(userID) ON DELETE SET NULL
);

CREATE TABLE ExternalCompanyReports (
    reportID INT AUTO_INCREMENT PRIMARY KEY,
    requestID INT NOT NULL, -- Link to the corresponding request
    reportDate DATE NOT NULL, -- Fecha
    description TEXT NOT NULL, -- Descripción
    assignedTo VARCHAR(50), -- Deriva a (linked request number or external assignee)
    reason VARCHAR(255), -- Motivo
    observations TEXT, -- Observaciones
    FOREIGN KEY (requestID) REFERENCES Requests(requestID) ON DELETE CASCADE
);

-- Insert your user
INSERT INTO Users (email, firstname, lastname, password, role)
VALUES (
    'Nelson.rondon94@gmail.com',
    'Nelson',
    'Rondon',
    SHA2('Subverse1', 256), -- password is hashed for security
    'Admin'
);

-- Insert additional users
INSERT INTO Users (email, firstname, lastname, password, role)
VALUES 
    ('manager1@example.com', 'Manager', 'Dummy', SHA2('password123', 256), 'Manager'),
    ('user1@example.com', 'User', 'Dummy', SHA2('password123', 256), 'User'),
    ('user2@example.com', 'User', 'Dummy', SHA2('password123', 256), 'User');

-- Insert dummy requests
INSERT INTO Requests (requestNumber, userID, requestDate, description, equipmentArea, brand, Location, serialNumber, assignedTo, reason, managerObservations, isClean, receptionDate, cleaningObservations)
VALUES 
    ('REQ001', 2, '2025-01-01', 'Broken conveyor belt', 'Production Line', 'ConveyorMaster', 'Plant A', 'SN001', 3, 'Urgent replacement', 'Requires expedited repair', 1, '2025-01-02', 'Clean and ready for repair'),
    ('REQ002', 3, '2025-01-05', 'Leaking pipe', 'Boiler Room', 'PipePro', 'Plant B', 'SN002', 2, 'Routine maintenance', 'Observed rust accumulation', 0, NULL, 'Area needs cleaning first'),
    ('REQ003', 4, '2025-01-10', 'Faulty motor', 'Assembly Area', 'MotorWorks', 'Plant C', 'SN003', 2, 'Warranty issue', 'Inspect for warranty claim', NULL, NULL, NULL);

INSERT INTO ExternalCompanyReports (requestID, reportDate, description, assignedTo, reason, observations)
VALUES 
    (1, '2025-01-17', 'Inspection report from external company.', 'REQ004', 'Urgent repair needed', 'Follow-up required after part replacement.');
