# Lending and Borrowing Platform
This a lending and borrowing platform which run on ethereum network

## Getting Started
You can download this all repository from this github page and run on your on local machine. 

### Requirements
- NodeJs
- Truffle
- git
- Metamask

### Install
```
npm install nodejs
npm install truffle
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


> ## **Important Note: Each time you change your metamask account, you have to refresh the page!**


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
- 

