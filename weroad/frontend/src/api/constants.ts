import gql from "graphql-tag"
import { query } from "./api"
import type { RoleOutput } from "../graphql/types"

export default {
  async roles(): Promise<RoleOutput[]> {
    const result = await query<{}, { getAllRoles : RoleOutput[] }>(
      gql`
        query GetAllRoles {
            getAllRoles {
                name
            }
        }`,
      {}
    )
    return result?.getAllRoles || []
  }
}
