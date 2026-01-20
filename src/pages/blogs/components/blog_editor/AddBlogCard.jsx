import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { X } from "lucide-react";
import { createBlog } from "../../helpers/createBlog";
import { updateBlog } from "../../helpers/updateBlog";
import TextEditor from "@/components/text_editor";
import { Checkbox } from "@/components/ui/checkbox";

const AddBlogCard = ({ isEdit = false, initialData = null }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    content: "",
    bannerImage: null,
    bannerPreview: null,
    published: false,
    isFeatured: false,
    
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        content: initialData.content || "",
        bannerImage: null,
        bannerPreview: initialData.bannerImageUrl || null,
        published: initialData.published || false,
        isFeatured: initialData.isFeatured || false,
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        bannerImage: file,
        bannerPreview: URL.createObjectURL(file),
      }));
    }
  };

  const resetBanner = () => {
    setFormData((prev) => ({
      ...prev,
      bannerImage: null,
      bannerPreview: null,
    }));
  };

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (res) => {
        if (res?.response?.success) {
          toast.success(`Blog ${isEdit ? "updated" : "created"} successfully`);
          navigate("/dashboard/blogs");
        } else {
          toast.error(res?.response?.message || "Failed to create blog");
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error(`Failed to ${isEdit ? "update" : "create"} blog`);
      },
    });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateBlog({ id, payload }),
    onSuccess: () => {
      toast.success("Blog updated successfully");
      navigate("/dashboard/blogs");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update blog");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("short_description", formData.short_description);
    form.append("content", formData.content);
    form.append("published", formData.published);
    form.append("is_featured", formData.isFeatured);
  
    if (formData.bannerImage instanceof File) {
        form.append("banner_image_url", formData.bannerImage); // <- FIXED
      }
  
    if (isEdit) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };
  

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow space-y-6"
    >
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Blog title"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Short Description</label>
        <Input
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          placeholder="Short summary"
          required
        />
      </div>

     

      <div>
        <label className="block mb-1 font-semibold">Banner Image</label>
        <Input type="file" accept="image/*" onChange={handleBannerImageChange} />
        {formData.bannerPreview && (
          <div className="relative mt-3">
            <img
              src={formData.bannerPreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
            <button
              type="button"
              onClick={resetBanner}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 items-center">
  <div className="flex items-center gap-2">
    <Checkbox
      id="published"
      checked={formData.published}
      onCheckedChange={(checked) =>
        setFormData((prev) => ({ ...prev, published: !!checked }))
      }
    />
    <label htmlFor="published" className="text-sm font-medium">
      Published
    </label>
  </div>

  <div className="flex items-center gap-2">
    <Checkbox
      id="isFeatured"
      checked={formData.isFeatured}
      onCheckedChange={(checked) =>
        setFormData((prev) => ({ ...prev, isFeatured: !!checked }))
      }
    />
    <label htmlFor="isFeatured" className="text-sm font-medium">
      Featured
    </label>
  </div>
</div>

      <div>
  <label className="block mb-1 font-semibold">Content</label>
  <TextEditor
    value={formData.content}
    onTextChange={(newContent) =>
      setFormData((prev) => ({ ...prev, content: newContent }))
    }
    placeholder="Blog content..."
    height={400}
  />
</div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? isEdit
            ? "Updating..."
            : "Creating..."
          : isEdit
          ? "Update Blog"
          : "Create Blog"}
      </Button>
    </form>
  );
};

export default AddBlogCard;
