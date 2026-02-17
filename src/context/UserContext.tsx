import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

// Types
type User = {
  name: string;
  avatar: string; // image URL
};

type State = User;

type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_PROFILE_IMAGE"; payload: string };

type ContextType = {
  user: User;
  dispatch: React.Dispatch<Action>;
};

// Context
const UserContext = createContext<ContextType | undefined>(undefined);

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;

    case "SET_PROFILE_IMAGE":
      return { ...state, avatar: action.payload };

    default:
      return state;
  }
};

// Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const initialState: State = {
    name: "",
    avatar: "",
  };

  const [user, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ user: user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
