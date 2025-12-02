import React from "react";
import type { IUserResponse } from "../types/IUser";
export const AuthenticationContext = React.createContext<IUserResponse | null>(null);