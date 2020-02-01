import React, { Component } from "react";
import "./css/App.css";
import { Container, Menu, Card, Header, Table, Button, Grid, Segment, Form, Label, Message} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom'
import { useHistory} from 'react-router-dom'

class GroupProfile extends Component {

  state = {
        groupName: this.props.location.groupName,
        creator: "",
        isOpen: "",
        numberOfMember: "",
        amountBorrowed: "",
        amountLended: "",

        // web3
        contract: this.props.location.contract,
        web3: this.props.location.web3,
        account: this.props.location.account,

        //Request
        requestCount: 0,
        requests: [],

        activeItem: 'details',
        amountToGroup: "",
        amountToCompound: "",
        amountToBorrow: "",
        amountToWithdraw: "",
        amountToPayBack: "",
        depositPending: "",

        returnMessageLending: "Amount successfully lended. Check group details.",
        returnMessageBorrowing: "Amount successfully borrowed. Check group details.",
        returnMessagepaydebtbak: "Amount successfully payed back. Check group details.",
        returnMessagewithdraw: "Amount successfully withdrawed. Check group details.",
        returnMessageDeposit: "Amount successfully deposited. Check group details.",
        selectedReturnMessage: "",

    }

    routeChange = ()=> {
        let path = `./`;
        let history = useHistory();
        history.push(path);
    }

    componentDidMount = async () => {

        if (this.state.contract === undefined) {
            console.log("there is no group founded");
            

        } else {
            this.setState({
                requests: []
            })
            this.getGroup();
            this.getRequests();
            
        }
    }

    getRequests = async () => {
        let groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        
        
        const getrequestsArrayLength = await contract.methods.getRequestArrayLength(groupName).call({from: account});
        let requestsArrayLength = getrequestsArrayLength;
        console.log(requestsArrayLength);

        let newRequests = [];
        
        for (let index = 0; index < requestsArrayLength; index++) {
            
            let request = await contract.methods.getRequest(groupName,index).call({from: account});

            if (request[2] === false && request[0] !== "") {
                newRequests.push(request);
            }   
        }
        this.setState({
            requests: newRequests
        })
    }

    getGroup = async () => {
        let groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;

        const group = await contract.methods.groups(groupName).call({from: account});
        const debt = await contract.methods.checkMemberDebtStatus(groupName).call({from: account});
        const depositPending = await contract.methods.getDepositPending(account).call();

        
        this.setState({
            requestCount: group[5],
            groupName: group[0],
            creator: group[1],
            isOpen: group[3],
            numberOfMember: group[4],
            amountBorrowed: debt[0],
            amountToGroup: debt[1],
            amountToCompound: debt[2],
            depositPending: depositPending,
            
        })
    }

    ConfirmRequest = async (memberAddress, index) => {
        const contract = this.state.contract;
        const account = this.state.account;
        const groupName = this.state.groupName;

        await contract.methods.approveRequest(memberAddress, groupName, index).send({from: account})
        let newRequests = this.state.requests;
        newRequests.splice(index, 1) 

        this.getGroup();
        this.setState({
            requests: newRequests
        })
    }

    getCell = () => {
            return (this.state.requests.map((request, index) => (
                <Table.Row className="tableRowRequests" key={index}>
                    <Table.Cell singleLine>
                    <Header as='h4' textAlign='center'>
                        {request[0]}
                    </Header>
                    </Table.Cell>
                    <Table.Cell singleLine>{request[1]}</Table.Cell>
                    <Table.Cell>
                    {String(request[2])}
                    </Table.Cell>
                    <Table.Cell textAlign='right' singleLine>
                    {/* 80% <br /> */}
                    {request[3]} Approval
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                    <Button.Group>
                        <Button onClick={() => this.rejectRequest(request[1], index)} negative>Reject</Button>
                        <Button.Or />
                        <Button onClick={() => this.ConfirmRequest(request[1], index)} positive>Confirm</Button>
                    </Button.Group>
                    </Table.Cell>
                    {console.log(request[3])
                    }
                </Table.Row>
            )))
    }

