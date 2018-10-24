import React, { Component } from "react";
import { fetchWithAuth } from "../fetch";
import {
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
    this.state = { originalArtistId: "", originalName: "", originalDetail: "" };
  }

  componentDidMount() {
    if (this.props.artId) {
      this.getArt(this.props.artId);
    }
    this.getArtists();
  }

  getArt(id) {
    fetchWithAuth(`/api/arts/${id}`).then(art => {
      this.name = art.name;
      this.detail = art.detail;
      this.artist_id = art.artist_id;
      this.setState({
        originalArtistId: art.artist_id,
        originalName: art.name,
        originalDetail: art.detail
      });
    });
  }

  getArtists() {
    fetchWithAuth(`/api/artists`).then(artists =>
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
    this.props.onSubmit(data);
  }

  artistOptions() {
    let options = [];
    this.state.artists.forEach(a => {
      const selected = a.id === this.state.originalArtistId;
      console.log(a.id);
      console.log(selected);
      options.push({
        key: a.id,
        value: a.id,
        text: a.name,
        active: selected,
        selected: selected
      });
    });
    return options;
  }

  render() {
    return this.state.artists ? (
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
            defaultValue={this.state.originalName}
          />
        </Form.Field>
        <Form.Field>
          <label>Detail</label>
          <TextArea placeholder="Detail" onChange={this.handleDetailChange} defaultValue={this.state.originalDetail}  />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    ) : (
      <Dimmer active inverted>
        <Loader content="Loading" />
      </Dimmer>
    );
  }
}

export default ArtForm;
