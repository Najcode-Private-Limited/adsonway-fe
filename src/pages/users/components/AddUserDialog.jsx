import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createUser } from "../helpers/createUser";

const AddUserDialog = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        username: "",
        password: "",
        role: "user",
        facebook_commission: "",
        google_commission: "",
        snapchat_commission: "",
        tiktok_commission: "",
        facebook_application_fee: "",
        google_application_fee: "",
        snapchat_application_fee: "",
        tiktok_application_fee: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            full_name: "",
            email: "",
            username: "",
            password: "",
            role: "user",
            facebook_commission: "",
            google_commission: "",
            snapchat_commission: "",
            tiktok_commission: "",
            facebook_application_fee: "",
            google_application_fee: "",
            snapchat_application_fee: "",
            tiktok_application_fee: "",
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const addUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: (response) => {
            if (response?.response?.success) {
                toast.success("User added successfully!");
                queryClient.invalidateQueries(["users"]);
                handleClose();
            } else {
                toast.error(response?.response?.message || "Failed to add user.");
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to add user.");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addUserMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new user account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <style>{`
                        /* Chrome, Safari, Edge, Opera */
                        input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }

                        /* Firefox */
                        input[type=number] {
                            -moz-appearance: textfield;
                        }
                    `}</style>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                placeholder="Enter full name"
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
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <EyeOff className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="facebook_commission">Facebook Commission (%)</Label>
                                <Input
                                    id="facebook_commission"
                                    name="facebook_commission"
                                    value={formData.facebook_commission}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="facebook_application_fee">Facebook App Fee</Label>
                                <Input
                                    id="facebook_application_fee"
                                    name="facebook_application_fee"
                                    value={formData.facebook_application_fee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="google_commission">Google Commission (%)</Label>
                                <Input
                                    id="google_commission"
                                    name="google_commission"
                                    value={formData.google_commission}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="google_application_fee">Google App Fee</Label>
                                <Input
                                    id="google_application_fee"
                                    name="google_application_fee"
                                    value={formData.google_application_fee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="snapchat_commission">Snapchat Commission (%)</Label>
                                <Input
                                    id="snapchat_commission"
                                    name="snapchat_commission"
                                    value={formData.snapchat_commission}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="snapchat_application_fee">Snapchat App Fee</Label>
                                <Input
                                    id="snapchat_application_fee"
                                    name="snapchat_application_fee"
                                    value={formData.snapchat_application_fee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tiktok_commission">TikTok Commission (%)</Label>
                                <Input
                                    id="tiktok_commission"
                                    name="tiktok_commission"
                                    value={formData.tiktok_commission}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tiktok_application_fee">TikTok App Fee</Label>
                                <Input
                                    id="tiktok_application_fee"
                                    name="tiktok_application_fee"
                                    value={formData.tiktok_application_fee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={addUserMutation.isPending}>
                            {addUserMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {addUserMutation.isPending ? "Adding..." : "Add User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
