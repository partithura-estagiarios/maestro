import { io } from "socket.io-client";
const userStore = useUserStore();

export const socket = io({
  auth: {
    username: userStore.getUser.name,
    userId: userStore.getUser.id,
  },
});
