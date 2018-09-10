import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import ArtForm from "./ArtForm";

class NewArt extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(data) {
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

  render() {
    return (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Add Arts</Header.Content>
        </Header>
        <ArtForm onSubmit={this.onSubmit} history={this.props.history} />
      </Container>
    );
  }
}

export default NewArt;
