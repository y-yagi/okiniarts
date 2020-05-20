import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import ArtForm from "./ArtForm";

class EditArt extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.artId = this.props.match.params.id;
  }

  onSubmit(data) {
    return window
      .fetch(`/api/arts/${this.artId}`, {
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json",
        },
        method: "PUT",
      })
      .then((_) =>
        this.props.history.replace("/", {
          message: "Art was successfully updated.",
        })
      )
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Edit Arts</Header.Content>
        </Header>
        <ArtForm
          onSubmit={this.onSubmit}
          history={this.props.history}
          artId={this.artId}
        />
      </Container>
    );
  }
}

export default EditArt;
