import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingCart,
  DollarSign,
  IndianRupee
} from "lucide-react";

const analyticsData = [
  {
    title: "Total Sales",
    value: "₹1,50,000",
    change: "+12%",
    icon: IndianRupee,
  },
  { title: "New Users", value: "1,234", change: "+8%", icon: Users },
  { title: "Orders", value: "567", change: "-2%", icon: ShoppingCart },
];

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
      {analyticsData.map((data, index) => (
        <CardStats key={index} {...data} />
      ))}
    </div>
  );
};

export default AnalyticsCards;

function CardStats({ title, value, change, icon: Icon }) {
  const isPositive = change.startsWith("+");

  return (
    <Card className="py-4 shadow-md border gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Button variant="outline">
          <Icon className="w-5 h-5 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`text-sm flex items-center ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {change} from last month
        </div>
      </CardContent>
    </Card>
  );
}
