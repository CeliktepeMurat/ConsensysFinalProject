import React, { Component } from "react";
import "./css/App.css";
import lendingBorrowing from "./contracts/lendingBorrowing.json";
import getWeb3 from "./getWeb3";
import { Container, Menu, Input, Button, Card, Form,} from 'semantic-ui-react'
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

  enterGroup = async () => {
    const contract = this.state.contract;
    const groupName = this.state.groupName;
    const defaultAccount = this.state.account;

    await contract.methods.enroll(groupName, defaultAccount, )

  }

  leaveGroup = async () => {
    let contract = this.props.location.contract;
    const groupName = this.state.groupName;
    const defaultAccount = this.state.account;
    
    if (contract === undefined) {
      contract = this.state.contract
    }

    await contract.methods.leaveGroup(groupName).send({from: defaultAccount});
    this.checkEnrolled(defaultAccount, groupName);
    
    this.getGroup();
  }

  checkEnrolled = async (account, groupName) => {
    let contract = this.props.location.contract;
    if (contract === undefined) {
      contract = this.state.contract
    }

    const isEnrolled = await contract.methods.checkParticipant(groupName).call({from: account});
    this.setState({
      isEnrolled: isEnrolled
    })

  }
    
    getGroup = async () =>  {

      let contract = this.props.location.contract;
      let accounts = this.props.location.accounts;

      if (contract === undefined) {
        contract = this.state.contract
        accounts = this.state.accounts
      }

      const group = await contract.methods.getGroup(this.state.searchString).call({from: accounts[0]});
      
      this.checkEnrolled(this.state.account, this.state.searchString);

      if (group[0] === "") {
        this.setState({
          groupName: "",
          creator: "",
          numberOfMember: "",
          isOpen: "",
          account: accounts[0],
          
        })
      } else {
        this.setState({
          groupName: group[0],
          creator: group[1],
          isOpen: group[2],
          numberOfMember: group[3],
          account: accounts[0],
        })
      }
    }

    handleSearchInput = (event) => {
      const value = event.target.value;
      this.setState({
        searchString: value
      })
    }
    handleAddressInput = (event) => {
      const value = event.target.value;
      this.setState({
        account: value
      })
    }
    

    routeChange = ()=> {
      let path = `./CreateGroup`;
      let path2 = `./GroupProfile`
      let history = useHistory();
      history.push(path);
      history.push(path2);
    }

  render() {
    let button1;
    let button2;

    const isEnrolled = this.state.isEnrolled;
    
    if (!isEnrolled && this.state.isOpen === true) {
      button1 = 
              <Form onSubmit={this.createGroup} className="Form">
                <Form.Group>
                  <Form.Input className="formInput" label='Group Name' placeholder='Enter Group Name' />
                </Form.Group>
                <Form.Group>
                <Form.Input className="formInput" label='Name and Surname' placeholder='Enter Your Name and Surname' />
                </Form.Group>
           
                <Form.Checkbox label='I agree to the Terms and Conditions' />
                <Button className="detailsButton" onClick={() => {this.enterGroup()}} inverted color='green'>{this.state.enterGroupText}</Button>                
              </Form>

    } 
    else if (isEnrolled && this.state.isOpen === true) {
      button2 = <Form className="detailsButton">
                  <Form.Group>
                    <Button className="leaveGroupButton" onClick={() => {this.leaveGroup()}} inverted color='red'>{this.state.leaveGroupText}</Button>
                    <Link to={{
                      pathname:"./GroupProfile",
                      contract: this.state.contract,
                      web3: this.state.web3,
                      account: this.state.account,
                      groupName: this.state.groupName,
                      
                    }}
                      className="moreDetailsButton">View Group Profile</Link>
                  </Form.Group>
                </Form>
    }
    else if(this.state.isOpen === "") {
      button1 = <Card>
                <Card.Content
                  description="No group founded"
                />
              </Card>
      
    }
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "100%"}}>
                <Input style={{marginRight: 10}} onChange={this.handleSearchInput} className='icon' placeholder='Search Group' />
                <Input style={{marginRight: 10}} onChange={this.handleAddressInput} className='icon' placeholder='Enter Your Address' />
                <Button style={{height: 35, width: "30%"}} color='blue' onClick={() => {this.getGroup()}}>Get Group</Button>
         
                <Link to={{
                  pathname:"./CreateGroup",
                  contract: this.state.contract,
                  web3: this.state.web3,
                  accounts: this.state.accounts
                  
                }}
                  className="createGroupButton">Create Group</Link>
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
