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
import { toast } from "sonner";
import { Loader2, Plus, Receipt, Wallet } from "lucide-react";
import { fetchMyWallet } from "@/components/navbar/helpers/fetchMyWallet";
import { fetchMyAdAccounts } from "@/pages/facebook_ad_accounts/helpers/fetchMyAdAccounts";
import { addMoneyToFacebookAccount } from "../helpers/addMoneyToFacebookAccount";
import { accountAmounts } from "@/pages/facebook_ad_application/constants";

const AddDepositDialog = ({ open, onOpenChange }) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        accountId: "",
        amount: "",
        remarks: "",
    });

    // Fetch Wallet for Fees
    const { data: walletData } = useQuery({
        queryKey: ["myWallet"],
        queryFn: fetchMyWallet,
        enabled: open,
    });

    // Fetch Active Facebook Accounts
    const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
        queryKey: ["myActiveFacebookAccountsForDeposit"],
        queryFn: () => fetchMyAdAccounts({ params: { status: "active", limit: 100 } }),
        enabled: open,
    });

    const activeAccounts = accountsData?.accounts || [];
    const commissionPercent = walletData?.paymentFeeRule?.facebook_commission || 0;

    const mutation = useMutation({
        mutationFn: (payload) => addMoneyToFacebookAccount({ id: formData.accountId, data: payload }),
        onSuccess: (data) => {
            if (data?.response?.success) {
                toast.success("Deposit request submitted successfully!");
                onOpenChange(false);
                setFormData({ accountId: "", amount: "", remarks: "" });
                queryClient.invalidateQueries(["myFacebookDeposits"]);
                queryClient.invalidateQueries(["myWallet"]);
                queryClient.invalidateQueries(["myFacebookAccounts"]);
            } else {
                toast.error(data?.response?.message || "Failed to submit deposit request");
            }
        },
        onError: () => {
            toast.error("An error occurred");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.accountId) {
            toast.error("Please select an ad account");
            return;
        }
        if (!formData.amount) {
            toast.error("Please select or enter an amount");
            return;
        }

        const payload = {
            amount: parseInt(formData.amount, 10),
            remarks: formData.remarks || "Topup request",
        };

        mutation.mutate(payload);
    };

    const depositAmount = parseFloat(formData.amount) || 0;
    const feeAmount = depositAmount * (commissionPercent / 100);
    const totalAmount = depositAmount + feeAmount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[600px] max-w-2xl bg-zinc-50 dark:bg-zinc-950 border-0 shadow-2xl backdrop-blur-xl p-0 overflow-hidden">
                <div className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                            <Plus className="h-5 w-5" />
                        </div>
                        New Deposit Request
                    </DialogTitle>
                </div>

                <div className="p-6 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1 space-y-2">
                                <Label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Ad Account</Label>
                                <Select
                                    value={formData.accountId}
                                    onValueChange={(val) => setFormData(prev => ({ ...prev, accountId: val }))}
                                >
                                    <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                        <SelectValue placeholder={isLoadingAccounts ? "Loading..." : "Select Account"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeAccounts.length > 0 ? (
                                            activeAccounts.map((acc) => (
                                                <SelectItem key={acc._id} value={acc._id}>
                                                    {acc.account_name} ({acc.account_id})
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="none" disabled>No active accounts found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 md:col-span-1 space-y-2">
                                <Label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Money</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={formData.amount}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, amount: val }))}
                                    >
                                        <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                            <SelectValue placeholder="$ Amount" />
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
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Remarks (Optional)</Label>
                            <Textarea
                                placeholder="Enter any specific instructions or notes..."
                                value={formData.remarks}
                                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                                className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 min-h-[80px]"
                            />
                        </div>

                        {/* Billing Summary */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Receipt className="h-4 w-4 text-blue-500" />
                                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Billing Summary</h4>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                                    <span>Total Deposit Amount</span>
                                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">${depositAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                                    <span>Processing Fee ({commissionPercent}%)</span>
                                    <span className="font-semibold text-orange-500">${feeAmount.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-blue-200 dark:bg-blue-800/30 my-2"></div>
                                <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center shadow-lg shadow-blue-500/20">
                                    <span className="font-semibold">Grand Total</span>
                                    <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-center text-zinc-500 mt-2">
                                    1 deposit request(s) will be submitted
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xl shadow-blue-500/20 transition-all duration-300 transform active:scale-95"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                `Confirm & Pay $${totalAmount.toFixed(2)}`
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddDepositDialog;
