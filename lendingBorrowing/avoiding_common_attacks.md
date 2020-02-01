# Avoided Attacks

## Re-entracy Attacks (SWC-107)
In this project borrowing function would has a bug which cause a common attack. Firstly, if code would be like below,

```
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
```
a malicious user would attack to contract. Because, after sending money to member, we are adding value to borrow array.
This bad practice for security. The appropirate code must be like this;

```
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
```

After addinng value to borrowers, we should send money to member.


