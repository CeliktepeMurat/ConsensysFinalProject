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

