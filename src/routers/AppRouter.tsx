import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import EmployeeList from "../pages/Employee/EmployeeList";
import ContainerComponent from "../components/Container/ContainerComponent";
import SupplierList from "../pages/Supplier/SupplierList";
import PurchaseOrderList from "../pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderList";
import ProductList from "../pages/Product/ProductList";
import AddProductForm from "../pages/Product/CreateProduct/AddProductForm";
import UpdateProduct from "../pages/Product/UpdateProduct/UpdateProduct";
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ContainerComponent>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route element={<DefaultLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order-product" element={<PurchaseOrderList />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add" element={<AddProductForm />} />
            <Route path="/edit/:id" element={<UpdateProduct />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </ContainerComponent>
    </BrowserRouter>
  );
};
