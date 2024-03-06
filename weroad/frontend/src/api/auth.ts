import gql from "graphql-tag"
import { mutate } from "./api"
import type { AccessTokenOutput, Login } from "../graphql/types"

export default {
  async login({ email, password }: { email: string, password: string }): Promise<string | null> {
    const data = await mutate<Login, { login: AccessTokenOutput }>(
      gql`
        mutation Login($email: String!, $password: String!) {
            login(input: { email: $email, password: $password }) {
                accessToken
            }
        }`,
      { email, password }
    )
    return data ? data.login.accessToken : null
  }
}
