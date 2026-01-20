import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, Upload, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/helpers/profile";
import { uploadFile } from "@/helpers/uploadFile";
import { getItem, setItem } from "@/utils/local_storage";

const ProfileUpdateSheet = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [uploading, setUploading] = useState(false);

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        display_picture: "",
        phone_number: "",
        organization: "",
    });

    // Load data from local storage when sheet opens
    useEffect(() => {
        if (open) {
            setFormData({
                full_name: getItem("userFullName") || "",
                username: getItem("userName") || "",
                email: getItem("userEmail") || "",
                password: "", // Don't prefill password
                display_picture: getItem("userDisplayPicture") || "",
                phone_number: getItem("userPhoneNumber") || "",
                organization: getItem("userOrganization") || "",
            });
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadFile(file);
        setUploading(false);

        if (result?.response?.success) {
            const url = result.response.data?.url || result.response.data;
            setFormData(prev => ({ ...prev, display_picture: url }));
            toast.success("Image uploaded successfully");
        } else {
            toast.error("Failed to upload image");
        }
    };

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (response) => {
            if (response?.response?.success) {
                toast.success("Profile updated successfully!");

                // Update local storage
                const updatedUser = response.response.data;
                const storagePayload = {};

                if (updatedUser.full_name) storagePayload.userFullName = updatedUser.full_name;
                if (updatedUser.username) storagePayload.userName = updatedUser.username;
                if (updatedUser.email) storagePayload.userEmail = updatedUser.email;
                if (updatedUser.display_picture) storagePayload.userDisplayPicture = updatedUser.display_picture;
                if (updatedUser.phone_number) storagePayload.userPhoneNumber = updatedUser.phone_number;
                if (updatedUser.organization) storagePayload.userOrganization = updatedUser.organization;

                setItem(storagePayload);

                queryClient.invalidateQueries(["profile"]);
                onClose();
            } else {
                toast.error(response?.response?.message || "Failed to update profile.");
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update profile.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password
        updateProfileMutation.mutate(payload);
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            {/* Added px-6 to SheetContent? No, usually content is full width. Added p-6 to form. */}
            <SheetContent className="overflow-y-auto sm:max-w-[400px] w-full">
                <SheetHeader>
                    <SheetTitle>Update Profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>

                {/* Added padding here: p-6 instead of py-6 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-2 border-border h-24 w-24">
                                <AvatarImage src={formData.display_picture} className="object-cover" />
                                <AvatarFallback className="text-4xl">{getInitials(formData.full_name)}</AvatarFallback>
                            </Avatar>
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="picture" className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
                                <Upload className="w-4 h-4" />
                                Change Picture
                            </Label>
                            <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="disabled:opacity-100"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="organization">Organization</Label>
                            <Input
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                placeholder="Company Name"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <EyeOff className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending || uploading}>
                            {updateProfileMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default ProfileUpdateSheet;
