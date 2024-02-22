import { api } from "./api";

export default {
  async getLoggedInUserRole() {
    const response = await api({
      query: `
        query GetLoggedInUserRole {
          getLoggedInUserRole {
            name
          }
        }
      `,
    });
    return response.getLoggedInUserRole;
  },
};
