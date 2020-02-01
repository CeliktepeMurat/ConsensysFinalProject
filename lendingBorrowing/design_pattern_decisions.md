# Design Pattern Requirements

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


## Withdrawal Design Pattern
In this contract, lending process has a desing pattern to handle with some bugs. Lending function is like that;
```
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
```
Here sended amount is splitting two seperate value. Amount to deposit compound is writed to a pending mapping. After that there is another function to deposit;

```
function depositToCompound(string memory _groupId) 
    public 
    payable
    checkEnrolled(_groupId) 
    checkGroupOpen(_groupId)
    {
        require(depositCompoundPending[msg.sender] != 0, "you do not have amount to deposit");
        uint amountForCompound = depositCompoundPending[msg.sender];
        
        groups[_groupId].depositCompoundArray[msg.sender] += amountForCompound;
        
        address(compoundAddress).transfer(amountForCompound);
        
    }
```

This function first look at that is there a amount in pending mapping then read the pending value and deposit it to compound. This way is more secure against to bug or vulnerable transactions. 


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

## Future Design Patterns

***Withdrawal desing pattern*** can be implemented when contract acts like that. If anyone wants to borrow some money, this would be
a request and everybody vote this request. If voting is completed there would be a function called sendMoney or withdraw, in this function payment process would become.
In this scenerio, withdrawal design pattern would be implemented and it would work perfectly.















