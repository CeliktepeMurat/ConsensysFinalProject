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


# Fail early and fail loud

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

# Future Design Patterns

***Withdrawal desing pattern*** can be implemented when contract acts like that. If anyone wants to borrow some money, this would be
a request and everybody vote this request. If voting is completed there would be a function called sendMoney or withdraw, in this function payment process would become.
In this scenerio, withdrawal design pattern would be implemented and it would work perfectly.















