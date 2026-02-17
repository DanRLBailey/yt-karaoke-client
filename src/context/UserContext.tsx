import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

// Types
type State = string;
type Action = { type: "SET_USER"; payload: string };

type ContextType = {
  user: string;
  dispatch: React.Dispatch<Action>;
};

// Context
const UserContext = createContext<ContextType | undefined>(undefined);

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
};

// Provider
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(reducer, "");

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
