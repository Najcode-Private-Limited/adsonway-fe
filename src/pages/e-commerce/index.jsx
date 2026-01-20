import NavbarItem from "@/components/navbar/navbar_item";
import ProductsTable from "./components/ProductsTable";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopProducts = () => {
    return (
        <div className="flex flex-col gap-4">
            <NavbarItem title="E-commerce" />

            <div className="bg-card rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground">Top products</h2>
                        <p className="text-muted-foreground text-sm mt-1">Detailed information about the products</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search"
                                className="pl-9 w-[200px] bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <ProductsTable />

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="text-foreground">1-6</span> out of <span className="text-foreground">12</span> items {"  "}
                        <button className="text-primary hover:underline ml-2">Show all</button>
                    </p>

                    <button className="bg-[#589BF3] hover:bg-[#4a8be0] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                        Purchase Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;
