import { useUserList } from "../context/UserListContext";

export const getUserAvatarByName = (name: string) => {
  const { userList } = useUserList();
  return userList.find((u) => u.name == name)?.avatar ?? "";
};
