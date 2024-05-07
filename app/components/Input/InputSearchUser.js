import { useApolloClient } from "@apollo/client"
// import { Qu_searchUser } from "../../queries/user"
// import { User, UserFlag } from "../../types/entities/User"
import { InputReactiveSearch } from "./InputReactiveSearch"
// import { UserBadge } from "../User/UserBadge"

export function InputSearchUser({
  value,
  onChange,
  onFetchUsers,
  className,
  classNameResults,
  displayAddress,
  hideInput,
  hideNoResults,
  keyboardSelectedUserIdx,
}) {
  const client = useApolloClient()

//   const searchUsers = async (search) => {
//     const results = await client.query({
//       query: Qu_searchUser,
//       fetchPolicy: "no-cache",
//       variables: {
//         filters: {
//           searchQuery_eq: search,
//           flag_in: [UserFlag.NONE, UserFlag.VERIFIED],
//         },
//       },
//     })
//     return results
//   }

  const resultsIntoUsers = (results) => {
    let users
    if (!results || !results.data || !results.data.users) {
      users = []
    } else {
      users = results.data.users
    }
    if (onFetchUsers) {
      onFetchUsers(users)
    }
    return users
  }

  const valueFromUser = (user) => {
    return user.id
  }

  return (
    <InputReactiveSearch
      value={value}
      onChange={onChange}
      placeholder="user name, tezos address"
      searchFn={searchUsers}
      transformSearchResults={resultsIntoUsers}
      valueFromResult={valueFromUser}
      className={className}
      classNameResults={classNameResults}
      hideInput={hideInput}
      hideNoResults={hideNoResults}
      keyboardSelectedIdx={keyboardSelectedUserIdx}
    >
      {({ item: user }) => (
        <span>{displayAddress}</span>
        // <UserBadge user={user} size="small" displayAddress={displayAddress} />
      )}
    </InputReactiveSearch>
  )
}
