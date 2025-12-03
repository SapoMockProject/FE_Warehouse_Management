import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContainerComponent from "../components/Container/ContainerComponent";
import { AuthenticationProvider } from "../contexts/AuthenticationProvider";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import EmployeeList from "../pages/Employee/EmployeeList";
import Login from "../pages/Login/Login";
import PurchaseOrderPage from "../pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreate";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import SupplierList from "../pages/Supplier/SupplierList";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ContainerComponent>
				<AuthenticationProvider>
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard" />} />
						<Route element={<DefaultLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/purchase-order" element={<PurchaseOrderList />} />
							<Route path="/purchase-order/create" element={<PurchaseOrderPage />} />
							<Route path="/employees" element={<EmployeeList />} />
							<Route path="/suppliers" element={<SupplierList />} />
						</Route>
						<Route path="/login" element={<Login />} />
					</Routes>
				</AuthenticationProvider>
			</ContainerComponent>
		</BrowserRouter>
	);
};
