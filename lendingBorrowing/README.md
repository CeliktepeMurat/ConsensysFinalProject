# Lending and Borrowing Platform

## INTRODUCTION
This a lending and borrowing platform which people can lend or borrow money from their friends, family or even co-workers with no collateral. 
There are few project around this concept which are compound, MakerDAO etc. But they are public and based on none-collateralization.

This can be a bit painfull for people who has little budget (students, young people etc.) and unfamiliar with blockchain world. There should be a system that a person may lend money and borrow whenever needed. When a person lends money, getting interest rate will be another motivation. 

If there would be user-friendly platform and system that people would lend their money to their friends through contract, that would be attractive for them

## High-Level Solution
My project comes with private groups and non-collateralization system. In the system, anyone may be able to create a group and invite anyone. Groups will be private and enrolling will be a request-vote based system. The reason of this, if member of groups confirm a person to enroll group, they trust him or her. This trust is collateralization of the group.

If 80% of group member confirm a person to enroll, this person will be added to group. A person should send minimum amount that identified while group creation from creator. 

Each group has own balance and this balance will be invested compound. Interest income that earned from compound, will be allocated between group member according to their lending rate. 

Two type of lending will be considered. One of them is will invest to compound, another is will stay inside the contract to be borrowed. When someone wants to lend amount, the amount of this person will split. The proportion wil be specified from creator at beginning. For example, let say that the proportion of amount to invest is 70%. When someone wants to lend money, the 70% of money will invest to compound and 30% of money will stay inside the contract. 
Everybody will be able to borrow money according to their lending amount. The proportions may be identified differently.

## FUTURE TO-DO
The contract does not handle some situations that mentioned above.
- The first one is, splitting lended money two seperate portion is hard-coded. Normally, creator of group will decide to these rates.

- Another thing is, contract has not any function to handle interest rate, calculate the interest rate and share according to proportion of lended amounts. This feature did not implemented because, a stable coin will be implemented to this project, so after the stable coin implementation, the function will be added.

## IMPROVEMENTS
- A better user interface
- A better moduler contract design
- Import a stable coin into the contract instead of ether (like DAI, Tether etc.)
- Gamification would make this contract super excited. For example, if a debt is payed back early, borrowing limit would be higher.



## INSTALLATION

### Getting Started
You can download this all repository from this github page and run on your on local machine. 

### Requirements
- NodeJs
- Truffle
- Ganache-cli
- git
- Metamask

### Install
```
npm install nodejs
npm install truffle
npm install ganache-cli -g
```
For installing metamask, search 'metamask chrome extension' on google and install, then create a wallet

> For windows users, please download a linux virtual machine and run on it

### Clone
```
git clone https://github.com/CeliktepeMurat/ConsensysFinalProject.git
cd lendinBorrowing
```

Then open two terminal window
In the first window (in lendingBorrowing directory), run followed command
```
truffle develop
compile
migrate
```
In the Second window (in client directory), run followed command
```
cd client
npm install
npm run start
```
Before using platform, metamask should be adjusted. 
#### Metamask Installation and Setting Up
- Click metamask icon on the browser(Chrome recommended)
- In order to connect our local truffle network, click the networks dropdown list (on the top right)
- Then click the localhost 8545
- Then just required thing is getting a few account from truffle to interact with contract
- Go to first terminal window (truffle development terminal)
- You will see, truffle will come with 10 accounts(with their private key)
- Copy one of the private key from terminal and go to metamask
- On the top right (beside the networks dropdown), there is circle icon, click on it
- Then click the "get account" option
- After that paste your copied private key there and this account will be added to metamask
- For testing purposes, you need to add at least two account from turffle via following steps above


Now, you are ready to interact with contract via ui


> ### **Important Note: Each time you change your metamask account, you have to refresh the page!**


### Creating a Group

> ***Group is a kind of private concepts in this project. Everybody can create a group and invite their friend.*** 

- In order to create a group, click the 'Create Group' button and go to Group creation page
- Group name and your name-surname is enough to creation
- If you click the 'create' button, a metamask pop up will come up and it will ask to confirm transaction
- When you confirm, group will be successfully created

### Interact with group 
- Type your group name to search bar and it will come up with some detail
- Click the 'view more details' button to go group profile page
- Here is where will we make all things releated to group

### Group Profile Page
In this page, there are 5 functionalities which you can do;
1. Confirm or reject requests
2. Lending
3. Borrowing
4. Pay debt back
5. withdraw


## Testing
In order to run tests, these steps need to followed;

1. Open two terminal, in the first one write the
```
ganache-cli -l 7000000
```
> ***Before run tests, please check that your server is started on which port. According to this port, go to truffle-config.js and change the port number.***

2. In the second terminal, go to "lendingBorrowing/" directory and just type,
```
truffle test
```


