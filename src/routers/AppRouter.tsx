import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContainerComponent from "../components/Container/ContainerComponent";
import { AuthenticationProvider } from "../contexts/AuthenticationProvider";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import EmployeeList from "../pages/Employee/EmployeeList";
import Login from "../pages/Login/Login";
import SupplierList from "../pages/Supplier/SupplierList";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import PurchaseOrderDetail from "../pages/PurchaseOrder/PurchaseOrderDetail/PurchaseOrderDetail";
import PurchaseOrderCreate from "../pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreate";
import PurchaseOrderEdit from "../pages/PurchaseOrder/PurchaseOrderUpdate/PurchaseOrderUpdate";
import AddProductForm from "../pages/Product/CreateProduct/AddProductForm";
import UpdateProduct from "../pages/Product/UpdateProduct/UpdateProduct";
import ProductList from "../pages/Product/ProductList";
import DetailSupplier from "../pages/Supplier/DetailSupplier/DetailSupplier";
import DetailEmployee from "../pages/Employee/DetailEmployee/DetailEmployee";
import NotFoundPage from "../pages/NotFound/NotFound";
import GoodsReceiptCreate from "../pages/GoodsReceipt/GoodsReceiptCreate/GoodsReceiptCreate";
import GoodsReceiptList from "../pages/GoodsReceipt/GoodReceiptList/GoodsReceiptList";
import GoodsReceiptDetail from "../pages/GoodsReceipt/GoodsReceiptDetail/GoodsReceiptDetail";
import VerifyAccountPage from "../pages/VerifyAccount/VerifyAccount";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ContainerComponent>
				<Routes>
					<Route element={<AuthenticationProvider />}>
						<Route element={<DefaultLayout />}>
							<Route path="/" element={<Navigate to="/dashboard" />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/purchase-orders" element={<PurchaseOrderList />} />
							<Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
							<Route path="/purchase-orders/create" element={<PurchaseOrderCreate />} />
							<Route path="/purchase-orders/:id/edit" element={<PurchaseOrderEdit />} />
							<Route path="/goods-receipts" element={<GoodsReceiptList />} />
							<Route path="/goods-receipts/:id" element={<GoodsReceiptDetail />} />
							<Route path="/goods-receipts/create" element={<GoodsReceiptCreate />} />
							<Route path="/employees" element={<EmployeeList />} />
							<Route path="/account" element={<DetailEmployee />} />
							<Route path="/suppliers" element={<SupplierList />} />
							<Route path="/suppliers/:id" element={<DetailSupplier />} />
							<Route path="/products/:id" element={<UpdateProduct />} />
							<Route path="/products/create" element={<AddProductForm />} />
							<Route path="/products" element={<ProductList />} />
						</Route>
					</Route>
					<Route path="/verify-account" element={<VerifyAccountPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</ContainerComponent>
		</BrowserRouter>
	);
};
