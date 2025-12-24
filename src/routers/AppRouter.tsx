import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import ContainerComponent from "../components/Container/ContainerComponent";
import { AuthenticationProvider } from "../contexts/AuthenticationProvider";
import { DefaultLayout } from "../layouts/DefaultLayout";
import DetailAccount from "../pages/AccountDetail/DetailAccount";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import DetailEmployee from "../pages/Employee/DetailEmployee/DetailEmployee";
import EmployeeList from "../pages/Employee/EmployeeList";
import GoodsReceiptList from "../pages/GoodsReceipt/GoodReceiptList/GoodsReceiptList";
import GoodsReceiptCreate from "../pages/GoodsReceipt/GoodsReceiptCreate/GoodsReceiptCreate";
import GoodsReceiptDetail from "../pages/GoodsReceipt/GoodsReceiptDetail/GoodsReceiptDetail";
import Login from "../pages/Login/Login";
import NotFoundPage from "../pages/NotFound/NotFound";
import AddProductForm from "../pages/Product/CreateProduct/AddProductForm";
import ProductList from "../pages/Product/ProductList";
import UpdateProduct from "../pages/Product/UpdateProduct/UpdateProduct";
import PurchaseOrderCreate from "../pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreate";
import PurchaseOrderDetail from "../pages/PurchaseOrder/PurchaseOrderDetail/PurchaseOrderDetail";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import PurchaseOrderEdit from "../pages/PurchaseOrder/PurchaseOrderUpdate/PurchaseOrderUpdate";
import DetailSupplier from "../pages/Supplier/DetailSupplier/DetailSupplier";
import SupplierList from "../pages/Supplier/SupplierList";
import VerifyAccountPage from "../pages/VerifyAccount/VerifyAccount";
import SupplierReturnCreate from "../pages/SupplierReturn/SupplierReturnCreate/SupplierReturnCreate";
import SupplierReturnList from "../pages/SupplierReturn/SupplierReturnList/SupplierReturnList";

export const AppRouter = () => {
	return (
		<BrowserRouter>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
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
							<Route path="/account" element={<DetailAccount />} />
							<Route path="/employees/:id" element={<DetailEmployee />} />
							<Route path="/suppliers" element={<SupplierList />} />
							<Route path="/suppliers/:id" element={<DetailSupplier />} />
							<Route path="/products/:id" element={<UpdateProduct />} />
							<Route path="/products/create" element={<AddProductForm />} />
							<Route path="/products" element={<ProductList />} />
							<Route path="/supplier-returns/create" element={<SupplierReturnCreate />} />
							<Route path="/supplier-returns" element={<SupplierReturnList />} />
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
