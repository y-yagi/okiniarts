import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Container, Image } from 'semantic-ui-react'

class HeaderMenu extends Component {
  render() {

    return (
      <Menu fixed='top' inverted color='teal'>
        <Container>
          <Menu.Item as='a' header>
            Okini Arts
          </Menu.Item>
          <Menu.Item as='a'>
            <Link to='/' />Home
          </Menu.Item>
        </Container>
      </Menu>
    )
  }
}

export default HeaderMenu
