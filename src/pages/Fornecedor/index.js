import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import "./styles.css";
import NavbarComponent from "../../components/Navbar";
import swal from "sweetalert";

import api from "../../services/api";

export default class Fornecedor extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        idEmpresa: PropTypes.string
      })
    }).isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      idEmpresa: "",
      fornecedores: [],
      novoFornecedor: {
        nome: "",
        documento: "",
        rg: "",
        dataNascimento: "",
        idEmpresa: ""
      },
      modalShow: false,
      modalSetShow: false,
      acessandoApi: true
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const idEmpresa = decodeURIComponent(match.params.idEmpresa);
    const response = await api.get(`Empresa/${idEmpresa}/obter-fornecedores`);
    console.log(response);
    this.setState(prevState => ({
      fornecedores: response.data.data,
      acessandoApi: false,
      idEmpresa: idEmpresa,
      novoFornecedor: {
        ...prevState.novoFornecedor,
        idEmpresa: idEmpresa
      }
    }));
  }

  handleOnChangeNome = changeEvent => {
    const { value } = changeEvent.target;
    this.setState(prevState => ({
      novoFornecedor: {
        ...prevState.novoFornecedor,
        nome: value
      }
    }));
  };

  handleOnChangeDocumento = changeEvent => {
    const { value } = changeEvent.target;
    this.setState(prevState => ({
      novoFornecedor: {
        ...prevState.novoFornecedor,
        documento: value
      }
    }));
  };

  handleOnChangeRg = changeEvent => {
    const { value } = changeEvent.target;
    this.setState(prevState => ({
      novoFornecedor: {
        ...prevState.novoFornecedor,
        rg: value
      }
    }));
  };

  handleOnChangeDataNascimento = changeEvent => {
    const { value } = changeEvent.target;
    this.setState(prevState => ({
      novoFornecedor: {
        ...prevState.novoFornecedor,
        dataNascimento: value
      }
    }));
  };

  handleFormSubmit = submitEvent => {
    submitEvent.preventDefault();
    const { novoFornecedor } = this.state;
    api.post(`Empresa/vincular-fornecedor`, novoFornecedor).then(response => {
      if (response.status === 200) {
        swal("Sucesso!", "Fornecedor vinculado com sucesso!", "success");
        api
          .get(`Empresa/${novoFornecedor.idEmpresa}/obter-fornecedores`)
          .then(response => {
            this.setState({
              fornecedores: response.data.data
            });
          });

        this.handleClose();
      } else {
        swal("Ooops :(", "Falha ao vincular o fornecedor.", "error");
      }
    });
  };

  handleClose = () => {
    this.setState({
      modalShow: false
    });
  };
  handleShow = () => {
    this.setState({
      modalShow: true
    });
  };

  render() {
    const { modalShow, fornecedores, acessandoApi } = this.state;

    if (acessandoApi) {
      return <h1>Carregando...</h1>;
    }

    return (
      <>
        <NavbarComponent></NavbarComponent>
        <Container>
          <h2>Fornecedores da empresa</h2>
          <Row>
            {fornecedores.map(forn => (
              <Col key={forn.id} sm={4}>
                <Card className="cardFornecedores">
                  <Card.Body>
                    <Row>
                      <Col sm={3}></Col>
                      <Col sm={6}>
                        <Card.Title>{forn.nome}</Card.Title>
                        <p>{forn.documento.value}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col sm={4}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col sm={3}></Col>
                    <Col sm={6}>
                      <Card.Title>Vincular fornecedor</Card.Title>
                      <Button variant="primary" onClick={this.handleShow}>
                        Vincular
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={modalShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Vincular fornecedor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleFormSubmit}>
                <Form.Group controlId="formGroupNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome"
                    onChange={this.handleOnChangeNome}
                    value={this.state.novoFornecedor.nome}
                  />
                </Form.Group>

                <Form.Group controlId="formGroupdataDocumento">
                  <Form.Label>CNPJ/CPF</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="CNPJ/CPF"
                    onChange={this.handleOnChangeDocumento}
                    value={this.state.novoFornecedor.documento}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formGroupRg">
                  <Form.Label>RG</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="RG"
                    onChange={this.handleOnChangeRg}
                    value={this.state.novoFornecedor.rg}
                  />
                </Form.Group>

                <Form.Group controlId="formGroupdataNascimento">
                  <Form.Label>Data de nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Data de nascimento"
                    onChange={this.handleOnChangeDataNascimento}
                    value={this.state.novoFornecedor.dataNascimento}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Vincular
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}
