import React, { Component } from "react";
import "./css/App.css";
import { Container, Menu, Card, Header, Table, Button} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'
import lendingBorrowing from "./contracts/lendingBorrowing.json";
import getWeb3 from "./getWeb3";

class GroupProfile extends Component {

  state = {
        groupName: this.props.location.groupName,
        creator: "",
        isOpen: "",
        numberOfMember: "",
        amountBorrowed: "",
        amountLended: "",

        // web3
        contract: "",
        web3: "",
        account: "",

        //Request
        nameSurname: [],
        memberAddress: [],
        isCompleted: [],
        ApprovalsCount: [],
        requestCount: 0,
        requests: []

    }

    componentDidMount = async () => {

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
            
        
        this.setState({        
            account: account[0],
            contract: instance,
            web3: web3
        },this.getInfo)
          
    }

    getInfo = async () => {
        const contract = this.state.contract;
        const account = this.state.account;
        let groupName = "";

        if (this.state.groupName === undefined) {
            groupName = "group2"
        } 
        console.log(account);
        
        const group = await contract.methods.getGroup(groupName).call({from: account});
        const debt = await contract.methods.checkMemberDebtStatus(groupName).call({from: account});
        
        let requestCount = group[4];

        let request = await contract.methods.getRequest("group2",0).call({from: account});
                
        /* for (let index = 0; index < requestCount; index++) {
            
            let request = await contract.methods.getRequest(groupName,0).call({from: account});
            console.log(request);
            
            this.setState({
                nameSurname: [...this.state.nameSurname, request[1]],
                memberAddress: [...this.state.memberAddress, request[2]],
                isCompleted: [...this.state.isCompleted, request[3]],
                ApprovalsCount: [...this.state.ApprovalsCount, request[4]],
                requests: [...this.state.requests, request],
            })
        } */
        

        this.setState({
            groupName: group[0],
            creator: group[1],
            isOpen: group[2],
            numberOfMember: group[3],
            amountLended: debt[1],
            amountBorrowed: debt[0],
            requestCount: requestCount,
        })
        
    }
    
    routeChange = ()=> {
        let path = `./`;
        let history = useHistory();
        history.push(path);
    }

    ConfirmRequest = async (memberAddress, index) => {
        const contract = this.state.contract;
        const account = this.state.account;
        const groupName = this.state.groupName;

        await contract.methods.approveRequest(memberAddress, groupName, index).send({from: account})
        this.getInfo();
        
    }

    getCell = () => {
            return (this.state.requests.map((request, index) => (
                <Table.Row key={index}>
                    <Table.Cell singleLine>
                    <Header as='h4' textAlign='center'>
                        {this.state.nameSurname[index]}
                    </Header>
                    </Table.Cell>
                    <Table.Cell singleLine>{this.state.memberAddress[index]}</Table.Cell>
                    <Table.Cell>
                    {String(this.state.isCompleted[index])}
                    </Table.Cell>
                    <Table.Cell textAlign='right' singleLine>
                    {/* 80% <br /> */}
                    {this.state.ApprovalsCount[index]} Approval
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                    <Button.Group>
                        <Button onClick={() => this.rejectRequest(this.state.memberAddress[index], index)} negative>Reject</Button>
                        <Button.Or />
                        <Button onClick={() => this.ConfirmRequest(this.state.memberAddress[index], index)} positive>Confirm</Button>
                    </Button.Group>
                    </Table.Cell>
                </Table.Row>
            )))
    }


  render() {    
    return (
        <Container className="App">
          <div>
            <Menu>
                <Menu.Item style={{width: "85%"}}>
                <h3>{this.state.groupName}</h3>
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

            <div className="cardBody">
                <Card.Group itemsPerRow={2} centered>
                <Card>
                    <Card.Content
                    header="Group Name"
                    description={this.state.groupName}
                    />
                </Card>

                <Card>
                    <Card.Content
                    header="Creator of Group"
                    description={this.state.creator}
                    />
                </Card>

                <Card>
                    <Card.Content
                    header="Status"
                    description={String(this.state.isOpen)}
                    />
                </Card>

                <Card>
                    <Card.Content
                    header="Number of Member"
                    description={this.state.numberOfMember}
                    />
                </Card>

                <Card>
                    <Card.Content
                    header="Amount Lended"
                    description={String(this.state.amountLended)}
                    />
                </Card>

                <Card>
                    <Card.Content
                    header="Amount Borrowed"
                    description={String(this.state.amountBorrowed)}
                    />
                </Card>
                </Card.Group>
            </div> 
            <h3 style={{paddingTop: 40, paddingBottom: 20}}>Enrolling Requests</h3>
            <Table celled padded>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell singleLine>Name and Surname</Table.HeaderCell>
                    <Table.HeaderCell singleLine>Member Address</Table.HeaderCell>
                    <Table.HeaderCell>Completed</Table.HeaderCell>
                    <Table.HeaderCell>Approvals Count</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                {this.getCell()}
                
                </Table.Body>
            </Table>
          </div>
        </Container>
      
    );
  }
}

export default GroupProfile;
