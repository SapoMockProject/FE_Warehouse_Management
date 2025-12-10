import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const axiosConfiguration = axios.create({
	baseURL: "http://localhost:8080/api/v1",
	headers: {
		"X-Request-Id": uuidv4(),
		"Content-Type": "application/json",
	},
});