export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Cart = {
  __typename?: 'Cart';
  id: Scalars['ID']['output'];
  products?: Maybe<Array<Maybe<Product>>>;
  restaurant?: Maybe<Restaurant>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart?: Maybe<Cart>;
  createProduct?: Maybe<Product>;
  login?: Maybe<AuthPayload>;
};


export type MutationAddToCartArgs = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateProductArgs = {
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  restaurants?: Maybe<Array<Maybe<Restaurant>>>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryRestaurantsArgs = {
  userId: Scalars['ID']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  cartUpdated?: Maybe<Cart>;
};


export type SubscriptionCartUpdatedArgs = {
  cartId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  restaurants?: Maybe<Array<Maybe<Restaurant>>>;
  username: Scalars['String']['output'];
};
