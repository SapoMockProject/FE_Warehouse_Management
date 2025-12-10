import React from "react";
import type { IUserResponse } from "../types/IUser";
export const AuthenticationContext = React.createContext<({ user: IUserResponse } & { refreshUser: () => void }) | null>(null);
