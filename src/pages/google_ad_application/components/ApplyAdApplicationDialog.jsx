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
import { applyForGoogleAdApplication } from "../helpers/applyForGoogleAdApplication";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Globe, Mail, MessageSquare, Plus, Receipt, ShieldCheck, Loader2 } from "lucide-react";
import { fetchMyWallet } from "@/components/navbar/helpers/fetchMyWallet";



const ApplyAdApplicationDialog = ({ open, onOpenChange, onSuccess }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        numberOfAccounts: "1",
        promotionalWebsite: "",
        gmailId: "",
        remarks: "",
        adAccounts: [
            {
                accountName: "",
                timeZone: "",
                amount: "",
            },
        ],
    });
    const [errors, setErrors] = useState({});
    const { data: walletData } = useQuery({
        queryKey: ["myWallet"],
        queryFn: fetchMyWallet,
        enabled: open,
    });

    const fees = {
        applicationFee: walletData?.paymentFeeRule?.google_application_fee || 0,
        commissionPercent: walletData?.paymentFeeRule?.google_commission || 0,
    };
    const mutation = useMutation({
        mutationFn: applyForGoogleAdApplication,
        onSuccess: (data) => {
            if (data?.response?.success) {
                toast.success("Application submitted successfully!");
                onOpenChange(false);
                if (onSuccess) onSuccess();
                queryClient.invalidateQueries(["adApplications"]);
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
                numberOfAccounts: "1",
                promotionalWebsite: "",
                gmailId: "",
                remarks: "",
                adAccounts: [{ accountName: "", timeZone: "", amount: "" }],
            });
            setErrors({});
        }
    }, [open]);



    const handleNumberOfAccountsChange = (value) => {
        const count = parseInt(value);
        const currentAdAccounts = [...formData.adAccounts];
        let newAdAccounts = [];

        if (count > currentAdAccounts.length) {
            newAdAccounts = [...currentAdAccounts];
            for (let i = currentAdAccounts.length; i < count; i++) {
                newAdAccounts.push({ accountName: "", timeZone: "", amount: "" });
            }
        } else {
            newAdAccounts = currentAdAccounts.slice(0, count);
        }

        setFormData((prev) => ({
            ...prev,
            numberOfAccounts: value,
            adAccounts: newAdAccounts,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleAdAccountChange = (index, field, value) => {
        const updatedAdAccounts = formData.adAccounts.map((account, i) => {
            if (i === index) return { ...account, [field]: value };
            return account;
        });

        setFormData((prev) => ({ ...prev, adAccounts: updatedAdAccounts }));
        if (errors[`adAccounts.${index}.${field}`]) {
            setErrors((prev) => ({ ...prev, [`adAccounts.${index}.${field}`]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.promotionalWebsite) newErrors.promotionalWebsite = "Promotional website is required";
        if (!formData.gmailId) newErrors.gmailId = "Gmail ID is required";
        else if (!/^\S+@\S+$/i.test(formData.gmailId)) newErrors.gmailId = "Please enter a valid email address";

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
            numberOfAccounts: parseInt(formData.numberOfAccounts),
            gmailId: formData.gmailId,
            promotionalWebsite: formData.promotionalWebsite,
            remarks: formData.remarks,
            submissionFee: totalCost,
            adAccounts: formData.adAccounts.map(acc => ({
                accountName: acc.accountName,
                timeZone: acc.timeZone,
                amount: parseFloat(acc.amount),
            })),
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
                            Apply for Google Ad Account
                        </DialogTitle>
                        <p className="text-blue-100 mt-1.5 text-sm">
                            Configure your accounts and review the billing summary before submission.
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <form onSubmit={onSubmit} className="space-y-8">

                        {/* Configuration Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                    Account Configuration
                                </h3>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">How many accounts do you need?</Label>
                                    <Select
                                        value={formData.numberOfAccounts}
                                        onValueChange={handleNumberOfAccountsChange}
                                    >
                                        <SelectTrigger className="w-full bg-transparent border-gray-200 focus:ring-blue-500 h-11">
                                            <SelectValue placeholder="Select number of accounts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} Account{num > 1 ? 's' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[11px] text-gray-500">Maximum 5 accounts per application.</p>
                                </div>
                            </div>

                            {/* Dynamic Cards */}
                            <div className="grid grid-cols-1 gap-4">
                                {formData.adAccounts.map((account, index) => (
                                    <Card key={index} className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 overflow-hidden transition-all hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-3 flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-zinc-900">
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-sm text-blue-900 dark:text-blue-100">Ad Account Details</span>
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
                                                                <SelectItem key={tz} value={tz}>
                                                                    {tz}
                                                                </SelectItem>
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

                        <Separator className="bg-gray-200 dark:bg-zinc-800" />

                        {/* General Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                                General Information
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-500" />
                                        Promotional Website
                                    </Label>
                                    <Input
                                        name="promotionalWebsite"
                                        placeholder="https://example.com"
                                        value={formData.promotionalWebsite}
                                        onChange={handleInputChange}
                                        className={errors.promotionalWebsite ? "border-red-500" : ""}
                                    />
                                    {errors.promotionalWebsite && <p className="text-xs text-red-500">{errors.promotionalWebsite}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        Gmail Id
                                    </Label>
                                    <Input
                                        name="gmailId"
                                        placeholder="ads.manager@gmail.com"
                                        value={formData.gmailId}
                                        onChange={handleInputChange}
                                        className={errors.gmailId ? "border-red-500" : ""}
                                    />
                                    {errors.gmailId && <p className="text-xs text-red-500">{errors.gmailId}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-500" />
                                    Remarks <span className="text-gray-400 font-normal">(Optional)</span>
                                </Label>
                                <Textarea
                                    name="remarks"
                                    placeholder="Any specific requirements or instructions..."
                                    className="min-h-[80px] resize-none"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

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
