import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createWallet } from "../helpers/createWallet";
import { updateWallet } from "../helpers/updateWallet";
import { fetchSingleWallet } from "../helpers/fetchSingleWallet";
import { fetchPayments } from "../../payment/helpers/fetchPayments";
import { uploadFile } from "@/helpers/uploadFile";
import { Loader2, Upload, X } from "lucide-react";
import { getItem } from "@/utils/local_storage";

const AddTopUpRequestDialog = ({ open, setOpen, editId = null }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!editId;
    const userRole = getItem("userRole");
    const isAdmin = userRole === "admin" || userRole === "agent";
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        amount: 0,
        transcationId: "",
        screenshotUrl: "",
        remarks: "",
        paymentMethodId: "",
        status: "pending",
        rejectReason: "",
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Fetch payment methods
    const { data: paymentMethods = [] } = useQuery({
        queryKey: ["paymentMethods"],
        queryFn: () => fetchPayments({ params: { is_active: true } }),
    });

    // Fetch top-up request data when editing
    const { data: topUpData, isLoading: isFetching } = useQuery({
        queryKey: ["top-up-request", editId],
        queryFn: () => fetchSingleWallet(editId),
        enabled: isEditMode && open,
    });

    useEffect(() => {
        if (topUpData && isEditMode) {
            setFormData({
                amount: topUpData.amount || 0,
                transcationId: topUpData.transcationId || "",
                screenshotUrl: topUpData.screenshotUrl || "",
                remarks: topUpData.remarks || "",
                paymentMethodId: topUpData.paymentMethodId?._id || topUpData.paymentMethodId || "",
                status: topUpData.status || "pending",
                rejectReason: topUpData.rejectReason || "",
            });
        }
    }, [topUpData, isEditMode]);

    useEffect(() => {
        if (!open) {
            setFormData({
                amount: "",
                transcationId: "",
                screenshotUrl: "",
                remarks: "",
                paymentMethodId: "",
                status: "pending",
                rejectReason: "",
            });
        }
    }, [open]);

    const { mutate: createMutation, isPending: isCreating } = useMutation({
        mutationFn: createWallet,
        onSuccess: () => {
            toast.success("Top-up request created successfully");
            queryClient.invalidateQueries(["wallets"]);
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create top-up request");
        },
    });

    const { mutate: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateWallet,
        onSuccess: () => {
            toast.success("Top-up request updated successfully");
            queryClient.invalidateQueries(["wallets"]);
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to update top-up request");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.amount || formData.amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!formData.paymentMethodId) {
            toast.error("Please select a payment method");
            return;
        }
        const submissionData = {
            ...formData,
            screenshotUrl: formData.screenshotUrl || "https://placehold.co/600x400?text=No+Screenshot"
        };

        if (isEditMode) {
            updateMutation({ id: editId, data: submissionData });
        } else {
            createMutation(submissionData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await uploadFile(file);
            if (res.response?.success) {
                setFormData(prev => ({ ...prev, screenshotUrl: res.response.data.url }));
                toast.success("Screenshot uploaded successfully");
            } else {
                toast.error(res.response?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    const isPending = isCreating || isUpdating || isUploading;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? "View Top-up Details" : "Add Top-up Request"}</DialogTitle>
                    </DialogHeader>
                    {isFetching ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="paymentMethodId">Payment Method</Label>
                                <SelectDropdown
                                    options={paymentMethods.map(m => ({ label: m.name, value: m._id }))}
                                    value={formData.paymentMethodId}
                                    onValueChange={(value) => handleSelectChange("paymentMethodId", value)}
                                    placeholder="Select payment method"
                                    disabled={isEditMode}
                                />
                                {/* Payment Instructions Display */}
                                {(() => {
                                    const selectedMethod = paymentMethods.find(m => m._id === formData.paymentMethodId);
                                    if (!selectedMethod?.description) return null;

                                    return (
                                        <div className="mt-2 p-4 rounded-xl bg-blue-500/10 border-2 border-dashed border-blue-500/30 animate-in fade-in zoom-in-95 duration-300 relative group overflow-hidden">
                                            {/* Decorative background glow */}
                                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 blur-2xl rounded-full" />

                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-blue-400/90">
                                                    Payment Instructions
                                                </h4>
                                            </div>

                                            <p className="relative z-10 text-[15px] font-bold text-blue-200 leading-relaxed break-all">
                                                {selectedMethod.description}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    required
                                    className="w-full"
                                    disabled={isEditMode}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="transcationId">Transaction ID</Label>
                                <Input
                                    id="transcationId"
                                    name="transcationId"
                                    value={formData.transcationId}
                                    onChange={handleChange}
                                    placeholder="Enter transaction ID"
                                    required
                                    disabled={isEditMode}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="remarks">Remarks <span className="text-gray-500 font-normal">(Optional)</span></Label>
                                <Textarea
                                    id="remarks"
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="Enter any additional remarks"
                                    className="resize-none"
                                    rows={3}
                                    disabled={isEditMode}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Payment Screenshot</Label>
                                {formData.screenshotUrl ? (
                                    <div className="relative mt-2 border rounded-md p-2 flex items-center justify-between bg-card/50">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div
                                                onClick={() => setIsPreviewOpen(true)}
                                                className="cursor-zoom-in block"
                                            >
                                                <img
                                                    src={formData.screenshotUrl}
                                                    alt="Screenshot"
                                                    className="h-12 w-12 object-cover rounded border hover:opacity-80 transition-opacity"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs truncate text-gray-400 max-w-[150px]">screenshot-uploaded.png</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPreviewOpen(true)}
                                                    className="text-[10px] text-left text-blue-400 hover:underline"
                                                >
                                                    View Proof
                                                </button>
                                            </div>
                                        </div>
                                        {!isEditMode && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setFormData(p => ({ ...p, screenshotUrl: "" }))}
                                                className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="mt-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-gray-400" />
                                        )}
                                        <p className="text-xs text-center text-gray-500">
                                            {isUploading ? "Uploading..." : "Click to upload payment screenshot"}
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Admin Status Controls */}
                            {isAdmin && isEditMode && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Update Status</Label>
                                        <SelectDropdown
                                            options={[
                                                {
                                                    label: "Pending",
                                                    value: "pending",
                                                    disabled: topUpData?.status === "approved" || topUpData?.status === "rejected"
                                                },
                                                { label: "Approved", value: "approved" },
                                                { label: "Rejected", value: "rejected" },
                                            ]}
                                            value={formData.status}
                                            onValueChange={(value) => handleSelectChange("status", value)}
                                            placeholder="Update status"
                                        />
                                    </div>

                                    {formData.status === "rejected" && (
                                        <div className="grid gap-2">
                                            <Label htmlFor="rejectReason">Reason for Rejection</Label>
                                            <Textarea
                                                id="rejectReason"
                                                name="rejectReason"
                                                value={formData.rejectReason}
                                                onChange={handleChange}
                                                placeholder="Enter the reason for rejection"
                                                className="resize-none"
                                                rows={2}
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            <DialogFooter className="mt-4">
                                {(!isEditMode && userRole === "user") && (
                                    <Button type="submit" disabled={isPending} className="w-full">
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Request
                                    </Button>
                                )}
                                {(isEditMode && isAdmin) && (
                                    <Button type="submit" disabled={isPending} className="w-full">
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Status
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Preview Lightbox */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] p-0 overflow-hidden bg-black/90 border-0">
                    <div className="relative w-full h-full flex items-center justify-center p-4 min-h-[300px]">
                        <img
                            src={formData.screenshotUrl}
                            alt="Payment Proof"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-2 right-2 text-white hover:bg-white/10"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddTopUpRequestDialog;
