import gql from 'graphql-tag';
import * as Urql from '@urql/vue';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessTokenOutput', accessToken: string } };

export type GetAllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllRolesQuery = { __typename?: 'Query', getAllRoles: Array<{ __typename?: 'RoleOutput', name: string }> };

export type CreateTourMutationVariables = Exact<{
  travelId: Scalars['String'];
  name: Scalars['String'];
  startingDate: Scalars['DateTime'];
  endingDate: Scalars['DateTime'];
  price: Scalars['Float'];
  currency: Scalars['String'];
}>;


export type CreateTourMutation = { __typename?: 'Mutation', createTour: { __typename?: 'TourOutput', id: string, name: string, startingDate: any, endingDate: any, price: number, currency: string } };

export type UpdateTourMutationVariables = Exact<{
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  startingDate?: Maybe<Scalars['DateTime']>;
  endingDate?: Maybe<Scalars['DateTime']>;
  price?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
}>;


export type UpdateTourMutation = { __typename?: 'Mutation', updateTour: { __typename?: 'TourOutput', id: string, name: string, startingDate: any, endingDate: any, price: number, currency: string } };

export type GetToursQueryVariables = Exact<{
  slug: Scalars['String'];
  priceFrom?: Maybe<Scalars['Float']>;
  priceTo?: Maybe<Scalars['Float']>;
  startingDate?: Maybe<Scalars['DateTime']>;
  endingDate?: Maybe<Scalars['DateTime']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  orderDirection?: Maybe<Scalars['String']>;
}>;


export type GetToursQuery = { __typename?: 'Query', getTours: { __typename?: 'PaginatedToursOutput', totalItems: number, items: Array<{ __typename?: 'TourOutput', id: string, name: string, startingDate: any, endingDate: any, price: number, currency: string }> } };

export type GetTourQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetTourQuery = { __typename?: 'Query', getTour: { __typename?: 'TourOutput', id: string, name: string, startingDate: any, endingDate: any, price: number, currency: string } };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    accessToken
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const GetAllRolesDocument = gql`
    query GetAllRoles {
  getAllRoles {
    name
  }
}
    `;

export function useGetAllRolesQuery(options: Omit<Urql.UseQueryArgs<never, GetAllRolesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllRolesQuery>({ query: GetAllRolesDocument, ...options });
};
export const CreateTourDocument = gql`
    mutation CreateTour($travelId: String!, $name: String!, $startingDate: DateTime!, $endingDate: DateTime!, $price: Float!, $currency: String!) {
  createTour(
    input: {travelId: $travelId, name: $name, startingDate: $startingDate, endingDate: $endingDate, price: $price, currency: $currency}
  ) {
    id
    name
    startingDate
    endingDate
    price
    currency
  }
}
    `;

export function useCreateTourMutation() {
  return Urql.useMutation<CreateTourMutation, CreateTourMutationVariables>(CreateTourDocument);
};
export const UpdateTourDocument = gql`
    mutation UpdateTour($id: String!, $name: String, $startingDate: DateTime, $endingDate: DateTime, $price: Float, $currency: String) {
  updateTour(
    input: {id: $id, name: $name, startingDate: $startingDate, endingDate: $endingDate, price: $price, currency: $currency}
  ) {
    id
    name
    startingDate
    endingDate
    price
    currency
  }
}
    `;

export function useUpdateTourMutation() {
  return Urql.useMutation<UpdateTourMutation, UpdateTourMutationVariables>(UpdateTourDocument);
};
export const GetToursDocument = gql`
    query GetTours($slug: String!, $priceFrom: Float, $priceTo: Float, $startingDate: DateTime, $endingDate: DateTime, $page: Int, $pageSize: Int, $orderDirection: String) {
  getTours(
    filter: {slug: $slug, filters: {priceFrom: $priceFrom, priceTo: $priceTo, startingDate: $startingDate, endingDate: $endingDate}, pagination: {page: $page, pageSize: $pageSize}, order: {column: "price", orientation: $orderDirection}}
  ) {
    items {
      id
      name
      startingDate
      endingDate
      price
      currency
    }
    totalItems
  }
}
    `;

export function useGetToursQuery(options: Omit<Urql.UseQueryArgs<never, GetToursQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetToursQuery>({ query: GetToursDocument, ...options });
};
export const GetTourDocument = gql`
    query GetTour($id: String!) {
  getTour(filter: {id: $id}) {
    id
    name
    startingDate
    endingDate
    price
    currency
  }
}
    `;

export function useGetTourQuery(options: Omit<Urql.UseQueryArgs<never, GetTourQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetTourQuery>({ query: GetTourDocument, ...options });
};