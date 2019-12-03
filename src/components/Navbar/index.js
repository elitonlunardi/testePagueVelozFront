import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default class NavbarComponent extends Component {
  render() {
    return (
      <Navbar bg="primary" expand="lg" variant="dark">
        <Link to="/">
          <Navbar.Brand>Teste PagueVeloz</Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
    );
  }
}
