import React, { Component } from "react";
import "./css/App.css";
import lendingBorrowing from "./contracts/lendingBorrowing.json";
import getWeb3 from "./getWeb3";
import { Container, Menu, Input, Button, Card} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'


class App extends Component {

  state = {
    groupName: "",
    creator: "",
    isOpen: "",
    numberOfMember: "",
    enterGroupText: "Enter the group",
    leaveGroupText: "Leave from Group",
    isEnrolled: "",


    // titles
    groupNameTitle: "Group Name: ",
    groupCreatorTitle: "Group Creator: ",
    statusTitle: "Status: ",
    numberofmemberTitle: "Number of Member: ",

    // web3
    accounts: null,
    contract: null,
    web3: null,

    //search
    searchString: "",
    errorMessage: "No Group founded",

    // current user
    account: null

}
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = lendingBorrowing.networks[networkId];
      const instance = new web3.eth.Contract(
        lendingBorrowing.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance,});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error);
    }

  };
/* 
  createGroup = async () =>  {
    const { accounts, contract } = this.state;
      
    await contract.methods.createGroup("group1", "murat").send({
        from: accounts[0],
        gas: 3000000
    })
  } */

  leaveGroup = async () => {
    const contract = this.state.contract;
    const groupName = this.state.groupName;
    const defaultAccount = this.state.account;

    await contract.methods.leaveGroup(groupName).send({from: defaultAccount});
    this.checkEnrolled(defaultAccount, groupName);
    
    console.log(this.state.isEnrolled);
    
  }

    checkEnrolled = async (account, groupName) => {
      const contract = this.state.contract;

      const isEnrolled = await contract.methods.checkParticipant(groupName).call({from: account});
      this.setState({
        isEnrolled: isEnrolled
      })

    }
    
    getGroup = async () =>  {
      const accounts = this.state.accounts;
      const contract = this.state.contract;

      const defaultAccount = accounts[0]; 

      const group = await contract.methods.getGroup(this.state.searchString).call({from: defaultAccount});

      
      this.checkEnrolled(defaultAccount, this.state.searchString);

      if (group[0] === "") {
        this.setState({
          groupName: "",
          creator: "",
          numberOfMember: "",
          isOpen: "",
          account: defaultAccount,
        })
      } else {
        this.setState({
          groupName: group[0],
          creator: group[1],
          isOpen: group[2],
          numberOfMember: group[3],
          account: defaultAccount,
        })
      }
    }

    handleInputChange = (event) => {
      const value = event.target.value;
      this.setState({
        searchString: value
      })
      
    }

    routeChange = ()=> {
      let path = `./CreateGroup`;
      let history = useHistory();
      history.push(path);
    }

  render() {
    let button1;
    let button2;

    const isEnrolled = this.state.isEnrolled;
    
    if (!isEnrolled && this.state.isOpen === true) {
      button1 = <Card className="detailsButton">
                <Button inverted color='green'>{this.state.enterGroupText}</Button>
              </Card>
    } 
    else if (isEnrolled && this.state.isOpen === true) {
      button2 = <Card className="detailsButton">
                  <Button onClick={() => {this.leaveGroup()}} inverted color='red'>{this.state.leaveGroupText}</Button>
                </Card>
    }
    else if(this.state.isOpen === "") {
      button1 = <Card className="detailsButton">
                <Card.Content
                  description="No group founded"
                />
              </Card>
      
    }
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "40%"}}>
                <Input style={{marginRight: 10}} onChange={this.handleInputChange} className='icon' placeholder='Search Group' />
                <Button style={{height: 35, width: "100%"}} color='blue' onClick={() => {this.getGroup()}}>Get Group</Button>
                </Menu.Item>
                <Menu.Item position='right'>
                <Link to="./CreateGroup" className="createGroupButton">Create Group</Link>
                </Menu.Item>
            </Menu>
          </div>

          <div className="cardBody">
            <Card.Group itemsPerRow={2} centered>
              <Card>
                <Card.Content
                  header={this.state.groupNameTitle}
                  description={this.state.groupName}
                />
              </Card>

              <Card>
                <Card.Content
                  header={this.state.groupCreatorTitle}
                  description={this.state.creator}
                />
              </Card>

              <Card>
                <Card.Content
                  header={this.state.statusTitle}
                  description={String(this.state.isOpen)}
                />
              </Card>

              <Card>
                <Card.Content
                  header={this.state.numberofmemberTitle}
                  description={this.state.numberOfMember}
                />
              </Card>

              {button1}
              {button2}
            </Card.Group>
          </div> 

        </Container>
      
    );
  }
}

export default App;
