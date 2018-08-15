import React, { Component } from 'react'
import Auth from '../auth/Auth.js'
import { Container, Header, Segment, Button, Icon, Dimmer, Loader, Divider, Form } from 'semantic-ui-react'

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.getArts = this.getArts.bind(this)
    this.getArt = this.getArt.bind(this)
  }

  componentDidMount () {
    this.getArts()
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  fetch (endpoint) {
    return window.fetch(endpoint)
      .then(response => response.json())
      .catch(error => console.log(error))
  }

  getArts () {
    this.fetch('/api/arts')
      .then(arts => {
        if (arts.length) {
          this.setState({arts: arts})
          this.getArt(arts[0].id)
        } else {
          this.setState({arts: []})
        }
      })
  }

  getArt(id) {
    this.fetch(`/api/arts/${id}`)
      .then(art => this.setState({art: art}))
  }

  render () {
    let {arts, art} = this.state
    const { isAuthenticated } = this.props.auth;

    if (!isAuthenticated()) {
      return (
        <Container text>
          <Header as='h2' icon textAlign='center' color='teal'>
            <Header.Content>Please login</Header.Content>
            <Form>
              <Button id="qsLoginBtn" bsStyle="primary" className="btn-margin" onClick={this.login.bind(this)}>
                Log In
              </Button>
            </Form>
          </Header>
        </Container>
      )
    }

    return arts
      ? <Container text>
        <Header as='h2' icon textAlign='center' color='teal'>
          <Icon name='unordered list' circular />
          <Header.Content>
            List of Arts
          </Header.Content>
        </Header>
        <Divider hidden section />
        {arts && arts.length
          ? <Button.Group color='teal' fluid widths={arts.length}>
            {Object.keys(arts).map((key) => {
              return <Button active={art && art.id === arts[key].id} fluid key={key} onClick={() => this.getArt(arts[key].id)}>
                {arts[key].name}
              </Button>
            })}
          </Button.Group>
          : <Container textAlign='center'>No arts found.</Container>
        }
        <Divider section />
        {art &&
          <Container>
            <Header as='h2'>{art.name}</Header>
            {art.description && <p>{art.description}</p>}
            {art.ingredients &&
              <Segment.Group>
                {art.ingredients.map((ingredient, i) => <Segment key={i}>{ingredient.description}</Segment>)}
              </Segment.Group>
            }
            {art.steps && <p>{art.steps}</p>}
            {art.source && <Button basic size='tiny' color='teal' href={art.source}>Source</Button>}
          </Container>
        }
      </Container>
      : <Container text>
        <Dimmer active inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Container>
  }
}

export default App
