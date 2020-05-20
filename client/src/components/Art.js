import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Header,
  Button,
  Dimmer,
  Loader,
  Divider,
  Confirm,
  Message,
} from "semantic-ui-react";

class Art extends Component {
  constructor() {
    super();
    this.state = { openConfirm: false };
    this.getArt = this.getArt.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.getArt(id);
  }

  getArt(id) {
    fetchWithAuth(`/api/arts/${id}`).then((art) => this.setState({ art: art }));
  }

  handleDestroy() {
    this.setState({ openConfirm: true });
  }

  handleConfirm() {
    let { art } = this.state;

    return window
      .fetch(`/api/arts/${art.id}`, {
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json",
        },
        method: "DELETE",
      })
      .then((_) =>
        this.props.history.replace("/", {
          message: "Art was successfully deleted.",
        })
      )
      .catch((error) => console.log(error));
  }

  handleCancel() {
    this.setState({ openConfirm: false });
  }

  render() {
    let { art, openConfirm } = this.state;

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
          <Confirm
            open={openConfirm}
            onCancel={() => this.handleCancel()}
            onConfirm={() => this.handleConfirm()}
          />
          <Button primary floated="right" as={Link} to={`/arts/${art.id}/edit`}>
            Edit
          </Button>
        </div>
        <Divider hidden section />
        <Container text>{art.detail}</Container>
        <Divider hidden section />
        <Message info>
          <a
            href={`https://artsandculture.google.com/search?q=${art.name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Search '{art.name}' in Google Arts &amp; Culture
          </a>
        </Message>
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
