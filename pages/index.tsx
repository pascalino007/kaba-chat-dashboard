import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout/Layout";

const Dashboard: React.FC = () => {
  const router = useRouter();
/* 
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // If no token, redirect to login
      router.replace("/login"); 
    }
  }, [router]); */

  return (
    <Layout>
      <div className="space-y-6">
        
      </div>
    </Layout>
  );
};

export default Dashboard;
