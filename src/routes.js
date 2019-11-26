import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Empresa from "./pages/Empresa";
import Fornecedor from "./pages/Fornecedor";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Empresa} />
        <Route path="/fornecedores/:idEmpresa" component={Fornecedor} />
      </Switch>
    </BrowserRouter>
  );
}
