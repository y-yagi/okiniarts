import React, { Component } from "react";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Header,
  Button,
  Dimmer,
  Loader,
  Divider
} from "semantic-ui-react";

class Art extends Component {
  constructor() {
    super();
    this.state = {};
    this.getArt = this.getArt.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.getArt(id);
  }

  getArt(id) {
    fetchWithAuth(`/api/arts/${id}`).then(art => this.setState({ art: art }));
  }

  handleDestroy() {
    let { art } = this.state;

    return window
      .fetch(`/api/arts/${art.id}`, {
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json"
        },
        method: "DELETE"
      })
      .then(_ =>
        this.props.history.replace("/", {
          message: "Art was successfully deleted."
        })
      )
      .catch(error => console.log(error));
  }

  render() {
    let { art } = this.state;

    return art ? (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>{art.name}</Header.Content>
        </Header>
        <Divider hidden section />
        <div>
          <Button
            color="red"
            floated="right"
            onClick={() => this.handleDestroy()}
          >
            Destroy
          </Button>
        </div>
        <Divider hidden section />
        <Container text>{art.detail}</Container>
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

export default Art;
