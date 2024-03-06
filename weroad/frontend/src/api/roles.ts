import gql from "graphql-tag"
import { query } from "./api"
import type { RoleOutput } from "../graphql/types"


export default {
  async getLoggedInUserRoles(): Promise<RoleOutput[]> {
    const result = await query<{}, { getLoggedInUserRole: RoleOutput[] }>(
      gql`
        query GetLoggedInUserRole {
            getLoggedInUserRole {
                name
            }
        }`,
      {}
    )
    return result?.getLoggedInUserRole || []
  }
}
