import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";

export default class NavbarComponent extends Component {
  render() {
    return (
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand>Teste PagueVeloz</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
    );
  }
}
