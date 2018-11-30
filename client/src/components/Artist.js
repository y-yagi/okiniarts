import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Button,
  Header,
  Dimmer,
  Loader,
  Divider,
  Confirm,
  List
} from "semantic-ui-react";

class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = { openConfirm: false };
    this.getArtist = this.getArtist.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.artistId = this.props.match.params.id;
  }

  componentDidMount() {
    this.getArtist(this.artistId);
  }

  getArtist(id) {
    fetchWithAuth(`/api/artists/${id}`).then(artist =>
      this.setState({ artist: artist, arts: artist.arts })
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
    let { artist, arts, openConfirm } = this.state;

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
          <Button
            primary
            floated="right"
            as={Link}
            to={`/artists/${this.artistId}/edit`}
          >
            Edit
          </Button>
        </div>
        <Divider hidden section />
        <Container text>{artist.detail}</Container>
        <Divider section />
        <Header as="h3" icon textAlign="left" color="teal">
          Arts
        </Header>
        <List horizontal relaxed="very">
          {Object.keys(arts).map(key => {
            return (
              <List.Item>
                <List.Content>
                  <List.Header as={Link} key={key} to={`/arts/${arts[key].id}`}>
                    {arts[key].name}
                  </List.Header>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
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
