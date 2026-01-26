import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Facebook,
    Receipt,
    ShieldCheck,
    Globe,
    Copy,
    Hash
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ViewAdAccountDialog = ({ open, onOpenChange, data }) => {
    if (!data) return null;

    const copyToClipboard = (text, label) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const totalPaid = (data.deposit_amount || 0) + (data.application_fee || 0) + (data.deposit_fee || 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[600px] max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-zinc-950 border-zinc-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Facebook className="h-6 w-6" />
                                    Ad Account Details
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-colors px-2 py-1 rounded text-xs text-blue-100 cursor-pointer" onClick={() => copyToClipboard(data._id, "System ID")}>
                                        <Hash className="w-3 h-3" />
                                        <span>ID: {data._id}</span>
                                        <Copy className="w-3 h-3 ml-1 opacity-50" />
                                    </div>
                                    <Badge
                                        className={`
                                            ${data.status === 'active' ? 'bg-green-400 text-green-950 hover:bg-green-500' :
                                                data.status === 'pending' ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-500' :
                                                    'bg-red-400 text-red-950 hover:bg-red-500'}
                                            border-0 capitalize font-bold
                                        `}
                                    >
                                        {data.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="h-[calc(90vh-140px)] overflow-y-auto custom-scrollbar">
                    <div className="p-8 space-y-8">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Identity Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                                    Account Identity
                                </h3>
                                <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-500">Account Name</span>
                                            <span className="text-zinc-100 font-bold">{data.account_name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-500">Account ID</span>
                                            <div className="flex items-center justify-between group">
                                                <span className="text-zinc-200 font-mono text-sm">{data.account_id}</span>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(data.account_id, "Account ID")}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-500">License Number</span>
                                            <span className="text-zinc-300">{data.license_number}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Configuration & Timing Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-indigo-400" />
                                    Configuration & Timing
                                </h3>
                                <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="space-y-1">
                                            <span className="text-xs text-zinc-500 block">Time Zone</span>
                                            <div className="flex items-center gap-2 text-zinc-200 text-sm">
                                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                                <span>{data.timezone}</span>
                                            </div>
                                        </div>
                                        {data.createdAt && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-zinc-500 block">Created On</span>
                                                <div className="flex items-center gap-2 text-zinc-200 text-sm">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span>{format(new Date(data.createdAt), "PPP")}</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Financial Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-indigo-400" />
                                Billing Overview
                            </h3>
                            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-xl ring-1 ring-blue-500/10">
                                <div className="p-6 bg-gradient-to-br from-zinc-900 to-black">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-sm text-zinc-400">Deposit Amount</span>
                                            </div>
                                            <span className="text-lg font-semibold text-white">${data.deposit_amount?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                                                <span className="text-sm text-zinc-400">Application Fee</span>
                                            </div>
                                            <span className="text-zinc-300 font-medium">${data.application_fee?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                <span className="text-sm text-zinc-400">Commission / Deposit Fee</span>
                                            </div>
                                            <span className="text-orange-400 font-medium">+ ${data.deposit_fee?.toFixed(2)}</span>
                                        </div>

                                        <div className="relative py-2">
                                            <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800 border-t border-dashed border-zinc-700"></div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-[14px] font-black text-zinc-600 uppercase">Total Capital Invested</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                                    ${totalPaid.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAdAccountDialog;
