import React, { Component } from 'react';
import '@shopify/polaris/styles.css';
import { Row, Col } from 'reactstrap';
import * as axios from 'axios';
import {
    AccountConnection,
    Page,
    TextField,
    Button,
    TextStyle,
    VisuallyHidden,
    Heading,
    FormLayout,
    Card

} from '@shopify/polaris';


class AccountVerify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tempToken : ""
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(token, id){
        this.setState({
            tempToken: token
        });
    }

    onClick(){

        const tempToken = this.state.tempToken;
        axios.post('/shopify/tracified/account/verify', { tempToken })
          .then((result) => {
            alert("Account verified successfully " + JSON.parse(result).tracifiedToken);
            console.log(result);
          });
    }

    render() {

        return (

            <Page>
                <Card title="Account Verficaction ">

                    <FormLayout>

                        <Card.Section>
                            <Col sm="8" offset="2">
                                <TextField onChange={this.onChange} value={this.state.tempToken} label="Enter the access token" />
                            </Col>
                            <Col sm="4" offset="2">
                                <Button primary onClick={this.onClick}>Connect</Button>
                            </Col>
                        </Card.Section>

                        <Card.Section>
                            <p>  You may want to connect to your Tracified Account for further proceedings</p>
                        </Card.Section>

                    </FormLayout>
                    <Row>
                    </Row>
                </Card>
            </Page>
        );
    }
}
export default AccountVerify;