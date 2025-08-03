// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TransactionManager {
    struct Transaction {
        uint256 id;
        address payable seller;
        address creditedPerson;
        string description;
        uint256 amount;
        bool verified;
        bool exists;
    }

    address public governmentAddress;
    uint256 private nextTransactionId;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256) public credits;

    event TransactionProposed(uint256 indexed id, address indexed seller, address indexed creditedPerson, string description, uint256 amount);
    event TransactionVerified(uint256 indexed id, address indexed verifier);
    event TransactionRejected(uint256 indexed id, address indexed verifier);
    event CreditsAwarded(address indexed creditedPerson, uint256 amount);

    constructor(address _governmentAddress) {
        require(_governmentAddress != address(0), "Government address cannot be zero");
        governmentAddress = _governmentAddress;
        nextTransactionId = 1;
    }

    modifier onlyGovernment() {
        require(msg.sender == governmentAddress, "Only government can perform this action");
        _;
    }

    modifier transactionExists(uint256 _id) {
        require(transactions[_id].exists, "Transaction does not exist");
        _;
    }

    function proposeTransaction(address _creditedPerson, string memory _description, uint256 _amount) public {
        require(_creditedPerson != address(0), "Credited person address cannot be zero");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_amount > 0, "Amount must be greater than zero");

        uint256 newId = nextTransactionId;
        transactions[newId] = Transaction({
            id: newId,
            seller: payable(msg.sender),
            creditedPerson: _creditedPerson,
            description: _description,
            amount: _amount,
            verified: false,
            exists: true
        });
        nextTransactionId++;

        emit TransactionProposed(newId, msg.sender, _creditedPerson, _description, _amount);
    }

    function verifyTransaction(uint256 _id) public onlyGovernment transactionExists(_id) {
        Transaction storage tx = transactions[_id];
        require(!tx.verified, "Transaction already verified");

        tx.verified = true;
        credits[tx.creditedPerson] += tx.amount;

        emit TransactionVerified(_id, msg.sender);
        emit CreditsAwarded(tx.creditedPerson, tx.amount);
    }

    function rejectTransaction(uint256 _id) public onlyGovernment transactionExists(_id) {
        Transaction storage tx = transactions[_id];
        require(!tx.verified, "Cannot reject an already verified transaction");

        delete transactions[_id];
        emit TransactionRejected(_id, msg.sender);
    }

    function getTransaction(uint256 _id) public view returns (uint256 id, address seller, address creditedPerson, string memory description, uint256 amount, bool verified, bool exists) {
        Transaction storage tx = transactions[_id];
        return (tx.id, tx.seller, tx.creditedPerson, tx.description, tx.amount, tx.verified, tx.exists);
    }

    function getCredits(address _person) public view returns (uint256) {
        return credits[_person];
    }
}