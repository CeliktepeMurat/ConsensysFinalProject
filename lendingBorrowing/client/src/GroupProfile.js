import React, { Component } from "react";
import "./css/App.css";
import { Container, Menu,Card} from 'semantic-ui-react'
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
        contract: "",
        web3: this.props.location.web3,
        account: "",

    }

    componentDidMount = async () => {
        const account = this.props.location.account;
        const contract = this.props.location.contract; 

        const group = await contract.methods.getGroup(this.state.groupName).call({from: account});
        const debt = await contract.methods.checkMemberDebtStatus(this.state.groupName).call({from: account});

        this.setState({
            groupName: group[0],
            creator: group[1],
            isOpen: group[2],
            numberOfMember: group[3],
            amountLended: debt[1],
            amountBorrowed: debt[0],
            
            account: account,
            contract: contract
        })
    }
    


    routeChange = ()=> {
        let path = `./`;
        let history = useHistory();
        history.push(path);
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
                <Link to="./" className="BackGroupButton">Back Group Page</Link>
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
          
          </div>
        </Container>
      
    );
  }
}

export default GroupProfile;
