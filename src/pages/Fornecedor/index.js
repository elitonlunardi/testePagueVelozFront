import React, { Component, useState, useEffect } from "react";

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
import { Formik, useFormikContext } from "formik";

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
      dataNascimento: yup.string().required(),
      telefone: yup.string().required()
    });

    function teste(values, setValues) {
      if (values.documento != "") {
        console.log(values.documento);
        var v = values.documento;
        v.replace(/[^0-9.]+/g, "");
        console.log(v);
        values.documento = v;
        console.log(values.documento);
        setValues(values);
      }

      // if (values.documento >= 14) {
      //   let v = values.documento;
      //   if (v.length === 10 || v.length === 14) {
      //     v = v.replace(/[^\d]+/g, "");
      //     //CPF
      //     v = v.replace(/(\d{3})(\d)/, "$1.$2");
      //     v = v.replace(/(\d{3})(\d)/, "$1.$2");
      //     v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      //     values.documento = v;
      //     setValues(values);
      //   } else if (v.length > 14) {
      //     //CNPJ
      //     v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      //     v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      //     v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      //     v = v.replace(/(\d{4})(\d)/, "$1-$2");
      //     values.documento = v;
      //     setValues(values);
      //   }
      // }
    }

    if (acessandoApi) {
      return <h1>Carregando...</h1>;
    }

    return (
      <>
        <NavbarComponent></NavbarComponent>
        <Container>
          <h2 className="textFornecedor">Fornecedores da empresa</h2>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Button
                    className="btnVincularFornecedor"
                    variant="outline-success"
                    onClick={this.handleShow}
                  >
                    Vincular
                  </Button>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Nome</th>
                        <th>Data de Cadastro</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fornecedores.map(forn => (
                        <tr key={forn.id}>
                          <td>{forn.documento}</td>
                          <td>{forn.nome}</td>
                          <td>{forn.dataCadastro}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
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
                  api
                    .post(`Empresa/vincular-fornecedor`, data)
                    .then(response => {
                      if (response.status === 200) {
                        swal(
                          "Sucesso!",
                          "Fornecedor vinculado com sucesso!",
                          "success"
                        );
                        api
                          .get(`Empresa/${data.idEmpresa}/obter-fornecedores`)
                          .then(response => {
                            this.setState({
                              fornecedores: response.data.data
                            });
                          });

                        this.handleClose();
                      } else {
                        swal(
                          "Ooops :(",
                          "Falha ao vincular o fornecedor.",
                          "error"
                        );
                      }
                    })
                    .catch(error => {
                      console.log(error.response);
                      swal(
                        "Ooops :(",
                        `${error.response.data.errors}`,
                        "error"
                      );
                    });
                }}
                initialValues={{
                  nome: "",
                  documento: "",
                  rg: "",
                  dataNascimento: "",
                  telefone: ""
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                  setValues
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
                        type="number"
                        placeholder="CNPJ/CPF"
                        name="documento"
                        onChange={e => {
                          handleChange(e);
                        }}
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

                    <Form.Group controlId="formGroupdataNascimento">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Telefone"
                        name="telefone"
                        onChange={handleChange}
                        value={values.telefone}
                        isInvalid={!!errors.telefone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telefone}
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
