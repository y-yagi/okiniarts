import React, { Component } from "react";
import { Container, Header, Button, Form } from "semantic-ui-react";
import "./Login.css";

class Login extends Component {
  login() {
    this.props.auth.login();
  }

  render() {
    return (
      <Container text className="Login-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Okini-arts</Header.Content>
          <Form className="Login-form">
            <Button
              id="qsLoginBtn"
              className="btn-margin"
              onClick={this.login.bind(this)}
            >
              Log In
            </Button>
          </Form>
        </Header>
      </Container>
    );
  }
}

export default Login;
