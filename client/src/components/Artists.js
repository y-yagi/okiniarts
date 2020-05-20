import React, { Component } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../fetch";
import {
  Container,
  Header,
  Dimmer,
  Loader,
  Divider,
  Table,
} from "semantic-ui-react";

class Artists extends Component {
  constructor() {
    super();
    this.state = {};
    this.getArtists = this.getArtists.bind(this);
  }

  componentDidMount() {
    this.getArtists();
  }

  getArtists() {
    fetchWithAuth(`/api/artists`).then((artists) =>
      this.setState({ artists: artists })
    );
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
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(artists).map((key) => {
              return (
                <Table.Row key={key}>
                  <Table.Cell>
                    <Link to={`/artists/${artists[key].id}`}>
                      {artists[key].name}
                    </Link>
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
