import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, ArrowLeft } from "lucide-react";
import NavbarItem from "@/components/navbar/navbar_item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/typography";
import { fetchBlogById } from "../helpers/fetchBlogById";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: blogResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogById(id),
    enabled: !!id,
  });

  const blog = blogResponse?.response?.data;

  const breadcrumbs = [
    { title: "Blogs", isNavigation: true, path: "/dashboard/blogs" },
    { title: blog?.title || "Blog Details", isNavigation: false },
  ];

  const onEdit = () => {
    navigate(`/dashboard/blogs/edit/${id}`);
  };

  const onBack = () => {
    navigate("/dashboard/blogs");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <NavbarItem title="Blog Details" breadcrumbs={breadcrumbs} />
        <div className="px-8 pb-8">
          <div className="flex justify-center items-center h-48">
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col gap-2">
        <NavbarItem title="Blog Details" breadcrumbs={breadcrumbs} />
        <div className="px-8 pb-8">
          <p className="text-red-500 text-center">
            {error ? "Failed to load blog data." : "Blog not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <NavbarItem title="Blog Details" breadcrumbs={breadcrumbs} />
      <div className="px-8 pb-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Blog
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{blog.title}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                Status: {blog.published ? "Published" : "Draft"}
              </span>
              <span>
                Featured: {blog.isFeatured ? "Yes" : "No"}
              </span>
              <span>
                Created: {format(new Date(blog.createdAt), "dd/MM/yyyy hh:mm a")}
              </span>
              {blog.createdAt !== blog.updatedAt && (
                <span>
                  Updated: {format(new Date(blog.updatedAt), "dd/MM/yyyy hh:mm a")}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {blog.banner_image_url && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Banner Image
                </Typography>
                <img
                  src={blog.banner_image_url}
                  alt={blog.title}
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}

            {blog.short_description && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Short Description
                </Typography>
                <Typography variant="p" className="text-gray-700">
                  {blog.short_description}
                </Typography>
              </div>
            )}

            {blog.content && (
              <div>
                <Typography variant="h4" className="mb-2">
                  Content
                </Typography>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetails; 