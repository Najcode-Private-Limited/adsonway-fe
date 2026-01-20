import NavbarItem from "@/components/navbar/navbar_item";
// import AnalyticsCards from "./components/AnalyticsCards";
import DashboardCharts from "./components/DashboardCharts";
import NewDashboard from "./components/NewDashboard";
import ProductsTable from "../e-commerce/components/ProductsTable";

const Dashboard = () => {
  return (
    <div >
      {/* <NavbarItem title="Dashboard" /> */}
      {/* <AnalyticsCards /> */}


      <NewDashboard />
      <DashboardCharts />
      <ProductsTable />

    </div>
  );
};

export default Dashboard;
