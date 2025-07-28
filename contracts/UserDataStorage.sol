// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UserDataStorage {
    // Structure to store user data
    struct UserData {
        uint256 id;
        string name;
        string email;
        uint256 age;
        uint256 timestamp;
        address userAddress;

    }
    
    // Mapping to store user data by user address
    mapping(address => UserData[]) private userDataRecords;
    
    // Mapping to store user data by ID for quick lookup
    mapping(uint256 => UserData) private dataById;
    
    // Counter for unique IDs
    uint256 private nextId = 1;
    
    // Array to store all user addresses (for iteration)
    address[] private userAddresses;
    
    // Events
    event DataStored(
        uint256 indexed id,
        address indexed user,
        string name,
        uint256 timestamp
    );
    
    event DataUpdated(
        uint256 indexed id,
        address indexed user,
        string name,
        uint256 timestamp
    );
    
    // Modifier to check if user has data
    modifier hasData(address user) {
        require(userDataRecords[user].length > 0, "No data found for this user");
        _;
    }
    
    // Function to store user data
    function storeUserData(
        string memory _name,
        string memory _email,
        uint256 _age
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(_age > 0 && _age < 150, "Invalid age");
        
        // Create new user data
        UserData memory newData = UserData({
            id: nextId,
            name: _name,
            email: _email,
            age: _age,
            timestamp: block.timestamp,
            userAddress: msg.sender
        });
        
        // Store in mappings
        userDataRecords[msg.sender].push(newData);
        dataById[nextId] = newData;
        
        // Add user address if first time
        if (userDataRecords[msg.sender].length == 1) {
            userAddresses.push(msg.sender);
        }
        
        emit DataStored(nextId, msg.sender, _name, block.timestamp);
        nextId++;
    }
    
    // Function to get user's data records
    function getUserData(address _user) 
        public 
        view 
        hasData(_user)
        returns (UserData[] memory) 
    {
        return userDataRecords[_user];
    }
    
    // Function to get user's own data
    function getMyData() public view returns (UserData[] memory) {
        require(userDataRecords[msg.sender].length > 0, "No data found");
        return userDataRecords[msg.sender];
    }
    
    // Function to get data by ID
    function getDataById(uint256 _id) 
        public 
        view 
        returns (UserData memory) 
    {
        require(_id > 0 && _id < nextId, "Invalid ID");
        return dataById[_id];
    }
    
    // Function to update user data by ID
    function updateUserData(
        uint256 _id,
        string memory _name,
        string memory _email,
        uint256 _age
    ) public {
        require(_id > 0 && _id < nextId, "Invalid ID");
        require(dataById[_id].userAddress == msg.sender, "Not authorized");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(_age > 0 && _age < 150, "Invalid age");
        
        // Update data
        dataById[_id].name = _name;
        dataById[_id].email = _email;
        dataById[_id].age = _age;
        dataById[_id].timestamp = block.timestamp;
        
        // Update in user's records array
        UserData[] storage userRecords = userDataRecords[msg.sender];
        for (uint i = 0; i < userRecords.length; i++) {
            if (userRecords[i].id == _id) {
                userRecords[i] = dataById[_id];
                break;
            }
        }
        
        emit DataUpdated(_id, msg.sender, _name, block.timestamp);
    }
    
    // Function to get total number of records
    function getTotalRecords() public view returns (uint256) {
        return nextId - 1;
    }
    
    // Function to get number of users
    function getTotalUsers() public view returns (uint256) {
        return userAddresses.length;
    }
    
    // Function to get all user addresses (only for demonstration)
    function getAllUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }
    
    // Function to check if user has data
    function userHasData(address _user) public view returns (bool) {
        return userDataRecords[_user].length > 0;
    }
}



//npm run node for starting the node
//npm run test for running the tests
//npx hardhat run scripts/deploy.js --network localhost