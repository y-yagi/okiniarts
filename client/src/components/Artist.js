import React, { Component } from "react";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Button,
  Header,
  Dimmer,
  Loader,
  Divider,
  Confirm
} from "semantic-ui-react";

class Artist extends Component {
  constructor() {
    super();
    this.state = { openConfirm: false };
    this.getArtist = this.getArtist.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.getArtist(id);
  }

  getArtist(id) {
    fetchWithAuth(`/api/artists/${id}`).then(artist =>
      this.setState({ artist: artist })
    );
  }

  handleDestroy() {
    this.setState({ openConfirm: true });
  }

  handleConfirm() {
    let { artist } = this.state;

    return window
      .fetch(`/api/artists/${artist.id}`, {
        credentials: "same-origin",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("id_token"),
          "content-type": "application/json"
        },
        method: "DELETE"
      })
      .then(_ =>
        this.props.history.replace("/", {
          message: "Artist was successfully deleted."
        })
      )
      .catch(error => console.log(error));
  }

  handleCancel() {
    this.setState({ openConfirm: false });
  }

  render() {
    let { artist, openConfirm } = this.state;

    return artist ? (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>{artist.name}</Header.Content>
        </Header>
        <Divider hidden section />
        <div>
          <Button
            color="red"
            floated="right"
            disabled={artist.arts !== null}
            onClick={() => this.handleDestroy()}
          >
            Destroy
          </Button>
          <Confirm
            open={openConfirm}
            onCancel={() => this.handleCancel()}
            onConfirm={() => this.handleConfirm()}
          />
        </div>
        <Divider hidden section />
        <Container text>{artist.detail}</Container>
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

export default Artist;
