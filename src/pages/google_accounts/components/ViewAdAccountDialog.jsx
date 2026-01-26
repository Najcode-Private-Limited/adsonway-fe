import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    Clock,
    Chrome,
    User,
    Receipt,
    ShieldCheck,
    Globe,
    Copy,
    Hash,
    Edit2,
    Save,
    X,
    Loader2,
    Mail
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateAdAccount } from "../helpers/updateAdAccount";

const ViewAdAccountDialog = ({ open, onOpenChange, data }) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        account_name: "",
        account_id: "",
        status: "",
    });

    useEffect(() => {
        if (data) {
            setFormData({
                account_name: data.account_name || "",
                account_id: data.account_id || "",
                status: data.status || "active",
            });
            setIsEditing(false);
        }
    }, [data, open]);

    const mutation = useMutation({
        mutationFn: (payload) => {
            const { ...rest } = payload;
            return updateAdAccount({ id: data._id, data: rest });
        },
        onSuccess: (res) => {
            if (res?.response?.success) {
                toast.success("Ad account updated successfully!");
                setIsEditing(false);
                queryClient.invalidateQueries(["allGoogleAccounts"]);
                onOpenChange(false);
            } else {
                toast.error(res?.response?.message || "Failed to update ad account");
            }
        },
        onError: () => {
            toast.error("An error occurred");
        }
    });

    if (!data) return null;

    const handleSubmit = () => {
        mutation.mutate(formData);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            account_name: data.account_name || "",
            account_id: data.account_id || "",
            status: data.status || "active",
        });
    };

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const totalPaid = (data.deposit_amount || 0) + (data.application_fee || 0) + (data.deposit_fee || 0);

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) setIsEditing(false);
            onOpenChange(val);
        }}>
            <DialogContent className="min-w-[700px] max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-zinc-950/95 border-zinc-800/50 backdrop-blur-2xl shadow-2xl">
                {/* Header with improved gradient and sheen */}
                <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 shadow-lg">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
                    <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <DialogHeader className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 w-full">
                                <DialogTitle className="text-3xl font-bold text-white flex items-center justify-between gap-3 tracking-tight">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md shadow-inner border border-white/10">
                                            <Chrome className="h-6 w-6 text-white" />
                                        </div>
                                        {isEditing ? "Edit Ad Account" : "Ad Account Details"}
                                    </div>

                                    {!isEditing ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                            className="bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleCancel}
                                                className="text-white hover:bg-white/10 hover:text-white"
                                                disabled={mutation.isPending}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleSubmit}
                                                className="bg-white text-indigo-600 hover:bg-blue-50 border-0 shadow-lg shadow-black/20"
                                                disabled={mutation.isPending}
                                            >
                                                {mutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </DialogTitle>

                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex items-center gap-2 bg-black/20 hover:bg-black/30 transition-all duration-300 px-3 py-1.5 rounded-full text-xs font-medium text-blue-50 border border-white/10 cursor-pointer group" onClick={() => copyToClipboard(data._id, "System ID")}>
                                        <Hash className="w-3.5 h-3.5 text-blue-200" />
                                        <span className="font-mono opacity-90">{data._id}</span>
                                        <Copy className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                                    </div>

                                    {isEditing ? (
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                                        >
                                            <SelectTrigger className="h-8 w-[140px] bg-black/20 border-white/50 text-white text-xs focus:ring-white/20 focus:ring-offset-0 rounded-full [&_svg]:text-white [&_svg]:opacity-100">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                                <SelectItem value="active" className="focus:bg-zinc-800">Active</SelectItem>
                                                <SelectItem value="disabled" className="focus:bg-zinc-800">Disabled</SelectItem>
                                                <SelectItem value="deactivated" className="focus:bg-zinc-800">Deactivated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge
                                            className={cn(
                                                "px-3 py-1 rounded-full border-0 capitalize font-bold shadow-lg backdrop-blur-md",
                                                data.status === 'active' ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-400/50' :
                                                    data.status === 'disabled' ? 'bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/50' :
                                                        'bg-red-500/20 text-red-100 ring-1 ring-red-400/50'
                                            )}
                                        >
                                            <span className={cn("w-1.5 h-1.5 rounded-full mr-2",
                                                data.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                                                    data.status === 'disabled' ? 'bg-amber-400' : 'bg-red-400'
                                            )}></span>
                                            {data.status}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="h-[calc(90vh-160px)] overflow-y-auto custom-scrollbar bg-zinc-950">
                    <div className="p-8 space-y-8">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Section (Read Only) */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-1">
                                    <User className="h-3.5 w-3.5 text-indigo-500" />
                                    Owner Information
                                </h3>
                                <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-sm hover:border-zinc-700/60 transition-colors duration-300">
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Full Name</span>
                                            <span className="text-zinc-100 font-semibold text-base">{data.user?.full_name || "N/A"}</span>
                                        </div>
                                        <div className="h-px bg-zinc-800/50"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Email Address</span>
                                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => copyToClipboard(data.user?.email, "Email")}>
                                                <span className="text-zinc-300 group-hover:text-blue-400 transition-colors">{data.user?.email || "N/A"}</span>
                                                <Copy className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </div>
                                        <div className="h-px bg-zinc-800/50"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Username</span>
                                            <span className="text-indigo-400 font-mono text-sm bg-indigo-500/10 px-2 py-1 rounded-md w-fit">@{data.user?.username || "N/A"}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Account Identity Section (Editable) */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-1 justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                                        Account Identity
                                    </div>
                                    {isEditing && <span className="text-indigo-400 text-[10px] normal-case tracking-normal border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Edit2 className="w-3 h-3" /> Editable
                                    </span>}
                                </h3>
                                <Card className={cn(
                                    "bg-zinc-900/40 border-zinc-800/60 shadow-sm transition-all duration-300",
                                    isEditing && "bg-zinc-900 border-indigo-500/20 ring-1 ring-indigo-500/10 shadow-lg shadow-indigo-500/5"
                                )}>
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Account Name</Label>
                                            {isEditing ? (
                                                <Input
                                                    value={formData.account_name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                                                    className="h-9 bg-zinc-950 border-zinc-700/50 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-zinc-100 focus:bg-zinc-900 transition-all font-medium"
                                                />
                                            ) : (
                                                <span className="text-zinc-100 font-bold text-lg">{data.account_name}</span>
                                            )}
                                        </div>
                                        <div className="h-px bg-zinc-800/50 w-full"></div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">Account ID</Label>
                                            {isEditing ? (
                                                <Input
                                                    value={formData.account_id}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, account_id: e.target.value }))}
                                                    className="h-9 bg-zinc-950 border-zinc-700/50 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-mono text-zinc-300 focus:bg-zinc-900 transition-all"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-between group cursor-pointer bg-zinc-950/50 rounded-lg p-2 border border-zinc-800/50 hover:border-zinc-700 transition-colors" onClick={() => copyToClipboard(data.account_id, "Account ID")}>
                                                    <span className="text-zinc-300 font-mono text-sm tracking-wide">{data.account_id}</span>
                                                    <Copy className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Digital Assets Section (Google Specific) */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-1">
                                <Globe className="h-3.5 w-3.5 text-indigo-500" />
                                Digital Identity
                            </h3>
                            <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-sm hover:border-zinc-700/60 transition-colors duration-300">
                                <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                                            <Globe className="w-3 h-3" /> Promotional Website
                                        </span>
                                        {data.promotional_website ? (
                                            <a href={data.promotional_website} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline truncate font-medium">
                                                {data.promotional_website}
                                            </a>
                                        ) : (
                                            <span className="text-zinc-500 text-sm">N/A</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                                            <Mail className="w-3 h-3" /> Gmail ID
                                        </span>
                                        <span className="text-zinc-200 text-sm font-medium">{data.gmail_id || "N/A"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Configuration Details (Read Only) */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-1">
                                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                                Configuration & Timing
                            </h3>
                            <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-sm hover:border-zinc-700/60 transition-colors duration-300">
                                <CardContent className="p-5 grid grid-cols-2 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide block">Time Zone</span>
                                        <div className="flex items-center gap-2.5 text-zinc-200">
                                            <div className="p-1.5 bg-blue-500/10 rounded-md">
                                                <Clock className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <span className="font-medium text-sm">{data.timezone}</span>
                                        </div>
                                    </div>
                                    {data.createdAt && (
                                        <div className="space-y-2">
                                            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide block">Created On</span>
                                            <div className="flex items-center gap-2.5 text-zinc-200">
                                                <div className="p-1.5 bg-purple-500/10 rounded-md">
                                                    <Calendar className="w-4 h-4 text-purple-400" />
                                                </div>
                                                <span className="font-medium text-sm">{format(new Date(data.createdAt), "PPP")}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Financial Section (Read Only) */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pl-1">
                                <Receipt className="h-3.5 w-3.5 text-indigo-500" />
                                Billing Overview
                            </h3>
                            <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-5">
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Deposit Amount</span>
                                            </div>
                                            <span className="text-lg font-bold text-white tracking-tight">${data.deposit_amount?.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                                                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Application Fee</span>
                                            </div>
                                            <span className="text-lg font-bold text-zinc-300 tracking-tight">${data.application_fee?.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                                                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Commission / Deposit Fee</span>
                                            </div>
                                            <span className="text-lg font-bold text-orange-400 tracking-tight">+ ${data.deposit_fee?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-zinc-900 border-t border-dashed border-zinc-800"></div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[14px] font-black text-zinc-600 uppercase">Total Capital Invested</span>
                                        <span className="text-3xl font-black text-indigo-400 drop-shadow-sm">
                                            ${totalPaid.toFixed(2)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAdAccountDialog;
