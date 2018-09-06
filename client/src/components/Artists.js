import React, { Component } from "react";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Header,
  Button,
  Dimmer,
  Loader,
  Divider,
  Table
} from "semantic-ui-react";

class Artists extends Component {
  constructor() {
    super();
    this.state = {};
    this.getArtists = this.getArtists.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentDidMount() {
    this.getArtists();
  }

  getArtists() {
    fetchWithAuth(`/api/artists`).then(artists =>
      this.setState({ artists: artists })
    );
  }

  handleDestroy(id) {
    return window
      .fetch(`/api/artists/${id}`, {
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

  render() {
    let { artists } = this.state;

    return artists ? (
      <Container className="main-container">
        <Header as="h2" icon textAlign="center" color="teal">
          <Header.Content>Arists</Header.Content>
        </Header>
        <Divider hidden section />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(artists).map(key => {
              return (
                <Table.Row key={key}>
                  <Table.Cell>{artists[key].name}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="red"
                      onClick={() => this.handleDestroy(artists[key].id)}
                    >
                      Destroy
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
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

export default Artists;
