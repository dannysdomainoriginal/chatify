import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { ExtendedError, Socket } from "socket.io";
import { decodedToken } from "@/lib/utils";
import { SocketData } from "types/socket";

type SocketIOMiddleware = (
  socket: Socket<any, any, any, SocketData>,
  next: (err?: ExtendedError) => void,
) => void;

const socketAuthMiddleware: SocketIOMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookie
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as decodedToken;

    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: Invalid user details");
      return next(new Error("Unauthorized - Invalid User"));
    }

    // Attach user info to socket
    socket.data.user = user;
    socket.data.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`,
    );

    next();
  } catch (err) {
    console.log("Error in socket authentication:", err);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

export default socketAuthMiddleware;
