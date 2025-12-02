import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import EmployeeList from "../pages/Employee/EmployeeList";
import ContainerComponent from "../components/Container/ContainerComponent";
import SupplierList from "../pages/Supplier/SupplierList";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import PurchaseOrderPage from "../pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreate";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ContainerComponent>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" />} />
					<Route element={<DefaultLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/purchase-order" element={<PurchaseOrderList />} />
						<Route path="/purchase-order/create" element={<PurchaseOrderPage/>} />
						<Route path="/employees" element={<EmployeeList />} />
						<Route path="/suppliers" element={<SupplierList />} />
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</ContainerComponent>
		</BrowserRouter>
	);
};
