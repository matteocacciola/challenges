import { api } from "./api";

export default {
  async createUser(email: string, password: string, roles: string[]) {
    const response = await api({
      query: `
        mutation CreateUser {
          createUser(
            input: {
              email: "${email}"
              password: "${password}"
              roles: [${roles.map((role) => `"${role}"`).join(", ")}]
            }
          ) {
            id
            email
            roles
          }
        }
      `,
    });
    return response.createUser;
  },
};
