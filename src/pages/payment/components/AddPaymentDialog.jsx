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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createPayment } from "../helpers/createPayment";
import { updatePayment } from "../helpers/updatePayment";
import { fetchSinglePayment } from "../helpers/fetchSinglePayment";
import { Loader2 } from "lucide-react";

const AddPaymentDialog = ({ open, setOpen, editId = null }) => {
    const queryClient = useQueryClient();
    const isEditMode = !!editId;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
    });

    // Fetch payment data when editing
    const { data: paymentData, isLoading: isFetching } = useQuery({
        queryKey: ["payment", editId],
        queryFn: () => fetchSinglePayment(editId),
        enabled: isEditMode && open,
    });
    useEffect(() => {
        if (paymentData && isEditMode) {
            setFormData({
                name: paymentData.name || "",
                description: paymentData.description || "",
                is_active: paymentData.is_active ?? true,
            });
        }
    }, [paymentData, isEditMode]);
    useEffect(() => {
        if (!open) {
            setFormData({
                name: "",
                description: "",
                is_active: true,
            });
        }
    }, [open]);

    const { mutate: createMutation, isPending: isCreating } = useMutation({
        mutationFn: createPayment,
        onSuccess: () => {
            toast.success("Payment method created successfully");
            queryClient.invalidateQueries(["payments"]);
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create payment method");
        },
    });

    const { mutate: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: updatePayment,
        onSuccess: () => {
            toast.success("Payment method updated successfully");
            queryClient.invalidateQueries(["payments"]);
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to update payment method");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error("Please enter a payment method name");
            return;
        }

        if (isEditMode) {
            updateMutation({ id: editId, data: formData });
        } else {
            createMutation(formData);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        if (name === "is_active") {
            setFormData({ ...formData, [name]: value === "true" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Payment Method" : "Add Payment Method"}</DialogTitle>
                </DialogHeader>
                {isFetching ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., UPI, Credit Card, PayPal"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g., Google Pay, PhonePe, Paytm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="is_active">Status</Label>
                            <SelectDropdown
                                options={[
                                    { label: "Active", value: "true" },
                                    { label: "Inactive", value: "false" },
                                ]}
                                value={formData.is_active ? "true" : "false"}
                                onValueChange={(value) => handleSelectChange("is_active", value)}
                                placeholder="Select status"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditMode ? "Update Payment Method" : "Create Payment Method"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddPaymentDialog;
