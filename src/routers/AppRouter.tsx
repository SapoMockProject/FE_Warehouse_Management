import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContainerComponent from "../components/Container/ContainerComponent";
import { AuthenticationProvider } from "../contexts/AuthenticationProvider";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import EmployeeList from "../pages/Employee/EmployeeList";
import Login from "../pages/Login/Login";
import PurchaseOrderPage from "../pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreate";
import SupplierList from "../pages/Supplier/SupplierList";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import AddProductForm from "../pages/Product/CreateProduct/AddProductForm";
import UpdateProduct from "../pages/Product/UpdateProduct/UpdateProduct";
import ProductList from "../pages/Product/ProductList";
import PurchaseOrderDetail from "../pages/PurchaseOrder/PurchaseOrderDetail/PurchaseOrderDetail";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ContainerComponent>
				<Routes>
					<Route element={<AuthenticationProvider />}>
						<Route path="/" element={<Navigate to="/dashboard" />} />
						<Route element={<DefaultLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/purchase-orders" element={<PurchaseOrderList />} />
							<Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
							<Route path="/purchase-orders/create" element={<PurchaseOrderPage />} />
							<Route path="/employees" element={<EmployeeList />} />
							<Route path="/suppliers" element={<SupplierList />} />
							<Route path="/edit/:id" element={<UpdateProduct />} />
							<Route path="/products/create" element={<AddProductForm />} />
							<Route path="/products" element={<ProductList />} />
						</Route>
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</ContainerComponent>
		</BrowserRouter>
	);

};
