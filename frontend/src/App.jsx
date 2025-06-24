import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddEditProduct from './pages/seller/AddEditProduct';
import SellerManageOrders from './pages/seller/SellerManageOrders';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import MyOrder from './pages/MyOrder';
import OrderDetail from './pages/OrderDetail';
import './styles/App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <div className="content">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/products" exact component={ProductList} />
                <Route path="/product/:id" component={ProductDetail} />
                <Route path="/admin-dashboard" component={AdminDashboard} />
                <Route path="/admin-users" component={AdminUsers} /> 
                <Route path="/admin-products" component={AdminProducts} />
                <Route path="/seller-dashboard" component={SellerDashboard} />
                <Route path="/seller-products" exact component={SellerProducts} />
                <Route path="/seller-products/add" component={AddEditProduct} />
                <Route path="/seller-products/edit/:id" component={AddEditProduct} />
                <Route path="/seller-orders" component={SellerManageOrders} />
                <Route path="/cart" component={Cart} />
                <Route path="/checkout" component={Checkout} /> 
                <Route path="/profile" component={Profile} />
                <Route path="/change-password" component={ChangePassword} />
                <Route path="/myorders" exact component={MyOrder} />
                <Route path="/myorders/:orderID" component={OrderDetail} />
              </Switch>
            </div>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;