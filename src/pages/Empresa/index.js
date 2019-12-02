import React, { Component } from "react";
import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import "./styles.css";
import * as yup from "yup";
import { Formik } from "formik";
import NavbarComponent from "../../components/Navbar";
import api from "../../services/api";
import swal from "sweetalert";

export default class Empresa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empresas: []
    };
  }

  async componentDidMount() {
    const response = await api.get(`Empresa`);
    this.setState({
      empresas: response.data.data
    });
  }

  handleSubmitEmpresa = e => {
    e.preventDefault();
  };

  render() {
    const { empresas } = this.state;
    const schema = yup.object({
      nomeFantasia: yup.string().required("Nome fantasia é obrigatório"),
      cnpj: yup.string().required("Cnpj é obrigatório"),
      uf: yup.string().required("Uf é obrigatório")
    });
    return (
      <>
        <NavbarComponent></NavbarComponent>
        <Container>
          <Row>
            <Col sm={3}></Col>
            <Col sm={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Cadastro de empresas</Card.Title>
                  <Formik
                    validationSchema={schema}
                    onSubmit={data => {
                      api
                        .post("Empresa", data)
                        .then(data => {
                          if (data.status == 200) {
                            swal(
                              "Sucesso!",
                              "Empresa cadastrada com sucesso!",
                              "success"
                            );
                          } else {
                            swal(
                              "Ooops :(",
                              "Falha ao cadastrar empresa.",
                              "error"
                            );
                          }
                          api.get(`Empresa`).then(response => {
                            this.setState({
                              empresas: response.data.data
                            });
                          });
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
                      nomeFantasia: "",
                      cnpj: "",
                      uf: ""
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
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="formGroupNomeFantasia"
                          >
                            <Form.Label>Nome Fantasia</Form.Label>
                            <Form.Control
                              type="text"
                              name="nomeFantasia"
                              placeholder="Nome Fantasia"
                              value={values.nomeFantasia}
                              onChange={handleChange}
                              isInvalid={!!errors.nomeFantasia}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.nomeFantasia}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            as={Col}
                            md="12"
                            controlId="formGroupCnpj"
                          >
                            <Form.Label>CNPJ</Form.Label>
                            <Form.Control
                              type="text"
                              name="cnpj"
                              placeholder="CNPJ"
                              value={values.cnpj}
                              onChange={handleChange}
                              isInvalid={!!errors.cnpj}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.cnpj}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Col} md="12" controlId="formGroupUf">
                            <Form.Label>Unidade federativa</Form.Label>
                            <Form.Control
                              as="select"
                              name="uf"
                              value={values.uf}
                              onChange={handleChange}
                              isInvalid={!!errors.uf}
                            >
                              <option defaultValue>Selecione</option>
                              <option value="AC">Acre</option>
                              <option value="AL">Alagoas</option>
                              <option value="AP">Amapá</option>
                              <option value="AM">Amazonas</option>
                              <option value="BA">Bahia</option>
                              <option value="CE">Ceará</option>
                              <option value="DF">Distrito Federal</option>
                              <option value="ES">Espírito Santo</option>
                              <option value="GO">Goiás</option>
                              <option value="MA">Maranhão</option>
                              <option value="MT">Mato Grosso</option>
                              <option value="MS">Mato Grosso do Sul</option>
                              <option value="MG">Minas Gerais</option>
                              <option value="PA">Pará</option>
                              <option value="PB">Paraíba</option>
                              <option value="PR">Paraná</option>
                              <option value="PE">Pernambuco</option>
                              <option value="PI">Piauí</option>
                              <option value="RJ">Rio de Janeiro</option>
                              <option value="RN">Rio Grande do Norte</option>
                              <option value="RS">Rio Grande do Sul</option>
                              <option value="RO">Rondônia</option>
                              <option value="RR">Roraima</option>
                              <option value="SC">Santa Catarina</option>
                              <option value="SP">São Paulo</option>
                              <option value="SE">Sergipe</option>
                              <option value="TO">Tocantins</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.uf}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                        <Button type="submit">Cadastrar</Button>
                      </Form>
                    )}
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>CNPJ</th>
                    <th>Nome Fantasia</th>
                    <th>UF</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.cnpj}</td>
                      <td>{emp.nomeFantasia}</td>
                      <td>{emp.uf}</td>
                      <td>
                        <Link
                          to={`/fornecedores/${encodeURIComponent(emp.id)}`}
                        >
                          <Button
                            type="button"
                            variant="outline-warning"
                            size="sm"
                          >
                            Fornecedores
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}
