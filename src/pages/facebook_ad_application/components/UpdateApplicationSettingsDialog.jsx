import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const UpdateApplicationSettingsDialog = ({ open, onOpenChange }) => {
    const queryClient = useQueryClient();
    const [facebook_profile_link, setFacebookProfileLink] = useState("");
    const [bussiness_manager_id, setBusinessManagerId] = useState("");
    const [errors, setErrors] = useState({});

    const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
        queryKey: ["facebookSettings"],
        queryFn: async () => {
            const response = await apiService({ endpoint: endpoints.getFacebookSettings, method: "GET" });
            return response?.response?.data || [];
        },
        enabled: open,
    });

    useEffect(() => {
        const data = Array.isArray(settingsData) ? settingsData[0] : settingsData;
        if (data) {
            setFacebookProfileLink(data.facebook_profile_link || "");
            setBusinessManagerId(data.bussiness_manager_id || "");
        }
    }, [settingsData]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await apiService({
                endpoint: endpoints.updateFacebookSettings,
                method: "PUT",
                data: data,
            });
        },
        onSuccess: (res) => {
            if (res?.response?.success) {
                toast.success("Settings updated successfully");
                queryClient.invalidateQueries(["facebookSettings"]);
                onOpenChange(false);
            } else {
                toast.error(res?.response?.message || "Failed to update settings");
            }
        },
        onError: () => {
            toast.error("An error occurred while updating settings");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!facebook_profile_link) newErrors.facebook_profile_link = "Profile link is required";
        if (!bussiness_manager_id) newErrors.bussiness_manager_id = "Business Manager ID is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        mutation.mutate({
            facebook_profile_link,
            bussiness_manager_id
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold">
                        Facebook Application Settings
                    </DialogTitle>
                </DialogHeader>

                {isLoadingSettings ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Note Box */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-sm text-blue-400">
                                <span className="font-bold">Note:</span> These settings will be displayed to users when they fill out Facebook ad account applications.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="facebook_profile_link" className="text-zinc-100 font-medium">
                                    Facebook Profile Link
                                </Label>
                                <Input
                                    id="facebook_profile_link"
                                    value={facebook_profile_link}
                                    onChange={(e) => setFacebookProfileLink(e.target.value)}
                                    placeholder="https://www.facebook.com/profile"
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
                                />
                                <p className="text-zinc-500 text-sm">
                                    Users will copy this link to share admin access to their pages
                                </p>
                                {errors.facebook_profile_link && (
                                    <p className="text-red-400 text-xs">{errors.facebook_profile_link}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bussiness_manager_id" className="text-zinc-100 font-medium">
                                    Business Manager ID
                                </Label>
                                <Input
                                    id="bussiness_manager_id"
                                    value={bussiness_manager_id}
                                    onChange={(e) => setBusinessManagerId(e.target.value)}
                                    placeholder="Enter Business Manager ID"
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-indigo-500/20 focus:border-indigo-500 h-11"
                                />
                                <p className="text-zinc-500 text-sm">
                                    Users will use this BM ID when submitting applications
                                </p>
                                {errors.bussiness_manager_id && (
                                    <p className="text-red-400 text-xs">{errors.bussiness_manager_id}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white h-10 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Settings"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateApplicationSettingsDialog;