    message = (returnMessage) => {
        return <Form success>
                    <Message
                    success
                    header={returnMessage}
                    />
                </Form>
    }

    lend = async () => {
        const amount = this.state.amountToLend;
        const groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        

        await contract.methods.lending(groupName).send({
            from: account,
            value: amount
        })
        this.setState({
            selectedReturnMessage: this.state.returnMessageLending
        })
        
        this.getGroup();
    }

    borrow = async () => {
        const amount = this.state.amountToBorrow;
        const groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        

        await contract.methods.borrowing(groupName).send({
            from: account,
            value: amount
        })
        this.setState({
            selectedReturnMessage: this.state.returnMessageBorrowing
        })
        this.getGroup();
    }


    withdraw = async () => {
        const amount = this.state.amountToWithdraw;
        const groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        

        await contract.methods.withdraw(groupName).send({
            from: account,
            value: amount
        })

        this.setState({
            selectedReturnMessage: this.state.returnMessagewithdraw
        })
        
        this.getGroup();
    }

    payDebtBack = async () => {
        const amount = this.state.amountToPayBack;
        const groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        

        await contract.methods.payDebtBack(groupName).send({
            from: account,
            value: amount
        })
        
        this.setState({
            selectedReturnMessage: this.state.returnMessagepaydebtbak
        })
        
        this.getGroup();
    }
    
