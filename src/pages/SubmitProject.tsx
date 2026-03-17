import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

type FormValues = {
  name: string;
  description: string;
  demo_url: string;
  source_url: string;
  category_slug: string;
  author_name: string;
  author_url: string;
};

const SubmitProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().trim().min(1, t("validation.nameRequired")).max(200, t("validation.nameMax")),
    description: z.string().trim().min(10, t("validation.descMin")).max(5000, t("validation.descMax")),
    demo_url: z.string().url(t("validation.invalidUrl")).or(z.literal("")),
    source_url: z.string().url(t("validation.invalidUrl")).or(z.literal("")),
    category_slug: z.string().min(1, t("validation.categoryRequired")),
    author_name: z.string().trim().min(1, t("validation.authorRequired")).max(200, t("validation.authorMax")),
    author_url: z.string().url(t("validation.invalidUrl")).or(z.literal("")),
  });

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
        title: t("submit.successTitle"),
        description: t("submit.successMessage"),
      });
      navigate("/");
    } catch {
      toast({
        title: t("submit.errorTitle"),
        description: t("submit.errorMessage"),
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
          <ArrowLeft className="h-4 w-4" /> {t("submit.backButton")}
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-bold mb-2">{t("submit.title")}</h1>
      <p className="text-muted-foreground text-sm mb-8">
        {t("submit.subtitle")}
      </p>

      <div className="glass rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.name")}</FormLabel>
                <FormControl><Input placeholder={t("submit.fields.namePlaceholder")} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.description")}</FormLabel>
                <FormControl><Textarea placeholder={t("submit.fields.descriptionPlaceholder")} rows={4} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="category_slug" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.category")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-secondary"><SelectValue placeholder={t("submit.fields.categoryPlaceholder")} /></SelectTrigger>
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
                <FormLabel>{t("submit.fields.demoUrl")}</FormLabel>
                <FormControl><Input placeholder={t("submit.fields.urlPlaceholder")} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="source_url" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.sourceUrl")}</FormLabel>
                <FormControl><Input placeholder={t("submit.fields.githubPlaceholder")} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="author_name" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.authorName")}</FormLabel>
                <FormControl><Input placeholder={t("submit.fields.authorNamePlaceholder")} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="author_url" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("submit.fields.authorUrl")}</FormLabel>
                <FormControl><Input placeholder={t("submit.fields.urlPlaceholder")} {...field} className="bg-secondary" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? t("submit.submitting") : t("submit.submitButton")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubmitProject;
