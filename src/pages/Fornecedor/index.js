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
      fornecedores: [],
      telefonesFornecedor: [],
      ehPessoaJuridica: false,
      modalShowAddForn: false,
      modalSetShowAddForn: false,
      modalShowAddTele: false,
      modalSetShowAddTele: false,
      acessandoApi: true,
      idEmpresa: ""
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

  handleShowAddForn = () => {
    this.setState({
      modalShowAddForn: true
    });
  };
  handleCloseAddForn = () => {
    this.setState({
      modalShowAddForn: false
    });
  };

  handleShowAddTele = async idFornecedorAdicionandoTelefone => {
    const { data } = await api.get(
      `Fornecedor/obter-telefones?idFornecedor=${idFornecedorAdicionandoTelefone}`
    );
    console.log(data);
    this.setState({
      telefonesFornecedor: data.data,
      modalShowAddTele: true
    });
  };

  handleCloseAddTele = () => {
    this.setState({
      modalShowAddTele: false
    });
  };

  validarPessoaFisica(e) {
    if (e.target.value.length == 10) {
      this.setState({
        ehPessoaJuridica: false
      });
    } else if (e.target.value.length == 14) {
      this.setState({
        ehPessoaJuridica: true
      });
    } else {
      this.setState({
        ehPessoaJuridica: false
      });
    }
  }

  render() {
    const {
      modalShowAddForn,
      modalShowAddTele,
      fornecedores,
      acessandoApi,
      idEmpresa
    } = this.state;

    const schema = yup.object({
      ehPessoaJuridica: yup.boolean(),
      nome: yup.string().required("Nome é obrigatório"),
      documento: yup.string().required("Documento é obrigatório"),
      telefone: yup.string().required("Telefone é obrigatório"),
      rg: yup.string().max(12, "Rg pode ter no máximo 12 caractéres"),
      dataNascimento: yup.string()
    });

    if (acessandoApi) {
      return <h1>Carregando...</h1>;
    } else {
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
                      onClick={this.handleShowAddForn}
                    >
                      Vincular
                    </Button>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Documento</th>
                          <th>Nome</th>
                          <th>Data de Cadastro</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fornecedores.map(forn => (
                          <tr key={forn.id}>
                            <td>{forn.documento}</td>
                            <td>{forn.nome}</td>
                            <td>{forn.dataCadastro}</td>
                            <td>
                              <Button
                                type="button"
                                onClick={e => this.handleShowAddTele(forn.id)}
                              >
                                Adicionar telefone
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Modal show={modalShowAddForn} onHide={this.handleCloseAddForn}>
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

                          this.handleCloseAddForn();
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
                    ehPessoaJuridica: this.state.ehPessoaJuridica,
                    nome: "",
                    documento: "",
                    rg: "",
                    dataNascimento: undefined,
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
                      {this.state.ehPessoaJuridica === false ? (
                        <>
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
                              onChange={handleChange}
                              onKeyUp={e => this.validarPessoaFisica(e)}
                              value={values.documento}
                              isInvalid={!!errors.documento}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.documento}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group controlId="formGroupTelefone">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                              type="tel"
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

                          <Form.Group controlId="formGroupRg">
                            {!!values.ehPessoaJuridica}
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
                            {!!values.ehPessoaJuridica}
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
                        </>
                      ) : (
                        <>
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
                                this.validarPessoaFisica(e);
                              }}
                              value={values.documento}
                              isInvalid={!!errors.documento}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.documento}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group controlId="formGroupTelefone">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                              type="tel"
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
                        </>
                      )}
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>

            <Modal
              size="lg"
              show={modalShowAddTele}
              onHide={this.handleCloseAddTele}
            >
              <Modal.Header closeButton>
                <Modal.Title>Telefones do fornecedor</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Numero</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.telefonesFornecedor.map(tel => (
                      <tr>
                        {/* key={tel.id} */}
                        <td>{tel.telefone}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </Container>
        </>
      );
    }
  }
}
