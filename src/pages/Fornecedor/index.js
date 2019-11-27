import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import "./styles.css";
import * as yup from "yup";
import { Formik } from "formik";

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
      modalShow: false,
      modalSetShow: false,
      acessandoApi: true
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const idEmpresa = decodeURIComponent(match.params.idEmpresa);
    const response = await api.get(`Empresa/${idEmpresa}/obter-fornecedores`);
    this.setState(prevState => ({
      fornecedores: response.data.data,
      acessandoApi: false,
      idEmpresa: idEmpresa
    }));
  }

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
    const { modalShow, fornecedores, acessandoApi, idEmpresa } = this.state;
    const schema = yup.object({
      nome: yup.string().required(),
      documento: yup.string().required(),
      rg: yup.string().required(),
      dataNascimento: yup.string().required()
    });

    if (acessandoApi) {
      return <h1>Carregando...</h1>;
    }
    return (
      <>
        <NavbarComponent></NavbarComponent>
        <Container>
          <h2>Fornecedores da empresa</h2>
          <Row>
            <Button className="btnVincularFornecedor" onClick={this.handleShow}>
              Vincular
            </Button>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Nome</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map(forn => (
                  <tr key={forn.id}>
                    <td>{forn.documento.value}</td>
                    <td>{forn.nome}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>

          <Modal show={modalShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Vincular fornecedor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                validationSchema={schema}
                onSubmit={data => {
                  data.idEmpresa = idEmpresa;
                  console.log(data);
                }}
                initialValues={{
                  nome: "",
                  documento: "",
                  rg: "",
                  dataNascimento: ""
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="formGroupNome">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        onChange={handleChange}
                        value={values.nome}
                        isInvalid={!!errors.nome}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGroupdataDocumento">
                      <Form.Label>CNPJ/CPF</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="CNPJ/CPF"
                        name="documento"
                        onChange={handleChange}
                        value={values.documento}
                        isInvalid={!!errors.documento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.documento}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGroupRg">
                      <Form.Label>RG</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="RG"
                        name="rg"
                        onChange={handleChange}
                        value={values.rg}
                        isInvalid={!!errors.rg}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.rg}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGroupdataNascimento">
                      <Form.Label>Data de nascimento</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Data de nascimento"
                        name="dataNascimento"
                        onChange={handleChange}
                        value={values.dataNascimento}
                        isInvalid={!!errors.dataNascimento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dataNascimento}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit">Vincular</Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </Container>
      </>
    );
  }
}
