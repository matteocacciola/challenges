import { api } from "./api";

export default {
  async roles() {
    const response = await api({
      query: `
        query GetAllRoles {
          getAllRoles {
            name
          }
        }
      `,
    });
    return response.getAllRoles;
  },
};
