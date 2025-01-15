CREATE DATABASE MaintenanceSystem;

USE MaintenanceSystem;

-- Table to store user credentials and roles
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Password VARCHAR(255) NOT NULL, -- Store hashed passwords for security
    Role ENUM('Admin', 'Manager', 'User') DEFAULT 'User', -- Define roles for access control
    Email VARCHAR(100) UNIQUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Consolidated table to store requests and all related data
CREATE TABLE Requests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    RequestNumber VARCHAR(50) NOT NULL UNIQUE,
    UserID INT NOT NULL, -- Link to the user who created the request
    RequestDate DATE NOT NULL,
    LastUpdatedBy INT, -- Link to the user who last updated the request
    LastUpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Description TEXT,
    EquipmentArea VARCHAR(100),
    Brand VARCHAR(100),
    Location VARCHAR(100),
    SerialNumber VARCHAR(50),
    AssignedTo INT, -- Link to the user assigned to handle the request
    Reason VARCHAR(255),
    ManagerObservations TEXT,
    IsClean TINYINT(1), -- Changed to TINYINT(1) for boolean-like data
    ReceptionDate DATE,
    CleaningObservations TEXT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LastUpdatedBy) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (AssignedTo) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Table to store manager evaluation and cleaning status (optional, based on your requirements)
CREATE TABLE RequestEvaluations (
    EvaluationID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT NOT NULL,
    AssignedTo INT, -- Link to the user assigned to handle the request
    Reason VARCHAR(255),
    ManagerObservations TEXT,
    IsClean TINYINT(1), -- Changed to TINYINT(1) for boolean-like data
    ReceptionDate DATE,
    CleaningObservations TEXT,
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID) ON DELETE CASCADE,
    FOREIGN KEY (AssignedTo) REFERENCES Users(UserID) ON DELETE SET NULL
);

-- Insert your user
INSERT INTO Users (Email, Password, Role)
VALUES (
    'Nelson.rondon94@gmail.com',
    SHA2('Subverse1', 256), -- Password is hashed for security
    'Admin'
);

-- Insert additional users
INSERT INTO Users (Email, Password, Role)
VALUES 
    ('manager1@example.com', SHA2('password123', 256), 'Manager'),
    ('user1@example.com', SHA2('password123', 256), 'User'),
    ('user2@example.com', SHA2('password123', 256), 'User');

-- Insert dummy requests
INSERT INTO Requests (RequestNumber, UserID, RequestDate, Description, EquipmentArea, Brand, Location, SerialNumber, AssignedTo, Reason, ManagerObservations, IsClean, ReceptionDate, CleaningObservations)
VALUES 
    ('REQ001', 2, '2025-01-01', 'Broken conveyor belt', 'Production Line', 'ConveyorMaster', 'Plant A', 'SN001', 3, 'Urgent replacement', 'Requires expedited repair', 1, '2025-01-02', 'Clean and ready for repair'),
    ('REQ002', 3, '2025-01-05', 'Leaking pipe', 'Boiler Room', 'PipePro', 'Plant B', 'SN002', 2, 'Routine maintenance', 'Observed rust accumulation', 0, NULL, 'Area needs cleaning first'),
    ('REQ003', 4, '2025-01-10', 'Faulty motor', 'Assembly Area', 'MotorWorks', 'Plant C', 'SN003', 2, 'Warranty issue', 'Inspect for warranty claim', NULL, NULL, NULL);
