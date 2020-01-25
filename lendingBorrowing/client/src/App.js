import React, { Component } from "react";
import "./css/App.css";
import lendingBorrowing from "./contracts/lendingBorrowing.json";
import getWeb3 from "./getWeb3";
import { Container, Menu, Input, Button, Card, Form, Message} from 'semantic-ui-react'
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
    contract: null,
    web3: null,

    //search
    searchString: "",
    errorMessage: "No Group founded",

    // current user
    account: this.props.location.account,

    // User
    nameSurname: "",

    isSentRequest: false,

}
  
  componentDidMount = async () => {
    try {

      let contract = this.props.location.contract;
      let account = this.props.location.account;
      let web3 = this.props.location.web3;

      if (contract === undefined && web3 === undefined && account === undefined) {
        // Get network provider and web3 instance.
        web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        account = await web3.eth.getAccounts();
        
        

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = lendingBorrowing.networks[networkId];
        contract = new web3.eth.Contract(
          lendingBorrowing.abi,
          deployedNetwork && deployedNetwork.address,
        );
        this.setState({ web3, account: account[0], contract: contract});
      } else {

        this.setState({ web3: web3, account: account, contract: contract,});
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error);
    }

  };

  enterGroup = async () => {
    let contract = this.props.location.contract;
    const groupName = this.state.groupName;
    const account = this.state.account;
    const nameSurname = this.state.nameSurname;
    
    
    if (contract === undefined) {
      contract = this.state.contract
    }

    await contract.methods.enroll(groupName, nameSurname).send({from: account})
    this.setState({
      isSentRequest: true
    })

  }

  leaveGroup = async () => {
    let contract = this.props.location.contract;
    const groupName = this.state.groupName;
    const account = this.state.account;
    
    if (contract === undefined) {
      contract = this.state.contract
    }

    await contract.methods.leaveGroup(groupName).send({from: account});
    this.checkEnrolled(account, groupName);
    
    this.getGroup();
  }

  checkEnrolled = async (account, groupName) => {
    let contract = this.props.location.contract;
    if (contract === undefined) {
      contract = this.state.contract
    }

    const isEnrolled = await contract.methods.checkParticipant(groupName).call({
      from: account
    });

    this.setState({
      isEnrolled: isEnrolled
    })

  }
    
    getGroup = async () =>  {

      let contract = this.props.location.contract;
      let account = this.props.location.account;
      
      
      if (contract === undefined && account === undefined) {
        contract = this.state.contract
        account = this.state.account
      }

      const group = await contract.methods.getGroup(this.state.searchString).call({
        from: account
      });
      
      this.checkEnrolled(account, this.state.searchString);

      if (group[0] === "") {
        this.setState({
          groupName: "",
          creator: "",
          numberOfMember: "",
          isOpen: "",
          account: account,
          
        })
      } else {
        this.setState({
          groupName: group[0],
          creator: group[1],
          isOpen: group[2],
          numberOfMember: group[3],
          account: account,
        })
      }
    }

    handleSearchInput = (event) => {
      const value = event.target.value;
      this.setState({
        searchString: value
      })
    }

    handleNameSurnameInput = (event) => {
      const value = event.target.value;
      this.setState({
        nameSurname: value
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
    
    if (!isEnrolled && this.state.isOpen === true && this.state.isSentRequest === false) {
      button1 = 
              <Form style={{marginTop: "4em"}}>
                <Form.Group>
                <Form.Input onChange={this.handleNameSurnameInput} className="formInput" label='Name and Surname' placeholder='Enter Your Name and Surname' />
                </Form.Group>
                <Form.Checkbox label='I agree to the Terms and Conditions' />
                <Button onClick={() => this.enterGroup()} className="detailsButton" inverted color='green'>{this.state.enterGroupText}</Button>                
              </Form>

    } 
    else if (isEnrolled && this.state.isOpen === true) {
      let contract = this.state.contract;
      let web3 = this.state.web3;
      if (contract === undefined) {
        contract = this.props.location.contract;
        web3 = this.props.account.web3;
      }
      button2 = <Form className="detailsButton">
                  <Form.Group>
                    <Button className="leaveGroupButton" onClick={() => {this.leaveGroup()}} inverted color='red'>{this.state.leaveGroupText}</Button>
                    <Link to={{
                      pathname:"./GroupProfile",
                      contract: contract,
                      web3: web3,
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
    else if(this.state.isSentRequest) {
      button1 = <Form success>
                  <Message
                    success
                    header='Request is on pending.'
                  />
                </Form>
      
    }
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "80%"}}>
                <Input style={{marginRight: 10}} onChange={this.handleSearchInput} className='icon' placeholder='Search Group' />
{/*             <Input style={{marginRight: 10}} onChange={this.handleAddressInput} className='icon' placeholder='Enter Your Address' />
 */}            <Button style={{height: 35, width: "25%"}} color='blue' onClick={() => {this.getGroup()}}>Get Group</Button>
                </Menu.Item>
                <Menu.Item style={{width: "20%"}}>
         
                <Link to={{
                  pathname:"./CreateGroup",
                  contract: this.state.contract,
                  web3: this.state.web3,
                  account: this.state.account
                  
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
