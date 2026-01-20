import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Typography from "@/components/typography";
import NavbarItem from "@/components/navbar/navbar_item";
import { createAdmin } from "../helpers/createAdmin";

const AddAdminCard = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", // ✅ Changed from full_name
    email: "",
    password: "",
    role: "admin",
    is_active: false,
  });

  const mutation = useMutation({
    mutationFn: (formData) => createAdmin(formData),
    onSuccess: () => {
      toast.success("Admin created successfully!");
      navigate("/dashboard/admins");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create admin");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const { name, email, password, role, is_active } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Full name, email, and password are required");
      return;
    }

    const payload = {
      name,
      email,
      password,
      role,
      is_active,
    };

    console.log("📤 JSON Payload Preview:", payload);
    mutation.mutate(payload);
  };

  return (
    <>
      <NavbarItem
        title="Add Admin"
        breadcrumbs={[{ title: "Add Admin", isNavigation: false }]}
      />

      <div className="p-10 max-w-6xl mx-auto w-full space-y-6 bg-white rounded-xl border border-gray-200">
        <Typography variant="h3" className="mb-4">
          Add Admin
        </Typography>

        {/* Name */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />
        </div>

        {/* Password */}
        <div className="space-y-2 relative">
          <Label>Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>Role</Label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-30 border rounded px-3 py-2 text-sm"
            disabled
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                is_active: !!checked,
              }))
            }
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Submitting..." : "Create Admin"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddAdminCard;
