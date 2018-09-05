import React, { Component } from "react";
import {
  Container,
  Header,
  Button,
  Form,
  TextArea,
  Select,
  Dimmer,
  Loader
} from "semantic-ui-react";

class ArtForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.name = "";
    this.detail = "";
    this.artist_id = "";
    this.getArtists = this.getArtists.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDetailChange = this.handleDetailChange.bind(this);
    this.handleArtistChange = this.handleArtistChange.bind(this);
  }

  componentDidMount() {
    this.getArtists();
  }

  fetch(endpoint) {
    return window
      .fetch(endpoint, {
        credentials: "same-origin",
        headers: { Authorization: "Bearer " + localStorage.getItem("id_token") }
      })
      .then(response => response.json())
      .catch(error => console.log(error));
  }

  getArtists() {
    this.fetch(`/api/artists`).then(artists =>
      this.setState({ artists: artists })
    );
  }

  handleNameChange(event) {
    this.name = event.target.value;
  }

  handleDetailChange(event) {
    this.detail = event.target.value;
  }

  handleArtistChange(event) {
    let name = "";

    if (event.target.children.length === 0) {
      name = event.target.textContent;
    } else {
      name = event.target.children[0].textContent;
    }

    this.artist_id = this.state.artists.find(a => {
      return a.name === name;
    }).id;
  }

  handleSubmit() {
    const data = {
      name: this.name,
      detail: this.detail,
      artist_id: this.artist_id
    };
    return window
      .fetch("/api/arts", {
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json"
        },
        method: "POST"
      })
      .then(_ =>
        this.props.history.replace("/", {
          message: "Art was successfully created."
        })
      )
      .catch(error => console.log(error));
  }

  artistOptions() {
    let options = [];
    this.state.artists.forEach(a => {
      options.push({ key: a.id, value: a.id, text: a.name });
    });
    return options;
  }

  render() {
    return this.state.artists ? (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Add Arts</Header.Content>
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field required>
            <label>Artist</label>
            <Select
              placeholder="Select Artist"
              required
              options={this.artistOptions()}
              onChange={this.handleArtistChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>Name</label>
            <input
              placeholder="Name"
              required
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Detail</label>
            <TextArea placeholder="Detail" onChange={this.handleDetailChange} />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    ) : (
      <Container className="main-container">
        <Dimmer active inverted>
          <Loader content="Loading" />
        </Dimmer>
      </Container>
    );
  }
}

export default ArtForm;
