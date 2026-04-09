import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { User } from "../interfaces/user";

// Types
type State = User[];

type Action =
  | { type: "ADD_USER"; payload: User }
  | { type: "SET_USERS"; payload: User[] };

type ContextType = {
  userList: User[];
  dispatch: React.Dispatch<Action>;
};

// Context
const UserListContext = createContext<ContextType | undefined>(undefined);

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_USER": {
      const existingIndex = state.findIndex(
        (user) => user.id === action.payload.id,
      );

      if (existingIndex !== -1) {
        // update existing user
        return state.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user,
        );
      }

      // add new user
      return [...state, action.payload];
    }

    case "SET_USERS": {
      return action.payload;
    }

    default:
      return state;
  }
};

export const UserListProvider = ({ children }: { children: ReactNode }) => {
  const initialState: State = [];

  const [userList, dispatch] = useReducer(reducer, initialState);

  return (
    <UserListContext.Provider value={{ userList, dispatch }}>
      {children}
    </UserListContext.Provider>
  );
};

// Hook
export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context)
    throw new Error("useUserList must be used within a UserListProvider");
  return context;
};
