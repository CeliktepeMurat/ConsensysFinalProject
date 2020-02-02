# Design Patterns

## Circuit Breakers

This project has 2 circuit breakers which is called "modifier".

1. In order to check a group is exist or in other saying, check that group is open

```
modifier checkGroupOpen(string memory _groupId) {
  require(groups[_groupId].isOpen == true, "Group is not exist");
  _;
}
```

This check groups mapping with given id, whether group is still open or not. This is because when someone wants to enroll a group, contract
should be able to sure that group is exist.

2. In order to check that a person is in a spesicif group or not.

```
modifier checkEnrolled(string memory _groupId) {
  require(participants[msg.sender].enrolledGroup[_groupId] == true, "You are not in this group");
  _;
}
```

This modifier is used in all group's function to be sure that there is no any mistake when a person try to make something to group. This
modifier ensures that just member of group can use group's function.


## State Machine
In this contract, Request process has a state issue. When a request is created, the state of this request is assign to onVoting. 
```
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
            approvalCount: 0,
            requestCount: 0,
            requestState: RequestState.onVoting  // here assinging state to onVoting
        });
        requestsArray[_groupId].push(newRequest);
        requestsAddressArray[msg.sender] = newRequest;
        groups[_groupId].requestCount += 1;
        
        emit LogCreatedRequest(_groupId, _nameSurname, msg.sender);
        
    }
```
After request is end, it is assigning to resolved state. This is because when a request is ended, stop the voting process for this person. In the approve request function, it is checking request state from the beginning.
```
function approveRequest(address _candidateAddress, string memory _groupId, uint _id) 
    public 
    {
        // check that request is on voting //
        require(requestsAddressArray[_candidateAddress].requestState == RequestState.onVoting, "Request is resolved");
        
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
            request.requestState = RequestState.resolved;
            requestsArray[_groupId][_id].requestState = RequestState.resolved;
            groups[_groupId].requestCount -= 1;
        }
        
        emit LogApprovedRequest(msg.sender, request.approvalCount);
        
    }
```


## Fail early and fail loud

Require statements are so important for a function. These are provide us controlling on a function to behave as we expected. Also, when a bug or condition is not provided, it stops the function. 

In this project there is a lot require statements. Some of them are;

```
require(groups[_groupId].borrowers[msg.sender] == 0, "You can not leave from group. You have debt");
```
This controls that if a member wants to leave from group, if this member has debt, it does not allow.

```
require(msg.value >= 0, "Please send a valid amount");
```
This code statement ensures that anyone cannot send amount below 0 to contract
















