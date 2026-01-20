import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getItem } from "@/utils/local_storage";
import { updateAdApplicationStatus } from "../helpers/updateAdApplicationStatus";
import { toast } from "sonner";

import {
    Calendar,
    CreditCard,
    Globe,
    Mail,
    MessageSquare,
    ShieldCheck,
    User,
    Clock,
    DollarSign,
    Receipt,
    Loader2,
    Edit,
    Chrome
} from "lucide-react";
import { format } from "date-fns";

const ViewAdApplicationDialog = ({ open, onOpenChange, data }) => {
    const queryClient = useQueryClient();
    const userRole = getItem("userRole");
    const [status, setStatus] = useState("");
    const [adminNote, setAdminNote] = useState("");

    useEffect(() => {
        if (data) {
            setStatus(data.status || "pending");
            setAdminNote(data.adminNote || "");
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: updateAdApplicationStatus,
        onSuccess: (res) => {
            if (res?.response?.success) {
                toast.success("Status updated successfully");
                queryClient.invalidateQueries(["adApplications"]);
                onOpenChange(false);
            } else {
                toast.error(res?.response?.message || "Failed to update status");
            }
        },
        onError: () => {
            toast.error("An error occurred");
        }
    });

    const handleUpdateStatus = () => {
        mutation.mutate({
            id: data._id,
            status,
            adminNote
        });
    };

    if (!data) return null;

    const depositAmount = data.adAccounts?.reduce((sum, acc) => sum + (parseFloat(acc.amount) || 0), 0) || 0;
    const totalCost = data.submissionFee || 0;
    const serviceFees = totalCost - depositAmount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[600px] max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-zinc-950 border-zinc-800">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <Chrome className="h-6 w-6" />
                            Application Details
                        </DialogTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-blue-100 border-blue-400/50 bg-blue-500/20">
                                ID: {data._id}
                            </Badge>
                            <Badge
                                className={`
                                    ${data.status === 'approved' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                        data.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 hover:bg-red-500/30'}
                                    border-0
                                `}
                            >
                                {data.status?.toUpperCase()}
                            </Badge>
                        </div>
                    </DialogHeader>
                </div>

                <div className="h-[calc(90vh-140px)] overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Admin Action Section */}
                        {userRole === "admin" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                    <Edit className="h-5 w-5 text-indigo-400" />
                                    Update Application Status
                                </h3>
                                <Card className="bg-zinc-900 border-zinc-800">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">Application Status</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                                    <SelectItem value="pending" className="text-yellow-400" disabled={data.status === 'approved' || data.status === 'rejected'}>Pending</SelectItem>
                                                    <SelectItem value="approved" className="text-green-400">Approved</SelectItem>
                                                    <SelectItem value="rejected" className="text-red-400">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {(status === "rejected") && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <Label className="text-zinc-400">Rejection Reason / Admin Note</Label>
                                                <Textarea
                                                    placeholder="Please provide a reason for rejection..."
                                                    value={adminNote}
                                                    onChange={(e) => setAdminNote(e.target.value)}
                                                    className="bg-zinc-800 border-zinc-700 text-zinc-200 min-h-[80px]"
                                                />
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleUpdateStatus}
                                            disabled={mutation.isPending || (data.status === status && data.adminNote === adminNote)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold mt-2"
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating Status...
                                                </>
                                            ) : (
                                                "Update Status"
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* User Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-400" />
                                User Information
                            </h3>
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-500 uppercase font-medium">Full Name</p>
                                        <p className="text-zinc-200">{data.user?.full_name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-500 uppercase font-medium">Email Address</p>
                                        <p className="text-zinc-200">{data.user?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-500 uppercase font-medium">Username</p>
                                        <p className="text-zinc-200">@{data.user?.username}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-500 uppercase font-medium">Applied On</p>
                                        <p className="text-zinc-200 flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-zinc-500" />
                                            {format(new Date(data.createdAt), "PPP p")}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* General Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-indigo-400" />
                                General Information
                            </h3>
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-zinc-500 uppercase font-medium flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Promotional Website
                                            </p>
                                            <a href={data.promotionalWebsite} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate block">
                                                {data.promotionalWebsite}
                                            </a>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-zinc-500 uppercase font-medium flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> Gmail ID
                                            </p>
                                            <p className="text-zinc-200">{data.gmailId}</p>
                                        </div>
                                    </div>

                                    {data.remarks && (
                                        <div className="space-y-1 pt-2 border-t border-zinc-800">
                                            <p className="text-xs text-zinc-500 uppercase font-medium flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" /> Remarks
                                            </p>
                                            <p className="text-zinc-300 italic">"{data.remarks}"</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ad Accounts */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                <div className="h-5 w-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                    {data.adAccounts?.length}
                                </div>
                                Ad Accounts
                                Requested
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {data.adAccounts?.map((account, index) => (
                                    <Card key={index} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                                        <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-300">Account #{index + 1}</span>
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                                                <DollarSign className="w-3 h-3 mr-1" />
                                                Top-up: ${account.amount}
                                            </Badge>
                                        </div>
                                        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs text-zinc-500 uppercase font-medium">Account Name</p>
                                                <p className="text-zinc-200 font-medium">{account.accountName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-zinc-500 uppercase font-medium">Time Zone</p>
                                                <div className="flex items-center gap-2 text-zinc-200">
                                                    <Clock className="w-3 h-3 text-zinc-500" />
                                                    <span className="truncate" title={account.timeZone}>
                                                        {account.timeZone}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-zinc-900 text-white rounded-xl overflow-hidden shadow-lg mt-8 border border-dashed border-blue-300 dark:border-blue-700/50">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Receipt className="w-5 h-5 text-indigo-400" />
                                    <h3 className="font-semibold text-lg">Payment Summary</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm text-zinc-400">
                                        <span>Total Deposit Amount</span>
                                        <span className="text-white font-medium">${depositAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-zinc-400">
                                        <span>Service Fees & Application Charges</span>
                                        <span className="text-orange-400 font-medium">+ ${serviceFees.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-zinc-700 my-2"></div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Paid</p>
                                        </div>
                                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                            ${totalCost.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewAdApplicationDialog;
