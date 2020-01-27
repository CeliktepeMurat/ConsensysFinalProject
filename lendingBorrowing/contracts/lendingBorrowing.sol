pragma solidity ^0.5.11;

/**************************************************************
                    MAIN CONTRACT
***************************************************************/

contract lendingBorrowing {
    
    struct Participant {
        string groupNo;
        address memberAddress;
        string nameSurname;
        mapping(string => bool) enrolledGroup;
    }   
    
    struct Group {
        string groupId;
        address creator;
        uint groupBalance;
        bool isOpen;
        uint numberOfMember;
        uint requestCount;
        
        mapping(address => bool) members;
        mapping(address => uint) lenders;
        mapping(address => uint) borrowers;
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

    mapping(string => Request[]) requestsArray;
    mapping(string => Request) requests;
    mapping(address => Request) requestsAddressArray;
    
    mapping(string => Group) public groups;
    mapping(address => Participant) participants;
    
    
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
        require(participants[msg.sender].enrolledGroup[_groupId] == true, "You are not in this group");
        _;
    }
    
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
        participants[msg.sender].enrolledGroup[_groupId] = true;
    }
    
    function leaveGroup(string memory _groupId)
    public 
    checkEnrolled(_groupId)
    checkGroupOpen(_groupId)
    {
        // check that member has no debt
        require(groups[_groupId].borrowers[msg.sender] == 0, "You can not leave from group. You have debt");
        
        participants[msg.sender].enrolledGroup[_groupId] = false;
        groups[_groupId].members[msg.sender] = false;
        groups[_groupId].numberOfMember -= 1;
        
        // get the amount member lended
        uint amountLended = groups[_groupId].lenders[msg.sender];
        
        // if lended amount is exist, send back to msg.sender
        if (amountLended > 0) {
            msg.sender.transfer(amountLended);
        }
    }
    
    
    function enroll(string memory _groupId, string memory _nameSurname) 
    public 
    checkGroupOpen(_groupId)
    {
        // check is already enrolled to group
        require(participants[msg.sender].enrolledGroup[_groupId] != true, "You are already in this group");
        
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
        requests[_groupId] = newRequest;
        requestsAddressArray[msg.sender] = newRequest;
        groups[_groupId].requestCount += 1;
        
        emit LogCreatedRequest(_groupId, _nameSurname, msg.sender);
        
    }
    
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
            addCandidateToGroup(_candidateAddress, _groupId);
            request.approvalCount += 1;
            request.complete = true;
            requestsArray[_groupId][_id].complete = true;
            groups[_groupId].requestCount -= 1;
            participants[_candidateAddress].enrolledGroup[_groupId] = true;
        }
        
        emit LogApprovedRequest(msg.sender, request.approvalCount);
        
    }
    
    function addCandidateToGroup(address _memberAddress, string memory _groupId) 
    private 
    {
        // adding the participant to group
        Request memory request = requests[_groupId];
        groups[request.groupId].members[_memberAddress] = true;
        groups[_groupId].numberOfMember += 1;
        
        participants[request.candidate] = Participant(request.groupId, request.candidate, request.nameSurname);
        participants[request.candidate].enrolledGroup[request.groupId] = true;
        
        emit LogAddedCandidateToGroup(_memberAddress);
        
    }
    
    function lending(string memory _groupId) 
    public 
    payable
    checkEnrolled(_groupId) 
    checkGroupOpen(_groupId)
    {
        require(msg.value >= 0, "Please send a valid amount");
        
        groups[_groupId].lenders[msg.sender] += msg.value;
        groups[_groupId].groupBalance += msg.value;
        
        emit LogLendingTransaction(msg.sender, msg.value, groups[_groupId].groupBalance);
        
    }
    
    
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
        
        // Transfer the value to msg.sender
        address(msg.sender).transfer(msg.value);
        
        // add the member to borrowers
        groups[_groupId].borrowers[msg.sender] += msg.value;
        
        emit LogBorrowingTransaction(msg.sender, msg.value, groups[_groupId].groupBalance);
        
    }
    
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

        uint lendedAmount = groups[_groupId].lenders[msg.sender];
        require(lendedAmount != 0, "You do not have lended money");
        require(groups[_groupId].groupBalance >= msg.value, "There is no enough balance");
        
        groups[_groupId].lenders[msg.sender] -= msg.value;
        groups[_groupId].groupBalance -= msg.value;
        
        msg.sender.transfer(msg.value);
        
        emit LogWithdraw(msg.sender, msg.value, groups[_groupId].groupBalance);
        
        return lendedAmount;
    }
    
    
    function checkParticipant(string memory _groupId)
    public 
    view 
    returns(bool) 
    {
        require(groups[_groupId].isOpen);
        return participants[msg.sender].enrolledGroup[_groupId];
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

    function getGroup(string memory _groupId) 
    public 
    view 
    returns(string memory, address, bool, uint, uint) {
        return (groups[_groupId].groupId, groups[_groupId].creator, groups[_groupId].isOpen, groups[_groupId].numberOfMember, groups[_groupId].requestCount);
    }

    function checkMemberDebtStatus(string memory _groupId)
    public 
    view 
    checkGroupOpen(_groupId)
    returns(uint, uint) 
    {
        return (groups[_groupId].borrowers[msg.sender], groups[_groupId].lenders[msg.sender]);
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
    
}
