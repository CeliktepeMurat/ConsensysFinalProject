import React, { Component } from "react";
import "./css/App.css";
import { Container, Menu, Form, Button, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'

class CreateGroup extends Component {

  state = {
    groupName: "",
    nameSurname: "",
    creator: "",
    isCreated: "",

    // web3
    contract: this.props.location.contract,
    web3: this.props.location.web3,
    accounts: this.props.location.accounts
}

    createGroup = async () =>  {
      const groupName = this.state.groupName;
      const nameSurname = this.state.nameSurname;
      const creatorAddress = this.state.creator;
      const contract = this.state.contract;
        
      await contract.methods.createGroup(groupName, nameSurname).send({
          from: creatorAddress,
          gas: 3000000
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
                      accounts: this.state.accounts
                      
                    }} className="BackGroupButton">Back Group Page</Link>
                </Menu.Item>
            </Menu>

            <Form onSubmit={this.createGroup} className="Form">
              <Form.Group widths={2}>
                <Form.Input onChange={this.handleChange} name="groupName" label='Group Name' placeholder='Enter Group Name' />
                <Form.Input onChange={this.handleChange} name="nameSurname" label='Name and Surname' placeholder='Enter Your Name and Surname' />
              </Form.Group>
              <Form.Group widths={2}>
              <Form.Input onChange={this.handleChange} name="creator" label='Creator of Group' placeholder="Enter your account address"/>
                <Form.Input label='Number of Member' readOnly placeholder="0"/>
              </Form.Group>
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
