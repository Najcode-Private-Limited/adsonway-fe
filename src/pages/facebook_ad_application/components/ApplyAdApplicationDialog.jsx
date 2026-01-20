import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { timeZones, accountAmounts } from "../constants";
import { applyForFacebookAdApplication } from "../helpers/applyForFacebookAdApplication";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, Globe, Loader2, MessageSquare, Plus, Receipt, ShieldCheck, Trash2 } from "lucide-react";
import { fetchMyWallet } from "@/components/navbar/helpers/fetchMyWallet";
import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";
import { Checkbox } from "@/components/ui/checkbox";

const ApplyAdApplicationDialog = ({ open, onOpenChange, onSuccess }) => {
    const queryClient = useQueryClient();

    // Form State
    const [formData, setFormData] = useState({
        licenseType: "New License",
        licenseNumber: "",
        numberOfPages: "0",
        pageUrls: [],
        numberOfDomains: "0",
        domainUrls: [],
        hasFullAdminAccess: false,
        adAccounts: [
            {
                accountName: "",
                timeZone: "",
                amount: "",
            },
        ],
        remarks: "",
    });
    const [errors, setErrors] = useState({});

    // Fetch Wallet & Fees
    const { data: walletData } = useQuery({
        queryKey: ["myWallet"],
        queryFn: fetchMyWallet,
        enabled: open,
    });

    // Fetch Facebook Settings
    const { data: settingsData } = useQuery({
        queryKey: ["facebookSettings"],
        queryFn: async () => {
            const response = await apiService({ endpoint: endpoints.getFacebookSettings, method: "GET" });
            const data = response?.response?.data;
            return Array.isArray(data) ? data[0] : data;
        },
        enabled: open,
    });

    const fees = {
        applicationFee: walletData?.paymentFeeRule?.facebook_application_fee || 0,
        commissionPercent: walletData?.paymentFeeRule?.facebook_commission || 0,
    };

    const mutation = useMutation({
        mutationFn: applyForFacebookAdApplication,
        onSuccess: (data) => {
            if (data?.response?.success) {
                toast.success("Application submitted successfully!");
                onOpenChange(false);
                if (onSuccess) onSuccess();
                queryClient.invalidateQueries(["facebookAdApplications"]);
                queryClient.invalidateQueries(["myTransactions"]);
                queryClient.invalidateQueries(["myWallet"]);
            } else {
                toast.error(data?.response?.message || "Failed to submit application");
            }
        },
        onError: () => {
            toast.error("An error occurred");
        }
    });

    // Billing Calculations
    const applicationFee = fees.applicationFee;
    const depositAmount = formData.adAccounts.reduce((sum, acc) => sum + (parseFloat(acc.amount) || 0), 0);
    const depositFee = depositAmount * (fees.commissionPercent / 100);
    const totalCost = applicationFee + depositAmount + depositFee;

    useEffect(() => {
        if (open) {
            setFormData({
                licenseType: "New License",
                licenseNumber: "",
                numberOfPages: "0",
                pageUrls: [],
                numberOfDomains: "0",
                domainUrls: [],
                hasFullAdminAccess: false,
                adAccounts: [{ accountName: "", timeZone: "", amount: "" }],
                remarks: "",
            });
            setErrors({});
        }
    }, [open]);

    // Handlers
    const handleCountChange = (field, countField, value) => {
        const count = parseInt(value);
        const currentItems = [...formData[field]];
        let newItems = [];

        if (count > currentItems.length) {
            newItems = [...currentItems, ...Array(count - currentItems.length).fill("")];
        } else {
            newItems = currentItems.slice(0, count);
        }

        setFormData(prev => ({
            ...prev,
            [countField]: value,
            [field]: newItems
        }));
    };

    const handleArrayInputChange = (field, index, value) => {
        const newItems = [...formData[field]];
        newItems[index] = value;
        setFormData(prev => ({ ...prev, [field]: newItems }));
        if (errors[`${field}.${index}`]) {
            setErrors(prev => ({ ...prev, [`${field}.${index}`]: null }));
        }
    };

    const handleAdAccountChange = (index, field, value) => {
        const updatedAdAccounts = formData.adAccounts.map((account, i) => {
            if (i === index) return { ...account, [field]: value };
            return account;
        });

        setFormData(prev => ({ ...prev, adAccounts: updatedAdAccounts }));
        if (errors[`adAccounts.${index}.${field}`]) {
            setErrors(prev => ({ ...prev, [`adAccounts.${index}.${field}`]: null }));
        }
    };

    const addAdAccount = () => {
        if (formData.adAccounts.length >= 5) {
            toast.error("Maximum 5 ad accounts allowed");
            return;
        }
        setFormData(prev => ({
            ...prev,
            adAccounts: [...prev.adAccounts, { accountName: "", timeZone: "", amount: "" }]
        }));
    };

    const removeAdAccount = (index) => {
        if (formData.adAccounts.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            adAccounts: prev.adAccounts.filter((_, i) => i !== index)
        }));
    };

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.licenseNumber) newErrors.licenseNumber = "License Number is required";
        if (!formData.hasFullAdminAccess) newErrors.hasFullAdminAccess = "You must confirm admin access";

        if (parseInt(formData.numberOfPages) > 0) {
            formData.pageUrls.forEach((url, i) => {
                if (!url) newErrors[`pageUrls.${i}`] = "Required";
            });
        }

        if (parseInt(formData.numberOfDomains) > 0) {
            formData.domainUrls.forEach((url, i) => {
                if (!url) newErrors[`domainUrls.${i}`] = "Required";
            });
        }

        formData.adAccounts.forEach((acc, index) => {
            if (!acc.accountName) newErrors[`adAccounts.${index}.accountName`] = "Required";
            if (!acc.timeZone) newErrors[`adAccounts.${index}.timeZone`] = "Required";
            if (!acc.amount) newErrors[`adAccounts.${index}.amount`] = "Required";
        });

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
            licenseType: formData.licenseType === "New License" ? "new" : "existing",
            licenseNumber: formData.licenseNumber,
            numberOfPages: parseInt(formData.numberOfPages),
            pageUrls: formData.pageUrls,
            hasFullAdminAccess: formData.hasFullAdminAccess,
            numberOfDomains: parseInt(formData.numberOfDomains),
            domainUrls: formData.domainUrls,
            numberOfAccounts: formData.adAccounts.length,
            submissionFee: totalCost,
            adAccounts: formData.adAccounts.map(acc => ({
                accountName: acc.accountName,
                timeZone: acc.timeZone,
                amount: parseFloat(acc.amount),
            })),
            remarks: formData.remarks,
        };

        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[700px] max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-zinc-50/50 dark:bg-zinc-950 border-0 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6" />
                            Apply for Facebook Ad Account
                        </DialogTitle>
                        <p className="text-blue-100 mt-1.5 text-sm">
                            Configure your accounts and review the billing summary before submission.
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8">

                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* License Section */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">License Number *</Label>
                            <div className="space-y-3">
                                <Select
                                    value={formData.licenseType}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, licenseType: val }))}
                                >
                                    <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 w-full">
                                        <SelectValue placeholder="Select License Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New License">New License</SelectItem>
                                        <SelectItem value="Existing License">Existing License</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Enter new license number"
                                    value={formData.licenseNumber}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, licenseNumber: e.target.value }));
                                        if (errors.licenseNumber) setErrors(prev => ({ ...prev, licenseNumber: null }));
                                    }}
                                    className={`bg-white dark:bg-zinc-900 h-11 ${errors.licenseNumber ? "border-red-500" : ""}`}
                                />
                                {errors.licenseNumber && <p className="text-xs text-red-500">{errors.licenseNumber}</p>}
                            </div>
                        </div>

                        {/* Pages Section */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Number of Pages * (Maximum 5)</Label>
                            <Select
                                value={formData.numberOfPages}
                                onValueChange={(val) => handleCountChange("pageUrls", "numberOfPages", val)}
                            >
                                <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 w-full">
                                    <SelectValue placeholder="Select number of pages" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[0, 1, 2, 3, 4, 5].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num === 0 ? "Select number of pages" : num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Dynamic Page Inputs */}
                            {formData.pageUrls.map((url, index) => (
                                <div key={index} className="space-y-1 animate-in slide-in-from-top-2">
                                    <Input
                                        placeholder={`Page URL #${index + 1}`}
                                        value={url}
                                        onChange={(e) => handleArrayInputChange("pageUrls", index, e.target.value)}
                                        className={`h-11 ${errors[`pageUrls.${index}`] ? "border-red-500" : ""}`}
                                    />
                                    {errors[`pageUrls.${index}`] && (
                                        <p className="text-xs text-red-500">This field is required</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Profile Link (Read Only) */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Profile Link (Copy this link) *</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-green-200 dark:border-green-900 rounded-md px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 truncate flex items-center">
                                    {settingsData?.facebook_profile_link || "Not set by admin"}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-900/20"
                                    onClick={() => copyToClipboard(settingsData?.facebook_profile_link, "Profile Link")}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Business Manager ID (Read Only) */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Business Manager ID (Copy this ID) *</Label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border border-blue-200 dark:border-blue-900 rounded-md px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 truncate flex items-center">
                                    {settingsData?.bussiness_manager_id || "Not set by admin"}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    onClick={() => copyToClipboard(settingsData?.bussiness_manager_id, "Business Manager ID")}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Admin Confirmation Checkbox */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4 flex items-start gap-3">
                            <Checkbox
                                id="adminAccess"
                                checked={formData.hasFullAdminAccess}
                                onCheckedChange={(checked) => {
                                    setFormData(prev => ({ ...prev, hasFullAdminAccess: checked }));
                                    if (errors.hasFullAdminAccess) setErrors(prev => ({ ...prev, hasFullAdminAccess: null }));
                                }}
                                className="mt-1 border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-white"
                            />
                            <Label htmlFor="adminAccess" className="text-sm font-medium leading-tight cursor-pointer">
                                I've shared the Full Admin Access of the Pages to the Profile Link mentioned above. *
                            </Label>
                        </div>
                        {errors.hasFullAdminAccess && <p className="text-xs text-red-500">{errors.hasFullAdminAccess}</p>}

                        {/* Domains Section */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Number of Domains *</Label>
                            <Select
                                value={formData.numberOfDomains}
                                onValueChange={(val) => handleCountChange("domainUrls", "numberOfDomains", val)}
                            >
                                <SelectTrigger className="bg-white dark:bg-zinc-900 h-11 w-full">
                                    <SelectValue placeholder="Select number of domains" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[0, 1, 2, 3, 4, 5].map(num => (
                                        <SelectItem key={num} value={num.toString()}>{num === 0 ? "Select number of domains" : num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Dynamic Domain Inputs */}
                            {formData.domainUrls.map((url, index) => (
                                <div key={index} className="space-y-1 animate-in slide-in-from-top-2">
                                    <Input
                                        placeholder={`Domain URL #${index + 1}`}
                                        value={url}
                                        onChange={(e) => handleArrayInputChange("domainUrls", index, e.target.value)}
                                        className={`h-11 ${errors[`domainUrls.${index}`] ? "border-red-500" : ""}`}
                                    />
                                    {errors[`domainUrls.${index}`] && (
                                        <p className="text-xs text-red-500">This field is required</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Ad Accounts Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold text-sm">Ad Accounts * (Maximum 5)</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addAdAccount}
                                    className="h-8"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Account
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {formData.adAccounts.map((account, index) => (
                                    <Card key={index} className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 overflow-hidden transition-all hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-zinc-900">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-medium text-sm text-blue-900 dark:text-blue-100">Ad Account Details</span>
                                                </div>
                                                {formData.adAccounts.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeAdAccount(index)}
                                                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">ACCOUNT NAME</Label>
                                                    <Input
                                                        placeholder="e.g. My E-com Store"
                                                        value={account.accountName}
                                                        onChange={(e) => handleAdAccountChange(index, "accountName", e.target.value)}
                                                        className={`h-9 w-full bg-white dark:bg-zinc-900 border-gray-200 ${errors[`adAccounts.${index}.accountName`] ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-500"}`}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">TIME ZONE</Label>
                                                    <Select
                                                        value={account.timeZone}
                                                        onValueChange={(val) => handleAdAccountChange(index, "timeZone", val)}
                                                    >
                                                        <SelectTrigger className={`h-10 w-full bg-white dark:bg-zinc-900 border-gray-200 truncate ${errors[`adAccounts.${index}.timeZone`] ? "border-red-500 ring-red-500" : ""}`}>
                                                            <SelectValue placeholder="Select Time Zone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeZones.map((tz) => (
                                                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">INITIAL TOP-UP</Label>
                                                    <Select
                                                        value={account.amount ? account.amount.toString() : ""}
                                                        onValueChange={(val) => handleAdAccountChange(index, "amount", val)}
                                                    >
                                                        <SelectTrigger className={`h-10 w-full bg-white dark:bg-zinc-900 border-gray-200 ${errors[`adAccounts.${index}.amount`] ? "border-red-500 ring-red-500" : ""}`}>
                                                            <SelectValue placeholder="Select Amount" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accountAmounts.map((amt) => (
                                                                <SelectItem key={amt.value} value={amt.value.toString()}>
                                                                    {amt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="space-y-3">
                            <Label className="font-semibold text-sm">Message / Remarks (Optional)</Label>
                            <Textarea
                                placeholder="Add any additional notes or remarks..."
                                value={formData.remarks}
                                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Submit Button */}

                        {/* Summary & Action */}
                        {depositAmount > 0 && (
                            <div className="bg-zinc-900 text-white rounded-xl overflow-hidden shadow-lg mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-dashed border-blue-300 dark:border-blue-700/50">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Receipt className="w-5 h-5 text-indigo-400" />
                                        <h3 className="font-semibold text-lg">Payment Summary</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm text-zinc-400">
                                            <span>Application Fee</span>
                                            <span className="text-white font-medium">${applicationFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-zinc-400">
                                            <span> Deposit Amount</span>
                                            <span className="text-white font-medium">${depositAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-zinc-400">
                                            <span>Deposit Fee ({fees.commissionPercent}%)</span>
                                            <span className="text-orange-400 font-medium">+ ${depositFee.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-zinc-700 my-2"></div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Payable</p>
                                            </div>
                                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                                ${totalCost.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-zinc-950 flex justify-end">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={mutation.isPending}
                                    >
                                        {mutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing Request...
                                            </>
                                        ) : (
                                            "Confirm & Pay"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ApplyAdApplicationDialog;
