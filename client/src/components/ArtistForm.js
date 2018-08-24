import React, { Component } from 'react'
import { Container, Header, Button, Form, TextArea } from 'semantic-ui-react'

class ArtistForm extends Component {
  constructor(props) {
    super(props);

    this.name = '';
    this.detail = '';
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDetailChange = this.handleDetailChange.bind(this);
  }

  handleNameChange(event) {
    this.name = event.target.value;
  }

  handleDetailChange(event) {
    this.detail = event.target.value;
  }

  handleSubmit() {
    const data = {name: this.name, detail: this.detail}
    return window.fetch('/api/artists', {
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('id_token'), 'content-type': 'application/json' },
      method: 'POST',
    }).then(_ => this.props.history.replace('/'))
      .catch(error => console.log(error))
  }

  render() {
    return (
      <Container style={{ marginTop: '7em' }}>
        <Header as='h2' icon textAlign='center' color='teal'>
          <Header.Content>
            Add Artists
          </Header.Content>
        </Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field required>
            <label>Name</label>
            <input placeholder='Name' required onChange={this.handleNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Detail</label>
            <TextArea placeholder='Detail' onChange={this.handleDetailChange} />
          </Form.Field>
          <Button type='submit'>Submit</Button>
        </Form>
      </Container>
    );
  }
}

export default ArtistForm
