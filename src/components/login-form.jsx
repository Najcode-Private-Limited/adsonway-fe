import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { apiService } from "@/api/api_service/apiService";
import { setToken } from "@/utils/auth";
import { setItem } from "@/utils/local_storage";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";


export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);


  const loginMutation = useMutation({
    mutationFn: (data) =>
      apiService({
        endpoint: endpoints.login,
        method: "POST",
        data,
        removeToken: true,
      }),
    onSuccess: (data) => {
      console.log(":", data);
      const userData = data?.response?.data;
      const user = userData?.user;


      if (!userData?.token) {
        toast.error(userData?.message || "Login failed: No token received.");
        return;
      }


      console.log("User ID:", user?._id);
      console.log("Stored role:", user?.role);


      setToken(userData.token);


      setItem({
        userId: user?._id,
        userName: user?.username,
        userFullName: user?.full_name,
        userEmail: user?.email,
        userRole: user?.role,
        userPhoneNumber: user?.phone_number,
        userOrganization: user?.organization,
        userDisplayPicture: user?.display_picture,
        userDisabled: user?.disabled,
        userIsVerified: user?.isVerified,
        userCreatedAt: user?.createdAt,
        userUpdatedAt: user?.updatedAt,
      });


      toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    },


    onError: (error) => {
      toast.error("Invalid email or password");
    },
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };


  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>


      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Log in</h1>
      </div>


      {/* Form Fields */}
      <div className="grid gap-5">
        {/* Username Field */}
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-gray-400 text-sm">
            Username
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              id="username"
              type="text"
              placeholder="john@adsonway.com"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-[#1a1f2e] border-0 text-white placeholder:text-gray-500 h-12 rounded-lg pl-12 focus-visible:ring-1 focus-visible:ring-[#589BF3]"
            />
          </div>
        </div>


        {/* Password Field */}
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-gray-400 text-sm">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-[#1a1f2e] border-0 text-white placeholder:text-gray-500 h-12 rounded-lg pl-12 pr-12 focus-visible:ring-1 focus-visible:ring-[#589BF3]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>


        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberDevice}
              onCheckedChange={setRememberDevice}
              className="border-gray-500 data-[state=checked]:bg-[#589BF3] data-[state=checked]:border-[#589BF3]"
            />
            <Label htmlFor="remember" className="text-gray-400 text-sm cursor-pointer">
              Remember this device
            </Label>
          </div>
          <a href="#" className="text-[#589BF3] text-sm hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-12 bg-[#589BF3] hover:bg-[#4a8be0] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loginMutation.isPending && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>
      </div>
    </form>
  );
}
