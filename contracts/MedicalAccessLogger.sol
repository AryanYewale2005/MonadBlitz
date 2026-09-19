// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedicalAccessLogger
 * @dev Immutably logs off-chain medical record access on the high-throughput Monad blockchain.
 * Ensures zero sensitive patient data is leaked on-chain while creating an unalterable audit trail.
 */
contract MedicalAccessLogger {
    // Access Types: 0 = Read, 1 = Update, 2 = Export, 3 = Emergency Override
    enum AccessType { READ, UPDATE, EXPORT, EMERGENCY_OVERRIDE }

    struct AccessEntry {
        uint256 id;
        bytes32 recordHash;       // Cryptographic hash of off-chain EMR/report
        string patientId;         // Pseudonymized patient identifier (e.g. PAT-4821)
        address requester;        // Healthcare provider address
        string staffName;         // Display name/credential of provider
        string staffRole;         // e.g. "Lead Cardiologist", "ER Physician"
        string department;        // e.g. "Cardiology", "Trauma Unit", "Radiology"
        string reason;            // Clinical justification for record access
        AccessType accessType;    // READ, UPDATE, EXPORT, EMERGENCY_OVERRIDE
        uint256 timestamp;        // Block timestamp on Monad
        bool consentVerified;     // Whether access was explicitly authorized by patient
    }

    // Storage
    uint256 private _logCounter;
    mapping(uint256 => AccessEntry) public logs;
    
    // Indexing mappings for rapid queries
    mapping(bytes32 => uint256[]) private _recordHashToLogs;
    mapping(string => uint256[]) private _patientIdToLogs;
    mapping(address => uint256[]) private _requesterToLogs;
    
    // Patient Consent Registry: patientId => (doctorAddress => expirationTimestamp)
    mapping(string => mapping(address => uint256)) public consentExpiry;

    // Events
    event AccessLogged(
        uint256 indexed logId,
        bytes32 indexed recordHash,
        address indexed requester,
        string patientId,
        string staffRole,
        string department,
        string reason,
        AccessType accessType,
        uint256 timestamp
    );

    event ConsentGranted(
        string indexed patientId,
        address indexed doctor,
        uint256 expiresAt
    );

    event ConsentRevoked(
        string indexed patientId,
        address indexed doctor
    );

    /**
     * @notice Log access to a patient's medical record on Monad.
     */
    function logAccess(
        bytes32 recordHash,
        string calldata patientId,
        string calldata staffName,
        string calldata staffRole,
        string calldata department,
        string calldata reason,
        AccessType accessType
    ) external returns (uint256) {
        require(recordHash != bytes32(0), "Invalid record hash");
        require(bytes(patientId).length > 0, "Invalid patient ID");
        require(bytes(reason).length > 0, "Reason is required for audit");

        _logCounter++;
        uint256 newId = _logCounter;

        // Check if consent is active or if this is an emergency override
        bool isConsentActive = consentExpiry[patientId][msg.sender] > block.timestamp;
        bool isEmergency = (accessType == AccessType.EMERGENCY_OVERRIDE);
        bool consentValid = isConsentActive || isEmergency;

        AccessEntry memory newEntry = AccessEntry({
            id: newId,
            recordHash: recordHash,
            patientId: patientId,
            requester: msg.sender,
            staffName: staffName,
            staffRole: staffRole,
            department: department,
            reason: reason,
            accessType: accessType,
            timestamp: block.timestamp,
            consentVerified: consentValid
        });

        logs[newId] = newEntry;
        _recordHashToLogs[recordHash].push(newId);
        _patientIdToLogs[patientId].push(newId);
        _requesterToLogs[msg.sender].push(newId);

        emit AccessLogged(
            newId,
            recordHash,
            msg.sender,
            patientId,
            staffRole,
            department,
            reason,
            accessType,
            block.timestamp
        );

        return newId;
    }

    /**
     * @notice Patient grants access permission to a medical provider.
     */
    function grantConsent(
        string calldata patientId,
        address doctor,
        uint256 durationInSeconds
    ) external {
        require(doctor != address(0), "Invalid doctor address");
        uint256 expiresAt = block.timestamp + durationInSeconds;
        consentExpiry[patientId][doctor] = expiresAt;

        emit ConsentGranted(patientId, doctor, expiresAt);
    }

    /**
     * @notice Patient revokes access permission from a medical provider.
     */
    function revokeConsent(
        string calldata patientId,
        address doctor
    ) external {
        consentExpiry[patientId][doctor] = 0;
        emit ConsentRevoked(patientId, doctor);
    }

    /**
     * @notice Check whether a doctor has active consent for a patient.
     */
    function hasActiveConsent(
        string calldata patientId,
        address doctor
    ) external view returns (bool) {
        return consentExpiry[patientId][doctor] > block.timestamp;
    }

    /**
     * @notice Verify record access summary without revealing contents.
     */
    function verifyRecordIntegrity(bytes32 recordHash) external view returns (
        bool exists,
        uint256 totalAccesses,
        uint256 firstAccessTimestamp,
        uint256 lastAccessTimestamp
    ) {
        uint256[] memory logIds = _recordHashToLogs[recordHash];
        if (logIds.length == 0) {
            return (false, 0, 0, 0);
        }

        return (
            true,
            logIds.length,
            logs[logIds[0]].timestamp,
            logs[logIds[logIds.length - 1]].timestamp
        );
    }

    /**
     * @notice Get all log IDs for a specific record hash.
     */
    function getLogsByRecord(bytes32 recordHash) external view returns (uint256[] memory) {
        return _recordHashToLogs[recordHash];
    }

    /**
     * @notice Get all log IDs for a specific patient.
     */
    function getLogsByPatient(string calldata patientId) external view returns (uint256[] memory) {
        return _patientIdToLogs[patientId];
    }

    /**
     * @notice Get all log IDs for a specific requester.
     */
    function getLogsByRequester(address requester) external view returns (uint256[] memory) {
        return _requesterToLogs[requester];
    }

    /**
     * @notice Total number of access events logged.
     */
    function getTotalLogs() external view returns (uint256) {
        return _logCounter;
    }
}
