import { useUserList } from "../context/UserListContext";
import type { User } from "../interfaces/user";

export const getUsers = async (callback?: (users: User[]) => void) => {
  const url = import.meta.env.VITE_API_URL + "/users";
  const response = await fetch(url);
  const { result } = await response.json();

  callback?.(result.users);
};

export const getUserAvatarByName = (name: string) => {
  const { userList } = useUserList();
  return userList.find((u) => u.name == name)?.avatar ?? "";
};
