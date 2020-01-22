import React, { Component } from "react";
import "./css/App.css";
import { Container, Menu, Form, Button, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'
import getWeb3 from "./getWeb3";
import lendingBorrowing from "./contracts/lendingBorrowing.json";

class CreateGroup extends Component {

  state = {
    groupName: "",
    nameSurname: "",
    creator: "",
    isCreated: "",

    // web3
    contract: this.props.location.contract,
    web3: this.props.location.web3,
    account: this.props.location.account
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      
      // Use web3 to get the user's accounts.
      const account = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = lendingBorrowing.networks[networkId];
      const instance = new web3.eth.Contract(
        lendingBorrowing.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, account: account[0], contract: instance,});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error);
    }

  };

  createGroup = async () =>  {
    const groupName = this.state.groupName;
    const nameSurname = this.state.nameSurname;

    let account = this.state.account;
    let contract = this.state.contract;
    console.log(account);
    

    if (contract === undefined) {
      contract = this.state.contract
    }
      
    await contract.methods.createGroup(groupName, nameSurname).send({
        from: account,
        gas: 5000000, 
    })
    
    this.setState({isCreated: true})
    
  }

  routeChange = ()=> {
      let path = `./`;
      let history = useHistory();
      history.push(path);
  }

  handleSubmit = () => {
    const { groupName, nameSurname, creator } = this.state

    this.setState({ groupName: groupName, nameSurname: nameSurname, creator: creator })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    let message;

    const isCreated = this.state.isCreated;

    if (isCreated) {
      message = <Form success>
                  <Message
                    success
                    header='Group successfully created.'
                  />
                </Form>
    }
    else if (isCreated === "") {
      message = ""
    }
    else {
      message = <Form error>
                <Message
                  error
                  header='Grup is not created'
                />
              </Form>
    }

    
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "85%"}}>
                <h3>Create a New Group</h3>
                </Menu.Item>
                <Menu.Item style={{width: "15%"}}>
                <Link to={{
                      pathname:"./",
                      contract: this.state.contract,
                      web3: this.state.web3,
                      account: this.state.account
                      
                    }} className="BackGroupButton">Back Group Page</Link>
                </Menu.Item>
            </Menu>

            <Form onSubmit={this.createGroup} className="Form"> 
              <Form.Input onChange={this.handleChange} name="groupName" label='Group Name' placeholder='Enter Group Name' />
              <Form.Input onChange={this.handleChange} name="nameSurname" label='Name and Surname' placeholder='Enter Your Name and Surname' />
              <Form.Checkbox label='I agree to the Terms and Conditions' />
              <Button type='submit'>Create</Button>
            </Form>
            <Form.Field>
            {message}
            </Form.Field>
            
          </div>
        </Container>
      
    );
  }
}

export default CreateGroup;
