import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { actions } = useContext(Context);
  const handleLogout = () => {
    actions.logout();
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <div className="ml-auto">
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};
