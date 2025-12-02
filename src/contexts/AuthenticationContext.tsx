import React from "react";
import type { IAuthenticationContext } from "../types/IAuthenticationContext";

export const AuthenticationContext = React.createContext<IAuthenticationContext | null>(null);