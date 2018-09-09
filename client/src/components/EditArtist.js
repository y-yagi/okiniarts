import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import ArtistForm from "./ArtistForm";

class EditArtist extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.artistId = this.props.match.params.id;
  }

  onSubmit(data) {
    return window
      .fetch(`/api/artists/${this.artistId}`, {
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json"
        },
        method: "PUT"
      })
      .then(_ =>
        this.props.history.replace("/", {
          message: "Artist was successfully updated."
        })
      )
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Edit Artist</Header.Content>
        </Header>
        <ArtistForm
          onSubmit={this.onSubmit}
          history={this.props.history}
          artistId={this.artistId}
        />
      </Container>
    );
  }
}

export default EditArtist;
