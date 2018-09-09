import React, { Component } from "react";
import { Button, Form, TextArea } from "semantic-ui-react";

class ArtistForm extends Component {
  constructor(props) {
    super(props);

    this.name = "";
    this.detail = "";
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDetailChange = this.handleDetailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.name = event.target.value;
  }

  handleDetailChange(event) {
    this.detail = event.target.value;
  }

  handleSubmit() {
    const data = { name: this.name, detail: this.detail };
    this.props.onSubmit(data);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Field required>
          <label>Name</label>
          <input placeholder="Name" required onChange={this.handleNameChange} />
        </Form.Field>
        <Form.Field>
          <label>Detail</label>
          <TextArea placeholder="Detail" onChange={this.handleDetailChange} />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
}

export default ArtistForm;
