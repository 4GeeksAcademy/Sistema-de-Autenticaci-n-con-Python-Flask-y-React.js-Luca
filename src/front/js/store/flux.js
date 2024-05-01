import {
	loginWhitEmailAndPassword,
	registerUser,
  } from "../../services/enpoints";
  
  const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		user: {},
		token: null,
	  },
	  actions: {
		saveUser: (user, token) => {
		  setStore({ user: user, token: token });
		},
		login: async (data) => {
		  const res = await loginWhitEmailAndPassword(data);
		  const { token, user } = res;
		  if (token && user) {
			sessionStorage.setItem("token", res.token);
			sessionStorage.setItem("user", JSON.stringify(res.user));
			setStore({ user: res.user, token: res.token });
			return { ok: true };
		  }
		  return { ok: false, msg: res.msg };
		},
		logout: () => {
		  sessionStorage.removeItem("token");
		  sessionStorage.removeItem("user");
		  setStore({ user: {}, token: null });
		},
		register: async (data) => {
		  const res = await registerUser(data);
		  if (res.user) {
			sessionStorage.setItem("token", res.token);
			sessionStorage.setItem("user", JSON.stringify(res.user));
			setStore({ user: res.user, token: res.token });
			return { ok: true };
		  }
		  return { ok: false, msg: res.msg };
		},
	  },
	};
  };
  
  export default getState;
  