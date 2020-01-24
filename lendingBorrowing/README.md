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
Metamask -> Search metamask chrome extension on google and install, then create a wallet
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
Before using platform, metamask should be adjusted. In order to do that 
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





