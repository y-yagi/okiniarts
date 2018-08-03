import React, { Component } from 'react'
import { Container, Header, Segment, Button, Icon, Dimmer, Loader, Divider } from 'semantic-ui-react'

class App extends Component {
  constructor () {
    super()
    this.state = {}
    this.getArtWorks = this.getArtWorks.bind(this)
    this.getArtWork = this.getArtWork.bind(this)
  }

  componentDidMount () {
    this.getArtWorks()
  }

  fetch (endpoint) {
    return window.fetch(endpoint)
      .then(response => response.json())
      .catch(error => console.log(error))
  }

  getArtWorks () {
    this.fetch('/api/artworks')
      .then(artworks => {
        if (artworks.length) {
          this.setState({artworks: artworks})
          this.getArtWork(artworks[0].id)
        } else {
          this.setState({artworks: []})
        }
      })
  }

  getArtWork(id) {
    this.fetch(`/api/artworks/${id}`)
      .then(artwork => this.setState({artwork: artwork}))
  }

  render () {
    let {artworks, artwork} = this.state
    return artworks
      ? <Container text>
        <Header as='h2' icon textAlign='center' color='teal'>
          <Icon name='unordered list' circular />
          <Header.Content>
            List of Arts
          </Header.Content>
        </Header>
        <Divider hidden section />
        {artworks && artworks.length
          ? <Button.Group color='teal' fluid widths={artworks.length}>
            {Object.keys(artworks).map((key) => {
              return <Button active={artwork && artwork.id === artworks[key].id} fluid key={key} onClick={() => this.getArtWork(artworks[key].id)}>
                {artworks[key].title}
              </Button>
            })}
          </Button.Group>
          : <Container textAlign='center'>No artworks found.</Container>
        }
        <Divider section />
        {artwork &&
          <Container>
            <Header as='h2'>{artwork.title}</Header>
            {artwork.description && <p>{artwork.description}</p>}
            {artwork.ingredients &&
              <Segment.Group>
                {artwork.ingredients.map((ingredient, i) => <Segment key={i}>{ingredient.description}</Segment>)}
              </Segment.Group>
            }
            {artwork.steps && <p>{artwork.steps}</p>}
            {artwork.source && <Button basic size='tiny' color='teal' href={artwork.source}>Source</Button>}
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
