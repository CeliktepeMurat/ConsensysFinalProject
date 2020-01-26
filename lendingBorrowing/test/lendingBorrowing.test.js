const lendingBorrowing = artifacts.require("./lendingBorrowing.sol");

contract("lendingBorrowing", accounts => {

    const alice = accounts[0]
    const bob = accounts[1]
    const charlie = accounts[2]
    const groupName = "group1"

    let instance;

    beforeEach(async () => {
        instance = await lendingBorrowing.new();
    })

  it("it should create a group", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});
    
    let checkedGroupName = await instance.checkGroup.call(groupName);

    assert.equal(checkedGroupName, groupName, "Group not found");
  });


  it("it should create a request to enroll a group", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});
    await instance.enroll(groupName, "bob", { from: bob});
    
    let request = await instance.getRequest.call(groupName, 0);

    assert.equal(request[0], "bob", "request not found");
  });

  it("it should approve a request", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});
    await instance.enroll(groupName, "bob", { from: bob});

    await instance.approveRequest(bob, groupName, 0, {from: alice})
    
    let isEnrolled = await instance.checkParticipant.call(groupName);

    assert.equal(isEnrolled, true, "Request is not approved");
  });

  it("it should lend", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});

    await instance.lending(groupName, {from: alice, value: 1000})

    let lendedAmount = await instance.checkMemberDebtStatus.call(groupName);

    assert.equal(lendedAmount[1], 1000, "Lending process is failed.");
  });

  it("it should borrow", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});

    await instance.lending(groupName, {from: alice, value: 1000})
    await instance.borrowing(groupName, {from: alice, value: 500})

    let borrowedAmount = await instance.checkMemberDebtStatus.call(groupName);

    assert.equal(borrowedAmount[0], 500, "Borrowing process is failed.");
  });

  it("it should pay debt back", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});

    await instance.lending(groupName, {from: alice, value: 1000})
    await instance.borrowing(groupName, {from: alice, value: 500})

    await instance.payDebtBack(groupName, {from: alice, value: 100})

    let borrowedAmount = await instance.checkMemberDebtStatus.call(groupName);

    assert.equal(borrowedAmount[0], 400, "pay debt back process is failed.");
  });

  it("it should withdraw", async () => {

    await instance.createGroup(groupName, "alice", { from: alice});

    await instance.lending(groupName, {from: alice, value: 1000})

    let beforeWithdraw = await instance.checkGroupBalance.call(groupName);

    await instance.withdraw(groupName, {from: alice, value: 1000})

    let afterWithdraw = await instance.checkGroupBalance.call(groupName);

    assert.equal(afterWithdraw, (beforeWithdraw - 1000), "withdraw process is failed.");
  });

});
