import React, { Component } from 'react'
import { Container, Header, Segment, Button, Icon, Dimmer, Loader, Divider, Form, Grid, Label } from 'semantic-ui-react'

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

  render () {
    let {arts, art} = this.state

    return arts
      ? <Container style={{ marginTop: '7em' }}>
        <Header as='h2' icon textAlign='center' color='teal'>
          <Icon name='unordered list' circular />
          <Header.Content>
            List of Arts
          </Header.Content>
        </Header>
        <Divider hidden section />
        <div>
          <Button primary floated='right'>Add artist</Button>
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
                <Header as='h3' color='teal'>{art.name}<Label>{art.artist.name}</Label> </Header>
                {art.detail && <p>{art.detail}</p>}
              </Container>
            }
          </Grid.Column>
        </Grid>
      </Container>
      : <Container style={{ marginTop: '7em' }}>
        <Dimmer active inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Container>
  }
}

export default App