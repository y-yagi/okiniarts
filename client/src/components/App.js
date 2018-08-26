import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Header, Segment, Button, Icon, Dimmer, Loader, Divider, Form, Grid, Label, Message } from 'semantic-ui-react'

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.getArts = this.getArts.bind(this)
    this.getArt = this.getArt.bind(this)
    this.message = '';
  }

  componentDidMount () {
    if (this.props.location.state && this.props.location.state.message) {
      this.message = this.props.location.state.message
      this.props.history.replace('/')
    }
    this.getArts()
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  logout() {
    this.props.auth.logout();
  }

  fetch (endpoint) {
    return window.fetch(endpoint, {
      credentials: 'same-origin',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') }
    }).then(response => response.json())
      .catch(error => console.log(error))
  }

  getArts () {
    this.fetch('/api/arts')
      .then(arts => {
        if (arts && arts.length) {
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

  renderMessage() {
    if (this.message) {
      return (
        <Message positive>
          <Message.Header>{this.message}</Message.Header>
        </Message>
      )
    } else {
      return ""
    }
  }

  render () {
    let {arts, art} = this.state

    return arts
      ? <Container className="main-container">
        { this.renderMessage() }
        <Header as='h2' icon textAlign='center' color='teal'>
          <Icon name='unordered list' circular />
          <Header.Content>
            List of Arts
          </Header.Content>
        </Header>
        <Divider hidden section />
        <div>
          <Button primary floated='right' as={Link} to='/artists/new'>Add artist</Button>
          <Button primary floated='right'>Add art</Button>
        </div>
        <Divider hidden section />
        <Grid>
          <Grid.Column width={4}>
          {arts && arts.length
            ? <Button.Group color='teal' vertical widths={arts.length}>
              {Object.keys(arts).map((key) => {
                return <Button active={art && art.id === arts[key].id} fluid key={key} onClick={() => this.getArt(arts[key].id)}>
                  {arts[key].name}
                </Button>
              })}
            </Button.Group>
            : <Container textAlign='center'>No arts found.</Container>
          }
          </Grid.Column>
          <Grid.Column width={8}>
            {art &&
              <Container text>
                <Header as='h3' color='teal'>{art.name}<Label as={Link} to='/artist'>{art.artist.name}</Label> </Header>
                {art.detail && <p>{art.detail}</p>}
              </Container>
            }
          </Grid.Column>
        </Grid>
      </Container>
      : <Container className="main-container">
        <Dimmer active inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Container>
  }
}

export default App
