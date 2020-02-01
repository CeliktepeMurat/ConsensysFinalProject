pragma solidity ^0.5.11;

/**************************************************************
                    MAIN CONTRACT
***************************************************************/

/// @title Lending and Borrowing Platform

contract lendingBorrowing {
    /// @author Murat Çeliktepe
    
    struct Participant {
        string groupNo;
        address memberAddress;
        string nameSurname;
    }   
    
    struct Group {
        string groupId;
        address creator;
        uint groupBalance;
        bool isOpen;
        uint numberOfMember;
        uint requestCount;
        
        mapping(address => bool) members;
        mapping(address => uint) borrowers;
        
        mapping(address => uint) depositGroupArray;
        mapping(address => uint) depositCompoundArray;
    }
    
    struct Request {
        string groupId;
        string nameSurname;
        uint requestCount;
        address candidate;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    /* @notice Two types of request array exist. Because, in front end side, we need to return all requests.
        but in solidity, there is no simple way to return struct array, therefor RequestArray mapping is needed.
    */
    mapping(string => Request[]) private requestsArray;
    mapping(address => Request) private requestsAddressArray;
    
    mapping(string => Group) public groups;
    mapping(address => Participant) public participants;

    mapping(address => uint) private depositCompoundPending;
    
    /// @notice  This split rates are hard-coded, but normally groups creator will decide to these proportions
    uint sudoSplitRateForGroup = 40;
    uint sudoSplitRateForCompound = 60;
    
    /// @notice  Let say this is compound contract address which we will deposit money
    address payable public compoundAddress = 0x877427CCBd3061Affd5c6518bc87799B9Cf3C408;
    
    event LogCreatedRequest(string _groupId, string _nameSurname, address _participantAddress);
    event LogCreatedGroup(string _groupId, uint numberOfMember, address _creator);
    event LogApprovedRequest(address _approverAddress, uint approvalCount);
    event LogAddedCandidateToGroup(address _memberAddress);
    event LogLendingTransaction(address _memberAddress, uint amountLended, uint groupBalance);
    event LogBorrowingTransaction(address _memberAddress, uint amountBorrowed, uint groupBalance);
    event LogPayDebtedBack(address _memberAddress, uint amountPayedBack, uint remainDebt, uint groupBalance);
    event LogWithdraw(address _memberAddress, uint withdrawedAmount, uint groupBalance);

    modifier checkGroupOpen(string memory _groupId) {
        require(groups[_groupId].isOpen == true, "Group is not exist");
        _;
    }
    
    modifier checkEnrolled(string memory _groupId) {
        require(groups[_groupId].members[msg.sender] == true, "You are not in this group");
        _;
    }
    
    /*
    @notice This function create a group with given parameters. First it checks that is there any group
    created with the same name. Because group's name are unique id. 
    After group is created, it adds msg.sender to group as a group member.
    
    @params _groupId and nameSurname will be come from front-end
    */
    function createGroup(string memory _groupId, string memory nameSurname)
    public
    {
        // check that is there any group with same name
        require(!groups[_groupId].isOpen,"group is already created");
        
        // Create a new group
        Group memory newGroup = Group({groupId: _groupId, creator: msg.sender, groupBalance: 0, isOpen: true, numberOfMember: 1, requestCount: 0});
        groups[_groupId] = newGroup;
        emit LogCreatedGroup(_groupId, groups[_groupId].numberOfMember, groups[_groupId].creator);

        // add msg.sender to group as a member
        groups[_groupId].members[msg.sender] = true;
        participants[msg.sender] = Participant(_groupId, msg.sender, nameSurname);
    }
    
    /*
    @notice This function allow members to leave from group. But it makes some controlls. 
    If a member has debt, this member cannot leave from group.
    If member has not debt, function check that whether member has lendedAmount or not in group. Then if there is, send it to member's address
    */
    function leaveGroup(string memory _groupId)
    public 
    checkEnrolled(_groupId)
    checkGroupOpen(_groupId)
    {
        // check that member has no debt
        require(groups[_groupId].borrowers[msg.sender] == 0, "You can not leave from group. You have debt");
        
        groups[_groupId].members[msg.sender] = false;
        groups[_groupId].numberOfMember -= 1;
        
        // get the amount member lended
        uint amountLended = groups[_groupId].depositGroupArray[msg.sender];
        
        // if lended amount is exist, send back to msg.sender
        if (amountLended > 0) {
            msg.sender.transfer(amountLended);
        }
    }
    
    /*
    @notice This function create a request to enrolling group. This request is created with given parameters.
    @params _groupId and _nameSurname is required parameters for enrolling
    @notice after request is created, voting process is begin.
    */
    function enroll(string memory _groupId, string memory _nameSurname) 
    public 
    checkGroupOpen(_groupId)
    {
        // check is already enrolled to group
        require(groups[_groupId].members[msg.sender] != true, "You are already in this group");
        
        // Create Request to enroll
        Request memory newRequest = Request({
            groupId: _groupId,
            nameSurname: _nameSurname,
            candidate: msg.sender,
            complete: false,
            approvalCount: 0,
            requestCount: 0
        });
        requestsArray[_groupId].push(newRequest);
        requestsAddressArray[msg.sender] = newRequest;
        groups[_groupId].requestCount += 1;
        
        emit LogCreatedRequest(_groupId, _nameSurname, msg.sender);
        
    }
    
    /*
    @notice Group's members can approve a request via this function. If 80% of group members voted as yes,
    then this member is added to group via calling and external function
    */
    function approveRequest(address _candidateAddress, string memory _groupId, uint _id) 
    public 
    {
        require(requestsAddressArray[_candidateAddress].complete == false);
        Request storage request = requestsAddressArray[_candidateAddress];
        
        
        // check that this member did not approve 
        require(!request.approvals[_candidateAddress]);
        
        request.approvals[msg.sender] == true;
        request.approvalCount += 1;
        requestsArray[_groupId][_id].approvalCount += 1;
        
        // if 80% of members approve that candidate can enroll, then add candidate to group
        if  ((groups[_groupId].numberOfMember * 80) / 100 < request.approvalCount) {
            addCandidateToGroup(_candidateAddress, _groupId, _id);
            request.approvalCount += 1;
            request.complete = true;
            requestsArray[_groupId][_id].complete = true;
            groups[_groupId].requestCount -= 1;
        }
        
        emit LogApprovedRequest(msg.sender, request.approvalCount);
        
    }
    
    /*
    @notice This function is a private function and it just can call from inside approveRequest function.
    */
    function addCandidateToGroup(address _memberAddress, string memory _groupId, uint _id) 
    private 
    {
        // adding the participant to group
        Request memory request = requestsArray[_groupId][_id];
        groups[request.groupId].members[_memberAddress] = true;
        groups[_groupId].numberOfMember += 1;
        
        participants[request.candidate] = Participant(request.groupId, request.candidate, request.nameSurname);
        groups[_groupId].members[msg.sender] = true;
        
        emit LogAddedCandidateToGroup(_memberAddress);
        
    }
    
    /*
    @notice This function allow members to lend their money according to lend and deposit rate identified from begin.
    it splits sent money two seperate value. 
    For group, it directly write it to group's balance and member lended amount array
    For compound, it write amount to pending array, after that user needs to call depositToCompound function to send money to compound
    */
    function lending(string memory _groupId) 
    public 
    payable
    checkEnrolled(_groupId) 
    checkGroupOpen(_groupId)
    {
        require(msg.value >= 0, "Please send a valid amount");
        
        uint amountForGroup = (msg.value * sudoSplitRateForGroup) / 100;
        uint amountForCompound = (msg.value * sudoSplitRateForCompound) / 100;
        
        groups[_groupId].groupBalance += amountForGroup;
        groups[_groupId].depositGroupArray[msg.sender] += amountForGroup;
        depositCompoundPending[msg.sender] += amountForCompound;
        
        emit LogLendingTransaction(msg.sender, msg.value, groups[_groupId].groupBalance);
        
    }
    
    /*
    @notice This function deposit money from pending array to compound. Before doing this,
    it check whether member has money in array or not
    */
    function depositToCompound(string memory _groupId) 
    public 
    payable
    checkEnrolled(_groupId) 
    checkGroupOpen(_groupId)
    {
        uint amountForCompound = depositCompoundPending[msg.sender];
        depositCompoundPending[msg.sender] -= amountForCompound;
        groups[_groupId].depositCompoundArray[msg.sender] += amountForCompound;
        
        address(compoundAddress).transfer(amountForCompound);
        
    }
    
    /*
    @notice This function allow members to borrow moeny from group. 
    First it checks that group has enough balance, then it sends money to member
    */
    function borrowing(string memory _groupId) 
    public 
    payable
    checkEnrolled(_groupId)
    checkGroupOpen(_groupId)
    {
        // check is there enough amount
        require(groups[_groupId].groupBalance >= msg.value, "There is no enough balance");

        // firstly, substrack group balance  
        groups[_groupId].groupBalance -= msg.value;
        
        // add the member to borrowers
        groups[_groupId].borrowers[msg.sender] += msg.value;
        
        // Transfer the value to msg.sender
        address(msg.sender).transfer(msg.value);
        
        emit LogBorrowingTransaction(msg.sender, msg.value, groups[_groupId].groupBalance);
        
    }
    
    /*
    @notice This function allow members to pey their debt back. It behave according to sent value
    If value is lower than debt, it substrack the value from borrower array for msg.sender and add this value to group balance.
    If value is higher than debt, it substrack the value from borrowers array for msg.sender and write the exceeds amount to lenders array for msg.sender
    */
    function payDebtBack(string memory _groupId)
    public
    payable
    checkEnrolled(_groupId)
    checkGroupOpen(_groupId)
    returns(uint)
    {
        uint debt = groups[_groupId].borrowers[msg.sender];
        
        // check member has debt
        require(debt != 0, "you do not have debt");
        
        if (msg.value <= debt) {
            // for example:  debt = 100,  amount = 50
            groups[_groupId].groupBalance += msg.value;
            groups[_groupId].borrowers[msg.sender] -= msg.value;

            debt -= msg.value;
            
            emit LogPayDebtedBack(msg.sender, msg.value, debt, groups[_groupId].groupBalance);

            return debt;
            
        }else {
            // for example:  debt = 100,  amount = 150
        
            groups[_groupId].groupBalance += msg.value;
            groups[_groupId].borrowers[msg.sender] = 0;
            
            // make debt of this member 0        
            debt = 0;
            
            // lend amount exceed the debt to group
            msg.sender.transfer(msg.value - debt);
            
            emit LogPayDebtedBack(msg.sender, msg.value, debt, groups[_groupId].groupBalance);
            
            return debt;
        }
        
    }
    
    /*
    @notice This function allow members to withdraw all amount lended. 
    */
    function withdraw(string memory _groupId)
    public
    payable
    checkEnrolled(_groupId)
    checkGroupOpen(_groupId)
    returns(uint)
    {
        uint debt = groups[_groupId].borrowers[msg.sender];
        // check member has debt
        require(debt == 0, "you have debt");

        uint lendedAmount = groups[_groupId].depositGroupArray[msg.sender];
        require(lendedAmount != 0, "You do not have lended money");
        require(groups[_groupId].groupBalance >= msg.value, "There is no enough balance");
        
        groups[_groupId].depositGroupArray[msg.sender] -= msg.value;
        groups[_groupId].groupBalance -= msg.value;
        
        msg.sender.transfer(msg.value);
        
        emit LogWithdraw(msg.sender, msg.value, groups[_groupId].groupBalance);
        
        return lendedAmount;
    }
    
    
    function checkParticipant(string memory _groupId)
    public 
    view 
    checkGroupOpen(_groupId)
    returns(bool) 
    {
        return groups[_groupId].members[msg.sender];
    }
    
    function checkGroupBalance(string memory _groupId)
    public 
    view 
    checkGroupOpen(_groupId)
    returns(uint) 
    {
        return groups[_groupId].groupBalance;
    }

    function checkGroup(string memory _groupId)
    public 
    view
    returns(string memory) 
    {
        return groups[_groupId].groupId;
    }
    
    function checkMemberDebtStatus(string memory _groupId)
    public 
    view 
    checkGroupOpen(_groupId)
    returns(uint, uint, uint) 
    {
        return (uint(groups[_groupId].borrowers[msg.sender]), uint(groups[_groupId].depositGroupArray[msg.sender]), uint(groups[_groupId].depositCompoundArray[msg.sender]));
    }

    function getRequest(string memory _groupId, uint _id) 
    public 
    view 
    returns(string memory, address, bool, uint) {
        return (requestsArray[_groupId][_id].nameSurname, requestsArray[_groupId][_id].candidate, requestsArray[_groupId][_id].complete, requestsArray[_groupId][_id].approvalCount);
    }
    
    function getRequestArrayLength(string memory _groupId) 
    public 
    view 
    returns(uint) {
        return (requestsArray[_groupId].length);
    }
    
    function getDepositPending(address _memberAddress) 
    public 
    view 
    returns(uint) {
        return (depositCompoundPending[_memberAddress]);
    }
    
}
