import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import EmployeeList from "../pages/Employee/EmployeeList";
import ContainerComponent from "../components/Container/ContainerComponent";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ContainerComponent>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" />} />
					<Route element={<DefaultLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/employees" element={<EmployeeList />} />
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</ContainerComponent>
		</BrowserRouter>
	);
};
