import { useUserList } from "../context/UserListContext";
import type { User } from "../interfaces/user";

export const getUsers = async (
  roomCode: string,
  callback?: (users: User[]) => void,
) => {
  const url = import.meta.env.VITE_API_URL + "/users?roomCode=" + roomCode;
  const response = await fetch(url);
  const { result } = await response.json();

  callback?.(result.users);
};

export const onboardUser = async (
  user: User,
  callback?: (users: User[]) => void,
) => {
  const url = import.meta.env.VITE_API_URL + "/users/onboard";
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (callback) await getUsers(user.roomCode ?? "", callback);
};

export const getUserAvatarByName = (name: string) => {
  const { userList } = useUserList();
  return userList.find((u) => u.name == name)?.avatar ?? "";
};

export const getUserByName = (userList: User[], name?: string) => {
  if (!name) return undefined;
  return userList.find((u) => u.name === name);
};
