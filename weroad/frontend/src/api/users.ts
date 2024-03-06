import { toRaw } from "vue"
import gql from "graphql-tag"
import { mutate } from "./api"
import type { UserOutput } from "../graphql/types"

type CreateUserInput = {
  email: string,
  password: string,
  roles: string,
}

export default {
  async createUser({ email, password, roles } : { email: string, password: string, roles: string[] }) {
    const rolesParsed = roles.map((role) => `"${role}"`).join(", ")

    const result = await mutate<CreateUserInput, { createUser: UserOutput }>(
      handle,
      gql`
        mutation CreateUser($email: String!, $password: String!, $roles: String!) {
            createUser(
                input: {
                    email: $email
                    password: $password
                    roles: [$roles]
                }
            ) {
                id
                email
                roles
            }
        }`,
      { email, password, roles: rolesParsed })
    return result ? toRaw(result.createUser) : null
  }
}
