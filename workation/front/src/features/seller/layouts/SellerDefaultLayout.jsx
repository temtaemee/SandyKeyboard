import React from "react";
import SellerHeader from "../components/SellerHeader";
import { Outlet } from "react-router-dom";
import Footer from "../../../home/components/layout/Footer";

function SellerDefaultLayout() {
  return (
    <>
      <SellerHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default SellerDefaultLayout;
