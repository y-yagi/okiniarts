import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Container, Image } from "semantic-ui-react";

class HeaderMenu extends Component {
  logout() {
    this.props.auth.logout();
  }

  render() {
    return (
      <Menu fixed="top" inverted color="teal">
        <Container>
          <Menu.Item as="a" header>
            Okini Arts
          </Menu.Item>
          <Menu.Item as={Link} to="/">
            Home
          </Menu.Item>
          <Menu.Item as="a" onClick={this.logout.bind(this)}>
            Logout
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}

export default HeaderMenu;
