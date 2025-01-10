CREATE DATABASE MaintenanceSystem;

USE MaintenanceSystem;

-- Table to store the details of the requestor
CREATE TABLE Requestor (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    RequestNumber VARCHAR(50) NOT NULL UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(100),
    Area VARCHAR(100),
    Signature VARCHAR(255)
);

-- Table to store the details of the maintenance request
CREATE TABLE RequestDetails (
    RequestID INT,
    RequestDate DATE NOT NULL,
    Description TEXT,
    EquipmentArea VARCHAR(100),
    Brand VARCHAR(100),
    Location VARCHAR(100),
    SerialNumber VARCHAR(50),
    FOREIGN KEY (RequestID) REFERENCES Requestor(RequestID) ON DELETE CASCADE
);

-- Table to store evaluation by the manager
CREATE TABLE ManagerEvaluation (
    EvaluationID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT,
    AssignedTo VARCHAR(100),
    Reason VARCHAR(255),
    Observations TEXT,
    FOREIGN KEY (RequestID) REFERENCES Requestor(RequestID) ON DELETE CASCADE
);

-- Table to store the cleaning and order status
CREATE TABLE CleaningStatus (
    StatusID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT,
    IsClean BOOLEAN,
    ReceptionDate DATE,
    Observations TEXT,
    FOREIGN KEY (RequestID) REFERENCES Requestor(RequestID) ON DELETE CASCADE
);

-- Table to support updates to existing requests
CREATE TABLE RequestUpdates (
    UpdateID INT AUTO_INCREMENT PRIMARY KEY,
    RequestNumber VARCHAR(50) NOT NULL,
    Name VARCHAR(100),
    Role VARCHAR(100),
    Area VARCHAR(100),
    Signature VARCHAR(255),
    RequestDate DATE,
    Description TEXT,
    EquipmentArea VARCHAR(100),
    Brand VARCHAR(100),
    Location VARCHAR(100),
    SerialNumber VARCHAR(50),
    AssignedTo VARCHAR(100),
    Reason VARCHAR(255),
    ManagerObservations TEXT,
    IsClean BOOLEAN,
    ReceptionDate DATE,
    CleaningObservations TEXT,
    FOREIGN KEY (RequestNumber) REFERENCES Requestor(RequestNumber) ON DELETE CASCADE
);
