# Lending and Borrowing Platform

## INTRODUCTION
This a lending and borrowing platform which people can lend or borrow money from their friends, family or even co-workers with non-collaterilization. 
There are few project around this concept which are compound, MakerDAO etc. But they are public and based on collateralization.

This can be a bit painfull for people who has little budget (students, young people etc.) and unfamiliar with blockchain world. There should be a system that a person may lend money and borrow whenever needed. When a person lends money, getting interest rate will be another motivation. 

If there would be user-friendly platform and system that people would lend their money to their friends through contract, that would be attractive for them

## High-Level Solution
My project comes with private groups and non-collateralization system. In the system, anyone may be able to create a group and invite anyone. Groups will be private and enrolling will be a request-vote based system. The reason of this, if member of groups confirm a person to enroll group, they trust each other. This trust is collateralization of the group.

Every member can lend money to group and if anyone borrows this lended money, member starts to earn interest. This interest rate is identified from beginning by group creator but it can change through voting. This system allows people who have little budget and unfamiliar about blockchain lend and borrow money among their own circle. Esspecially, this system works well among students. Platform's interface is so simple and anyone can interact easily. Then if a group member needs a money, no more a banking lending with high interest rate is needed. He or she can borrow money from group.  

If 80% of group member confirm a person to enroll, this person will be added to group. A person should send minimum amount that identified while group creation from creator. 

This feature is not implemented yet, but when a group member lends money, as long as this money is not borrowed, member can deposit this money to Compound Finance to earn interest rate even money is not lended. This process will not be hard to do because of interface desing and web3 library. Anybody will easily deposit money to Compound Finance via a button. 



## FUTURE TO-DO
The contract does not handle some situations that mentioned above.
- The first one is, there is no function to handle deposit money to Compound Finance, it will be implemented soon. For this issue, firstly a decesion would be certain. The thing is deciding peer-to-peer lending borrowing or using this contract as a pool. 

- Another thing is, contract has not any function to handle interest rate, calculate the interest rate and share according to proportion of lended amounts. This feature did not implement because, a stable coin is not exist in this project, so after the stable coin implementation, the function will be added.

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

**Group Functions Video:**  https://www.dropbox.com/s/3no7hgwgxqosk59/groupFunctions.mov?dl=0

**Request Function Video:** https://www.dropbox.com/s/9a508gcrst73jsx/requestFunction.mov?dl=0

### Creating a Group

> ***Group is a kind of private concepts in this project. Everybody can create a group and invite their friend.*** 

<img width="1142" alt="Ekran Resmi 2020-02-02 18 42 50" src="https://user-images.githubusercontent.com/26026913/73610755-e338c100-45eb-11ea-9da8-d0d4fbcf7a2c.png">

- In order to create a group, click the 'Create Group' button and go to Group creation page
- Group name and your name-surname is enough to creation
- If you click the 'create' button, a metamask pop up will come up and it will ask to confirm transaction
- When you confirm, group will be successfully created

### Interact with group 

<img width="941" alt="Ekran Resmi 2020-02-02 18 21 07" src="https://user-images.githubusercontent.com/26026913/73610594-2eea6b00-45ea-11ea-9b39-1dbdbb7772cb.png">

- Type your group name to search bar and it will come up with some detail
- Click the 'view more details' button to go group profile page
- Here is where will we make all things releated to group

### Group Profile Page
<img width="1138" alt="Ekran Resmi 2020-02-02 18 22 31" src="https://user-images.githubusercontent.com/26026913/73610762-fba8db80-45eb-11ea-8fc3-02c4083cca8e.png">
In this page, there are 5 functionalities which you can do;

1. Confirm or reject requests
<img width="1144" alt="Ekran Resmi 2020-02-02 18 23 23" src="https://user-images.githubusercontent.com/26026913/73610767-06fc0700-45ec-11ea-8301-770b2b8ea766.png">
2. Lending
<img width="1144" alt="Ekran Resmi 2020-02-02 18 24 12" src="https://user-images.githubusercontent.com/26026913/73610771-14b18c80-45ec-11ea-9d0a-79a98cf65d96.png">
3. Borrowing
<img width="1144" alt="Ekran Resmi 2020-02-02 18 24 27" src="https://user-images.githubusercontent.com/26026913/73610774-1da25e00-45ec-11ea-9e9c-efcedd1576b6.png">
4. Pay debt back
<img width="1144" alt="Ekran Resmi 2020-02-02 18 24 45" src="https://user-images.githubusercontent.com/26026913/73610779-272bc600-45ec-11ea-93ea-f8b32a1ac9ce.png">
5. withdraw
<img width="1144" alt="Ekran Resmi 2020-02-02 18 24 52" src="https://user-images.githubusercontent.com/26026913/73610783-314dc480-45ec-11ea-9358-a6c995ed5133.png">


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

## Security Analysis

As security analysis tools, 'MythX' is used. In order to run this analysis test follow the steps below.


In the lendingBorrowing file directory
```
npm install -g truffle-security
```
Then open the truffle-config.js file and add this line
```
plugins: [ "truffle-security" ]
```
Finally truffle-config.js file should look like this;
```
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  plugins: [ "truffle-security" ],
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      gas: 7000000,
      network_id: "*" // Match any network id
    },
    solc: {
      optimizer: {
          enabled: true,
          runs: 200
      }
  }
  },
};
```

After all this step, ın the lendingBorrowing directory, run the followed command
```
truffle run verify
```

It will analyze the contract, then return the vulnerabilities if there are.






