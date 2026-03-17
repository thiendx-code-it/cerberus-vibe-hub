import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCategories } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().trim().min(1, "Tên project không được để trống").max(200, "Tối đa 200 ký tự"),
  description: z.string().trim().min(10, "Mô tả ít nhất 10 ký tự").max(5000, "Tối đa 5000 ký tự"),
  demo_url: z.string().url("URL không hợp lệ").or(z.literal("")),
  source_url: z.string().url("URL không hợp lệ").or(z.literal("")),
  category_slug: z.string().min(1, "Vui lòng chọn danh mục"),
  author_name: z.string().trim().min(1, "Tên tác giả không được để trống").max(200, "Tối đa 200 ký tự"),
  author_url: z.string().url("URL không hợp lệ").or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const SubmitProject = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      demo_url: "",
      source_url: "",
      category_slug: "",
      author_name: "",
      author_url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("projects").insert({
        name: values.name,
        description: values.description,
        demo_url: values.demo_url || null,
        source_url: values.source_url || null,
        category_slug: values.category_slug,
        author_name: values.author_name,
        author_url: values.author_url || null,
      });
      if (error) throw error;

      toast({
        title: "🎉 Gửi thành công!",
        description: "Project của bạn đang chờ duyệt. Cảm ơn bạn đã đóng góp!",
      });
      navigate("/");
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể gửi project. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-bold mb-2">🚀 Submit Project</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Chia sẻ dự án của bạn với cộng đồng Cerberus Team
      </p>

      <div className="glass rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên Project *</FormLabel>
                <FormControl><Input placeholder="VD: Cerberus Chat" {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả *</FormLabel>
                <FormControl><Textarea placeholder="Mô tả ngắn về project..." rows={4} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category_slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-secondary"><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="demo_url" render={({ field }) => (
              <FormItem>
                <FormLabel>URL Demo</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="source_url" render={({ field }) => (
              <FormItem>
                <FormLabel>URL Source Code</FormLabel>
                <FormControl><Input placeholder="https://github.com/..." {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="author_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tác giả *</FormLabel>
                <FormControl><Input placeholder="Tên của bạn" {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="author_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Link Profile</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi Project"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubmitProject;
