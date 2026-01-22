import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { timeZones } from "@/pages/google_ad_application/constants";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Facebook, Loader2, Plus, Receipt, User, Search, Info, ShieldCheck } from "lucide-react";
import { fetchAllUsers } from "../helpers/fetchAllUsers";
import { createManualAdAccount } from "../helpers/createManualAdAccount";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const CreateAdAccountDialog = ({ open, onOpenChange, onSuccess }) => {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSearchOpen, setUserSearchOpen] = useState(false);

    const [formData, setFormData] = useState({
        license_number: "",
        account_name: "",
        account_id: "",
        timezone: "",
        deposit_amount: 0,
        application_fee: 20,
    });

    const [errors, setErrors] = useState({});

    const { data: usersRes, isLoading: usersLoading } = useQuery({
        queryKey: ["allUsers"],
        queryFn: () => fetchAllUsers({ params: { limit: 1000 } }),
        enabled: open,
    });

    const users = usersRes || [];

    const mutation = useMutation({
        mutationFn: createManualAdAccount,
        onSuccess: (data) => {
            if (data?.response?.success) {
                toast.success("Ad account created successfully!");
                onOpenChange(false);
                if (onSuccess) onSuccess();
                queryClient.invalidateQueries(["allFacebookAccounts"]);
            } else {
                toast.error(data?.response?.message || "Failed to create ad account");
            }
        },
        onError: () => {
            toast.error("An error occurred");
        }
    });

    const commissionRate = selectedUser?.paymentRule?.facebook_commission || 0;
    const depositFee = formData.deposit_amount * (commissionRate / 100);
    const totalCost = formData.application_fee + formData.deposit_amount + depositFee;

    useEffect(() => {
        if (open) {
            setFormData({
                license_number: "",
                account_name: "",
                account_id: "",
                timezone: "",
                deposit_amount: 0,
                application_fee: 0,
            });
            setSelectedUser(null);
            setErrors({});
        }
    }, [open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "deposit_amount" || name === "application_fee" ? parseFloat(value) || 0 : value
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!selectedUser) newErrors.user = "User is required";
        if (!formData.account_name) newErrors.account_name = "Account name is required";
        if (!formData.account_id) newErrors.account_id = "Account ID is required";
        if (!formData.timezone) newErrors.timezone = "Time zone is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            user: selectedUser._id,
            license_number: formData.license_number,
            account_name: formData.account_name,
            account_id: formData.account_id,
            timezone: formData.timezone,
            deposit_amount: formData.deposit_amount,
            application_fee: formData.application_fee,
            deposit_fee: depositFee,
            status: "active"
        };

        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[700px] max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-zinc-50/50 dark:bg-zinc-900 border-0 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6" />
                            Create Facebook Ad Account Manually
                        </DialogTitle>
                        <p className="text-blue-100 mt-1.5 text-sm">
                            Manually provision an ad account for a specific user.
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <form onSubmit={onSubmit} className="space-y-8">

                        {/* User Selection Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                User Selection
                            </h3>

                            <div className="p-6 bg-white dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm space-y-6">
                                <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        <span className="font-bold">Note:</span>Manually create an ad account for a user. The application will be automatically approved and visible in both user and admin panels.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Select User * (Required)</Label>
                                    <Select
                                        value={selectedUser?._id || ""}
                                        onValueChange={(val) => {
                                            const user = users.find(u => u._id === val);
                                            setSelectedUser(user);
                                            if (user?.paymentRule?.facebook_application_fee) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    application_fee: user.paymentRule.facebook_application_fee
                                                }));
                                            }
                                            if (errors.user) setErrors(prev => ({ ...prev, user: null }));
                                        }}
                                    >
                                        <SelectTrigger className={cn("w-full h-11 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700", errors.user && "border-red-500")}>
                                            <SelectValue placeholder="Select User" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users?.map((user) => (
                                                <SelectItem key={user._id} value={user._id}>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-medium">{user.full_name}</span>
                                                        <span className="text-xs text-zinc-500">{user.email}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user && <p className="text-xs text-red-500">{errors.user}</p>}

                                    {selectedUser && (
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                                Selected: <span className="font-normal text-blue-600 dark:text-blue-400">{selectedUser.full_name} ({selectedUser.email})</span>
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                Application Fee: ${selectedUser.paymentRule?.facebook_application_fee || 0} | Facebook Fee: {selectedUser.paymentRule?.facebook_commission || 0}% | Google Fee: {selectedUser.paymentRule?.google_commission || 0}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!selectedUser && (
                            <div className="flex flex-col items-center justify-center py-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-center animate-in fade-in zoom-in duration-300">
                                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full mb-2 ring-1 ring-zinc-200 dark:ring-zinc-700">
                                    <User className="h-4 w-4 text-zinc-400" />
                                </div>
                                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                                    No User Selected
                                </h3>
                                <p className="text-[10px] text-zinc-500 max-w-[10rem]">
                                    Select a user to proceed.
                                </p>
                            </div>
                        )}

                        {selectedUser && (
                            <>
                                {/* Account Details Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                                        Account Configuration
                                    </h3>

                                    <Card className="border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-900/10 overflow-hidden">
                                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">License Number *</Label>
                                                <Input
                                                    name="license_number"
                                                    placeholder="Enter license number"
                                                    value={formData.license_number}
                                                    onChange={handleInputChange}
                                                    className="h-9 bg-white dark:bg-zinc-900 border-gray-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Account Name *</Label>
                                                <Input
                                                    name="account_name"
                                                    placeholder="Enter account name"
                                                    value={formData.account_name}
                                                    onChange={handleInputChange}
                                                    className={cn("h-9 bg-white dark:bg-zinc-900 border-gray-200", errors.account_name && "border-red-500")}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Account ID *</Label>
                                                <Input
                                                    name="account_id"
                                                    placeholder="Enter account ID"
                                                    value={formData.account_id}
                                                    onChange={handleInputChange}
                                                    className={cn("h-9 bg-white dark:bg-zinc-900 border-gray-200", errors.account_id && "border-red-500")}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Time Zone *</Label>
                                                <Select
                                                    value={formData.timezone}
                                                    onValueChange={(val) => {
                                                        setFormData(prev => ({ ...prev, timezone: val }));
                                                        if (errors.timezone) setErrors(prev => ({ ...prev, timezone: null }));
                                                    }}
                                                >
                                                    <SelectTrigger className={cn("w-full h-10 bg-white dark:bg-zinc-900 border-gray-200 truncate", errors.timezone && "border-red-500")}>
                                                        <SelectValue placeholder="Select Time Zone" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timeZones.map((tz) => (
                                                            <SelectItem key={tz} value={tz}>
                                                                {tz}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Financial Configuration */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
                                        Financial Details
                                    </h3>
                                    <Card className="bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700">
                                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Deposit Amount ($)</Label>
                                                <Input
                                                    name="deposit_amount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={formData.deposit_amount || ""}
                                                    onChange={handleInputChange}
                                                    className="h-10 bg-white dark:bg-zinc-900 border-gray-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Application Fee ($)</Label>
                                                <Input
                                                    name="application_fee"
                                                    type="number"
                                                    placeholder="20.00"
                                                    value={formData.application_fee || ""}
                                                    onChange={handleInputChange}
                                                    className="h-10 bg-white dark:bg-zinc-900 border-gray-200"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-zinc-900 text-white rounded-xl overflow-hidden shadow-lg mt-8 border border-dashed border-blue-300 dark:border-blue-700/50">
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Receipt className="w-5 h-5 text-indigo-400" />
                                            <h3 className="font-semibold text-lg">Payment Summary</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm text-zinc-400">
                                                <span>Application Fee</span>
                                                <span className="text-white font-medium">${formData.application_fee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-zinc-400">
                                                <span>Deposit Amount</span>
                                                <span className="text-white font-medium">${formData.deposit_amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-zinc-400">
                                                <span>Deposit Fee ({commissionRate}%)</span>
                                                <span className="text-orange-400 font-medium">+ ${depositFee.toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-zinc-700 my-2"></div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Payable</p>
                                                    <p className="text-[10px] text-zinc-500 mt-1">
                                                        Deducted from {selectedUser.full_name}'s wallet
                                                    </p>
                                                </div>
                                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                                    ${totalCost.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-zinc-950 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => onOpenChange(false)}
                                            className="bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Confirm & Create Account"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAdAccountDialog;
