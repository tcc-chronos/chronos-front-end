import Sidebar from "../components/Sidebar/Sidebar";
import Chart from "../components/Chart";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    const dados = sessionStorage.getItem("formData");
  }, []);
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <Chart />
    </div>
  );
};

export default Dashboard;
