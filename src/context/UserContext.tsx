import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { User } from "../interfaces/user";

// Types
type State = User;

type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_USER_NAME"; payload: string }
  | { type: "SET_PROFILE_IMAGE"; payload: string }
  | { type: "SET_SOUND_EFFECT"; payload: string };

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

    case "SET_USER_NAME":
      return { ...state, name: action.payload };

    case "SET_PROFILE_IMAGE":
      return { ...state, avatar: action.payload };

    case "SET_SOUND_EFFECT":
      return { ...state, soundEffect: action.payload };

    default:
      return state;
  }
};

const randomString = (length = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

const STORAGE_KEY = "user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const getInitialState = (): State => {
    if (typeof window === "undefined") {
      return {
        id: randomString(),
        name: "",
        avatar: "",
        soundEffect: "",
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as State;
      } catch {
        // corrupted storage, reset it
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    return {
      id: randomString(),
      name: "",
      avatar: "",
      soundEffect: "",
    };
  };

  const [user, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
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
