import React, { Component } from 'react'
import { Container, Header, Button, Dimmer, Loader, Divider } from 'semantic-ui-react'

class Artist extends Component {
  constructor () {
    super()
    this.state = {}
    this.getArtist = this.getArtist.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id
    this.getArtist(id)
  }

  fetch(endpoint) {
    return window.fetch(endpoint, {
      credentials: 'same-origin',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token') }
    }).then(response => response.json())
      .catch(error => console.log(error))
  }

  getArtist(id) {
    this.fetch(`/api/artists/${id}`)
      .then(artist => this.setState({artist: artist}))
  }

  handleDestroy() {
    let {artist} = this.state

    return window.fetch(`/api/artists/${artist.id}`, {
      credentials: 'same-origin',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token'), 'content-type': 'application/json' },
      method: 'DELETE',
    }).then(_ =>
      this.props.history.replace('/', { message: "Artist was successfully deleted." })
    ).catch(error => console.log(error))
  }

  render() {
    let {artist} = this.state

    return artist
      ? <Container className="main-container">
          <Header as='h2' icon textAlign='center' color='teal'>
            <Header.Content>
              {artist.name}
            </Header.Content>
          </Header>
          <Divider hidden section />
          <div>
            <Button color='red' floated='right' onClick={() => this.handleDestroy()}>Destroy</Button>
          </div>
          <Divider hidden section />
          <Container text>
            {artist.detail}
          </Container>
        </Container>
      : <Container className="main-container">
        <Dimmer active inverted>
          <Loader content='Loading' />
        </Dimmer>
      </Container>
  }
}

export default Artist
