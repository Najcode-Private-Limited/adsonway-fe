import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { fetchBlogs } from "../helpers/fetchBlogs";
import { deleteBlog } from "../helpers/deleteBlog";

const BlogsTable = ({ setBlogsLength, params, setParams }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: apiBlogsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", params],
    queryFn: () => fetchBlogs({ params }),
  });

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const onOpenDialog = (row) => {
    setOpenDelete(true);
    setSelectedBlog(row);
  };

  const onCloseDialog = () => {
    setOpenDelete(false);
    setSelectedBlog(null);
  };

  const { mutate: deleteBlogMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success("Blog deleted successfully.");
      queryClient.invalidateQueries(["blogs"]);
      onCloseDialog();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete blog.");
    },
  });

  const onDeleteClick = (id) => {
    deleteBlogMutation(id);
  };

  const blogs = Array.isArray(apiBlogsResponse?.response?.data)
    ? apiBlogsResponse?.response?.data
    : [];
  const blogsTotal = apiBlogsResponse?.response?.total;

  useEffect(() => {
    setBlogsLength(blogs?.length);
  }, [blogs, setBlogsLength]);

  const onNavigateToEdit = (blog) => {
    navigate(`/dashboard/blogs/edit/${blog._id}`);
  };

  const onNavigateDetails = (blog) => {
    navigate(`/dashboard/blogs/${blog._id}`);
  };

  const columns = [
    {
      key: "banner",
      label: "Banner",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
           src={row.banner_image_url}
            alt={value}
            className="h-16 w-16 rounded-lg object-contain"
          />
          <Typography variant="p">{value}</Typography>
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value, row) => (
        <div className="w-96">
          <Typography className="block line-clamp-2 text-wrap" variant="p">
            {value}
          </Typography>
          <Typography
            variant="span"
            className="block line-clamp-2 text-gray-500 text-wrap"
          >
            {row.short_description}
          </Typography>
        </div>
      ),
    },
    // {
    //   key: "service",
    //   label: "Service",
    //   render: (value, row) => {
    //     return <Typography variant="p">{row.service?.name || "-"}</Typography>;
    //   },
    // },
    {
      key: "isFeatured",
      label: "Featured",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "published",
      label: "Published",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created at",
      render: (value, row) => (
        <div className="flex flex-col gap-1">
          <Typography>
            {format(new Date(value), "dd/MM/yyyy hh:mm a")}
          </Typography>
          {value !== row.updatedAt && (
            <Typography className="text-gray-500 text-sm">
              Updated -{" "}
              {formatDistanceToNow(new Date(row.updatedAt), {
                addSuffix: true,
              })}
            </Typography>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <ActionMenu
          options={[
            {
              label: "View Details",
              icon: Eye,
              action: () => onNavigateDetails(row),
            },
            {
              label: "Edit",
              icon: Pencil,
              action: () => onNavigateToEdit(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              action: () => onOpenDialog(row),
              className: "text-red-500",
            },
          ]}
        />
      ),
    },
  ];

  const onPageChange = (page) => {
    setParams((prev) => ({
      ...prev,
      page: page + 1,
    }));
  };

  const perPage = params.per_page;
  const currentPage = params.page;
  const totalPages = Math.ceil(blogsTotal / perPage);

  return (
    <>
      <CustomTable
        columns={columns}
        data={blogs || []}
        isLoading={isLoading}
        error={error}
        perPage={perPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <CustomDialog
        onOpen={openDelete}
        onClose={onCloseDialog}
        title={selectedBlog?.title}
        modalType="Delete"
        onDelete={onDeleteClick}
        id={selectedBlog?._id}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BlogsTable;
