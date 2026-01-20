import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample product data matching the Aurora dashboard
const products = [
    {
        id: 1,
        name: "Shanty Cotton Seat",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
        vendors: [
            { name: "John", avatar: "https://i.pravatar.cc/40?img=1" },
            { name: "Jane", avatar: "https://i.pravatar.cc/40?img=2" },
        ],
        margin: 981.00,
        sold: 29536,
        inStock: true,
    },
    {
        id: 2,
        name: "Practical Soft Couch",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80&h=80&fit=crop",
        vendors: [
            { name: "Mike", avatar: "https://i.pravatar.cc/40?img=3" },
            { name: "Sarah", avatar: "https://i.pravatar.cc/40?img=4" },
            { name: "Tom", avatar: "https://i.pravatar.cc/40?img=5" },
            { name: "Lisa", avatar: "https://i.pravatar.cc/40?img=6" },
        ],
        margin: 199.00,
        sold: 27700,
        inStock: true,
    },
    {
        id: 3,
        name: "Rustic Rubber Chair",
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=80&h=80&fit=crop",
        vendors: [
            { name: "Alex", avatar: "https://i.pravatar.cc/40?img=7" },
            { name: "Emma", avatar: "https://i.pravatar.cc/40?img=8" },
            { name: "Chris", avatar: "https://i.pravatar.cc/40?img=9" },
            { name: "Kate", avatar: "https://i.pravatar.cc/40?img=10" },
            { name: "+2", avatar: "" },
        ],
        margin: 609.00,
        sold: 21778,
        inStock: false,
    },
    {
        id: 4,
        name: "Ergonomic Frozen Bacon",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
        vendors: [
            { name: "David", avatar: "https://i.pravatar.cc/40?img=11" },
            { name: "Anna", avatar: "https://i.pravatar.cc/40?img=12" },
            { name: "Mark", avatar: "https://i.pravatar.cc/40?img=13" },
            { name: "Lily", avatar: "https://i.pravatar.cc/40?img=14" },
        ],
        margin: 923.00,
        sold: 20272,
        inStock: true,
    },
    {
        id: 5,
        name: "Unbranded Metal Sofa",
        image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=80&h=80&fit=crop",
        vendors: [
            { name: "Peter", avatar: "https://i.pravatar.cc/40?img=15" },
            { name: "Mary", avatar: "https://i.pravatar.cc/40?img=16" },
        ],
        margin: 119.00,
        sold: 17374,
        inStock: true,
    },
    {
        id: 6,
        name: "Intelligent Soft Sofa",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=80&h=80&fit=crop",
        vendors: [
            { name: "James", avatar: "https://i.pravatar.cc/40?img=17" },
            { name: "Sophie", avatar: "https://i.pravatar.cc/40?img=18" },
            { name: "Ryan", avatar: "https://i.pravatar.cc/40?img=19" },
        ],
        margin: 595.00,
        sold: 14374,
        inStock: false,
    },
];

const ProductsTable = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleProduct = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map((p) => p.id));
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-4 px-4 text-left w-12">
                            <Checkbox
                                checked={selectedProducts.length === products.length}
                                onCheckedChange={toggleAll}
                                className="border-[#3a3f47] data-[state=checked]:bg-[#589BF3] data-[state=checked]:border-[#589BF3]"
                            />
                        </th>
                        <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground">Vendors</th>
                        <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground">Margin</th>
                        <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground">Sold</th>
                        <th className="py-4 px-4 text-left text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="py-4 px-4 text-left w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={() => toggleProduct(product.id)}
                                    className="border-[#3a3f47] data-[state=checked]:bg-[#589BF3] data-[state=checked]:border-[#589BF3]"
                                />
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex -space-x-2">
                                    {product.vendors.slice(0, 4).map((vendor, index) => (
                                        <Avatar
                                            key={index}
                                            className="w-8 h-8 border-2 border-card"
                                        >
                                            <AvatarImage src={vendor.avatar} alt={vendor.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {vendor.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {product.vendors.length > 4 && (
                                        <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-card flex items-center justify-center text-xs font-medium text-white">
                                            +{product.vendors.length - 4}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className="text-sm text-foreground">${product.margin.toFixed(2)}</span>
                            </td>
                            <td className="py-4 px-4">
                                <span className="text-sm text-foreground">{product.sold.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-4">
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${product.inStock
                                        ? "bg-teal-500/20 text-teal-400"
                                        : "bg-amber-500/20 text-amber-400"
                                        }`}
                                >
                                    {product.inStock ? "In Stock" : "Low Stock"}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductsTable;
