import React, { useContext } from "react";
import { Context } from "../store/appContext";

const Private = () => {
  const { store } = useContext(Context);

  const { user } = store;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Página privada</h2>
          <h5 className="mb-4">Has inciado sesión con: {user.email}</h5>
        </div>
      </div>
    </div>
  );
};

export default Private;
