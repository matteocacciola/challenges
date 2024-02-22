import { api } from "./api";

export default {
  async login(email: string, password: string) {
    const response = await api({
      query: `
        mutation Login {
          login (
            input: {
              email: "${email}"
              password: "${password}"
            }
          ) {
            accessToken
          }
        }`,
    });

    return response.login.accessToken;
  },
};