    depositToCompound = async () => {
        const amount = this.state.depositPending;
        const groupName = this.state.groupName;
        const contract = this.state.contract;
        const account = this.state.account;
        

        await contract.methods.depositToCompound(groupName).send({
            from: account,
            value: amount
        })
        
        this.setState({
            selectedReturnMessage: this.state.returnMessageDeposit
        })
        
        this.getGroup();
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {    
      let content;
      const { activeItem } = this.state

      if (activeItem === "details") {
        content = <div className="cardBody">
                    <Card.Group itemsPerRow={1} centered>
                    <Card fluid color="blue">
                        <Card.Content
                        header="Group Name"
                        description={this.state.groupName}
                        />
                    </Card>

                    <Card fluid color="blue">
                        <Card.Content
                        header="Creator of Group"
                        description={this.state.creator}
                        />
                    </Card>

                    <Card fluid color="blue">
                        <Card.Content
                        header="Status"
                        description={String(this.state.isOpen)}
                        />
                    </Card>

                    <Card fluid color="blue">
                        <Card.Content
                        header="Number of Member"
                        description={this.state.numberOfMember}
                        />
                    </Card>

                    <Card fluid color="blue">
                        <Card.Content
                        header="Amount Lended to Group"
                        description={String(this.state.amountToGroup)}
                        />
                    </Card>

                    <Card fluid color="blue">
                        <Card.Content
                        header="Amount deposited to Compound"
                        description={String(this.state.amountToCompound)}
                        />
                    </Card>
                    <Card fluid color="blue">
                        <Card.Content
                        header="Amount Borrowed"
                        description={String(this.state.amountBorrowed)}
                        />
                    </Card>
                    </Card.Group>
                </div> 
      } else if (activeItem === "requests") {
        content = <div className="requestTable">
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
      }
      else if (activeItem === "lending") {
          content = <Form>
                        <Form.Group>
                        <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                            Group Name
                        </Label>
                            <Form.Input width={6} placeholder={this.state.groupName} readOnly />
                        </Form.Group>

                        <Form.Group>
                        <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                            Amount
                        </Label>
                            <Form.Input onChange={this.handleChange} name="amountToLend" placeholder="Enter Amount to Lend" width={6} />
                        </Form.Group>
                        <Form.Field>
                            <Button onClick={() => this.lend()} size="large" positive>Lend </Button>
                        </Form.Field>
                        <Form.Field>
                            <Message
                                style={{width: "34.4em"}}
                                content={this.state.selectedReturnMessage}
                            />        
                        </Form.Field>
                        </Form>
      }

      else if (activeItem === "borrowing") {
        content = <Form>
                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Group Name
                      </Label>
                          <Form.Input width={6} placeholder={this.state.groupName} readOnly />
                      </Form.Group>

                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Amount
                      </Label>
                          <Form.Input onChange={this.handleChange} name="amountToBorrow" placeholder="Enter Amount to Borrow" width={6} />
                      </Form.Group>
                      <Form.Field>
                          <Button onClick={() => this.borrow()} size="large" positive>Borrow </Button>
                      </Form.Field>
                      <Form.Field>
                      <Message
                                style={{width: "34.4em"}}
                                content={this.state.selectedReturnMessage}
                            />       
                        </Form.Field>
                      </Form>
    }
    else if (activeItem === "payDebtBack") {
        content = <Form>
                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Group Name
                      </Label>
                          <Form.Input width={6} placeholder={this.state.groupName} readOnly />
                      </Form.Group>

                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Amount
                      </Label>
                          <Form.Input onChange={this.handleChange} name="amountToPayBack" placeholder="Enter Amount to Pay Back" width={6} />
                      </Form.Group>
                      <Form.Field>
                          <Button onClick={() => this.payDebtBack()} size="large" positive>Pay Back </Button>
                      </Form.Field>
                      <Form.Field>
                            <Message
                                style={{width: "34.4em"}}
                                content={this.state.selectedReturnMessage}
                            />        
                        </Form.Field>
                      </Form>
    }
    else if (activeItem === "withdraw") {
        content = <Form>
                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Group Name
                      </Label>
                          <Form.Input width={6} placeholder={this.state.groupName} readOnly />
                      </Form.Group>

                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Amount
                      </Label>
                          <Form.Input onChange={this.handleChange} name="amountToWithdraw" placeholder="Enter Amount to Withdraw" width={6} />
                      </Form.Group>
                      <Form.Field>
                          <Button onClick={() => this.withdraw()} size="large" positive>Withdraw </Button>
                      </Form.Field>
                      <Form.Field>
                      <Message
                                style={{width: "34.4em"}}
                                content={this.state.selectedReturnMessage}
                            />      
                        </Form.Field>
                      
                      </Form>
    }
    else if (activeItem === "depositToCompound") {
        content = <Form>
                      <Form.Group>
                      <Label style={{paddingTop: 10, width: 150}} key="medium" size="medium">
                          Amount
                      </Label>
                          <Form.Input width={6} placeholder={this.state.depositPending} readOnly />
                      </Form.Group>
                        <Form.Group>
                        <Form.Checkbox label='I agree to deposit this amount' />
                        </Form.Group>
                      <Form.Group>
                      
                      <Button onClick={() => this.depositToCompound()} size="large" positive>Deposit to Compound </Button>
                      </Form.Group>
                      <Form.Field>
                      <Message
                                style={{width: "34.4em"}}
                                content={this.state.selectedReturnMessage}
                            />      
                        </Form.Field>
                      
                      </Form>
    }
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
                      account: this.state.account
                      
                    }} className="BackGroupButton">Back Group Page</Link>
                </Menu.Item>
            </Menu>

            <Grid>
                <Grid.Column width={3}>
                <Menu fluid vertical tabular color="green">
                    <Menu.Item
                    name='details'
                    active={activeItem === 'details'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='requests'
                    active={activeItem === 'requests'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='lending'
                    active={activeItem === 'lending'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='borrowing'
                    active={activeItem === 'borrowing'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='payDebtBack'
                    active={activeItem === 'payDebtBack'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='withdraw'
                    active={activeItem === 'withdraw'}
                    onClick={this.handleItemClick}
                    />
                    <Menu.Item
                    name='depositToCompound'
                    active={activeItem === 'depositToCompound'}
                    onClick={this.handleItemClick}
                    />
                </Menu>
                </Grid.Column>

                <Grid.Column stretched width={13}>
                <Segment>
                   {content}
                </Segment>
                </Grid.Column>
                
            </Grid>
          </div>
        </Container>
      
    );
  }
}

export default GroupProfile;
