import React, { Component } from "react";
import "./css/App.css";
import lendingBorrowing from "./contracts/lendingBorrowing.json";
import getWeb3 from "./getWeb3";
import { Container, Menu} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'

class CreateGroup extends Component {

  state = {
    groupName: "",
    creator: "",
    isOpen: "",
    numberOfMember: "",
    enterGroup: "Enter the group",
    leaveGrouo: "Leave from Group",
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
    errorMessage: "No Group founded"

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

    createGroup = async () =>  {
      const { accounts, contract } = this.state;
        
      await contract.methods.createGroup("group1", "murat").send({
          from: accounts[0],
          gas: 3000000
      })
    }

    routeChange = ()=> {
        let path = `./`;
        let history = useHistory();
        history.push(path);
      }
/* 
    checkEnrolled = async (account, groupName) => {
      const contract = this.state.contract;

      const isEnrolled = await contract.methods.checkParticipant(groupName).call({from: account});
      this.setState({
        isEnrolled: isEnrolled
      })

    }
    
    getGroup = async () =>  {
      const { accounts, contract } = this.state;

      let defaultAccount = accounts[0]; 

      const group = await contract.methods.getGroup(this.state.searchString).call({from: defaultAccount});

      this.checkEnrolled(defaultAccount, this.state.searchString);

      if (group[0] === "") {
        this.setState({
          groupName: "",
          creator: "",
          numberOfMember: "",
          isOpen: ""
        })
      } else {
        this.setState({
          groupName: group[0],
          creator: group[1],
          isOpen: group[2],
          numberOfMember: group[3],
        })
      }
    }

    handleInputChange = (event) => {
      const value = event.target.value;
      this.setState({
        searchString: value
      })
      
    } */

  render() {
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "85%"}}>
                <h3>Create a New Group</h3>
                </Menu.Item>
                <Menu.Item style={{width: "15%"}}>
                <Link to="./" className="BackGroupButton">Back Group Page</Link>

                </Menu.Item>
            </Menu>
          </div>
        </Container>
      
    );
  }
}

export default CreateGroup;
