import React from "react";
import { useQuery, useLazyQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetAllUsers {
    users {
      id
      firstName
      lastName
      nationality
      posts {
        title
      }
      friends {
        id
        firstName
        lastName
      }
    }
  }
`;

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      firstName
      lastName
      nationality
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserType){
    createUser(input: $input) {
      firstName
      lastName
      maidenName
      age
    }
  }
`;

const createUserVariable = {
  input: {
    firstName: "Krish",
    lastName: "Bhattacharyya",
    email: "kk@gmail.com"
  }
}

function App() {
  const { loading, error, data } = useQuery(GET_USERS);

  const [
    fetchFirstUser,
    { loading: userLoading, error: isUserError, data: userData },
  ] = useLazyQuery(GET_USER);

  const [createUser, { data: createUserData, loading: createLoading, error: createError }] = useMutation(CREATE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  if (userLoading) return <p>Loading...</p>;
  if (isUserError) return <p>Error : {isUserError.message}</p>;

  if (createLoading) return <p>Loading...</p>;
  if (createError) return <p>Error : {createError.message}</p>;

  console.log(JSON.stringify(createUserData));

  return (
    <>
      {data.users.map(
        ({
          id,
          firstName,
          lastName,
          nationality,
        }: {
          id: number;
          firstName: string;
          lastName: string;
          nationality: string;
        }) => (
          <div key={id}>
            <div>
              {firstName} {lastName}-- {nationality}
            </div>
          </div>
        )
      )}

      <br />
      <b>Single User</b>
      {userData?.user?.firstName}
      <button onClick={() => fetchFirstUser({ variables: { userId: 1 } })}>
        Fetch first User
      </button>

      <br />
      <b>Create User</b>
      {createUserData?.createUser?.firstName}
      <button onClick={() => createUser({ variables: createUserVariable })}>
        Create User
      </button>
    </>
  );
}

export default App;
