export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AccessTokenOutput = {
  __typename?: 'AccessTokenOutput';
  accessToken: Scalars['String'];
};

export type CreateTourInput = {
  currency?: Maybe<Scalars['String']>;
  endingDate: Scalars['DateTime'];
  name: Scalars['String'];
  price: Scalars['Float'];
  startingDate: Scalars['DateTime'];
  travelId: Scalars['String'];
};

export type CreateTravelInput = {
  description: Scalars['String'];
  isPublic: Scalars['Boolean'];
  moods: MoodsInput;
  name: Scalars['String'];
  numberOfDays: Scalars['Float'];
  slug: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  roles: Array<Scalars['String']>;
};

export type DeleteTravelInput = {
  id: Scalars['String'];
};

export type DeletedTravelOutput = {
  __typename?: 'DeletedTravelOutput';
  id: Scalars['String'];
  isDeleted: Scalars['Boolean'];
};

export type GetPaginatedToursInput = {
  filters?: Maybe<GetPaginatedToursInputFilters>;
  order?: Maybe<OrderBy>;
  pagination?: Maybe<Pagination>;
  slug: Scalars['String'];
};

export type GetPaginatedToursInputFilters = {
  endingDate?: Maybe<Scalars['DateTime']>;
  priceFrom?: Maybe<Scalars['Float']>;
  priceTo?: Maybe<Scalars['Float']>;
  startingDate?: Maybe<Scalars['DateTime']>;
};

export type GetPaginatedTravelsInput = {
  pagination?: Maybe<Pagination>;
};

export type GetTourInput = {
  id: Scalars['String'];
};

export type Login = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MoodsInput = {
  culture: Scalars['Int'];
  history: Scalars['Int'];
  nature: Scalars['Int'];
  party: Scalars['Int'];
  relax: Scalars['Int'];
};

export type MoodsOutput = {
  __typename?: 'MoodsOutput';
  culture: Scalars['Int'];
  history: Scalars['Int'];
  nature: Scalars['Int'];
  party: Scalars['Int'];
  relax: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTour: TourOutput;
  createTravel: TravelOutput;
  createUser: UserOutput;
  deleteTravel: DeletedTravelOutput;
  login: AccessTokenOutput;
  updateTour: TourOutput;
};


export type MutationCreateTourArgs = {
  input: CreateTourInput;
};


export type MutationCreateTravelArgs = {
  input: CreateTravelInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteTravelArgs = {
  input: DeleteTravelInput;
};


export type MutationLoginArgs = {
  input: Login;
};


export type MutationUpdateTourArgs = {
  input: UpdateTourInput;
};

export type OrderBy = {
  column?: Maybe<Scalars['String']>;
  orientation?: Maybe<Scalars['String']>;
};

export type PaginatedToursOutput = {
  __typename?: 'PaginatedToursOutput';
  items: Array<TourOutput>;
  totalItems: Scalars['Int'];
};

export type PaginatedTravelsOutput = {
  __typename?: 'PaginatedTravelsOutput';
  items: Array<TravelOutput>;
  totalItems: Scalars['Int'];
};

export type Pagination = {
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  getAllRoles: Array<RoleOutput>;
  getAllTravels: Array<TravelOutput>;
  getLoggedInUserRole: Array<RoleOutput>;
  getTour: TourOutput;
  getTours: PaginatedToursOutput;
  getTravels: PaginatedTravelsOutput;
};


export type QueryGetTourArgs = {
  filter: GetTourInput;
};


export type QueryGetToursArgs = {
  filter: GetPaginatedToursInput;
};


export type QueryGetTravelsArgs = {
  filter: GetPaginatedTravelsInput;
};

export type RoleOutput = {
  __typename?: 'RoleOutput';
  name: Scalars['String'];
};

export type TourOutput = {
  __typename?: 'TourOutput';
  currency: Scalars['String'];
  endingDate: Scalars['DateTime'];
  id: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  startingDate: Scalars['DateTime'];
};

export type TravelOutput = {
  __typename?: 'TravelOutput';
  description: Scalars['String'];
  id: Scalars['String'];
  isPublic: Scalars['Boolean'];
  moods: MoodsOutput;
  name: Scalars['String'];
  numberOfDays: Scalars['Float'];
  numberOfNights: Scalars['Float'];
  slug: Scalars['String'];
  tours: Array<TourOutput>;
};

export type UpdateTourInput = {
  currency?: Maybe<Scalars['String']>;
  endingDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  startingDate?: Maybe<Scalars['DateTime']>;
};

export type UserOutput = {
  __typename?: 'UserOutput';
  email: Scalars['String'];
  id: Scalars['String'];
  roles: Array<Scalars['String']>;
};
