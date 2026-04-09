import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { SearchItem } from "@shared/types";

// Types
type State = SearchItem[];
type Action =
  | { type: "SET_QUEUE"; payload: SearchItem[] }
  | { type: "ADD"; payload: SearchItem }
  | { type: "REMOVE_FIRST" }
  | { type: "REMOVE_AT"; index: number }
  | {
      type: "REMOVE_ITEM";
      payload: { videoId: string; roomCode?: string | null };
    }
  | { type: "MOVE"; from: number; to: number }
  | { type: "DOWNLOADED"; id: string; downloaded: boolean }
  | { type: "OVERRIDE"; index: number };

type ContextType = {
  queue: State;
  dispatch: React.Dispatch<Action>;
};

// Context
const QueueContext = createContext<ContextType | undefined>(undefined);

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_QUEUE":
      return action.payload;

    case "ADD":
      return [...state, action.payload];

    case "REMOVE_FIRST":
      return state.slice(1);

    case "REMOVE_AT":
      if (action.index < 0 || action.index >= state.length) return state;
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1),
      ];

    case "REMOVE_ITEM":
      return state.filter(
        (item) =>
          !(
            item.videoId === action.payload.videoId &&
            item.roomCode === action.payload.roomCode
          ),
      );

    case "MOVE":
      const { from, to } = action;
      if (
        from < 0 ||
        from >= state.length ||
        to < 0 ||
        to >= state.length ||
        from === to
      )
        return state;
      const item = state[from];
      const newState = [...state.slice(0, from), ...state.slice(from + 1)];
      return [...newState.slice(0, to), item, ...newState.slice(to)];

    case "DOWNLOADED": {
      const { id, downloaded } = action;
      return state.map((item) =>
        item.videoId === id ? { ...item, downloaded } : item,
      );
    }

    case "OVERRIDE": {
      const { index } = action;

      if (index < 0 || index >= state.length) return state;

      // Remove everything before the index
      return state.slice(index);
    }
    default:
      return state;
  }
};

// Provider
export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [queue, dispatch] = useReducer(reducer, []);

  return (
    <QueueContext.Provider value={{ queue, dispatch }}>
      {children}
    </QueueContext.Provider>
  );
};

// Hook
export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error("useQueue must be used within a QueueProvider");
  return context;
};
