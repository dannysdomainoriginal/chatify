import { UserI } from "@/models/User";

export interface SocketData {
  user: UserI;
  userId: string;
}