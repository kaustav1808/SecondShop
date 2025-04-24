"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, X, Plus, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import useAuth from "@/store/useAuth";
import { CATEGORIES, CONDITIONS } from "@/store/useProducts";

// Form schema
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }).max(100, {
    message: "Title must not exceed 100 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }).max(1000, {
    message: "Description must not exceed 1000 characters",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  condition: z.string({
    required_error: "Please select a condition",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SellPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  // Example image URLs for mockup
  const mockImages = [
    "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg",
    "https://images.pexels.com/photos/1619651/pexels-photo-1619651.jpeg",
    "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
  ];
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
    }
  }, [isAuthenticated]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      price: undefined,
      location: "",
    },
  });
  
  const onSubmit = (values: FormValues) => {
    if (images.length === 0) {
      form.setError("root", { 
        message: "Please add at least one image" 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({ ...values, images });
      setIsSubmitting(false);
      setSuccessDialogOpen(true);
    }, 1500);
  };
  
  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload images
    // For this demo, we'll just add a mock image
    if (images.length < 5) {
      const randomIndex = Math.floor(Math.random() * mockImages.length);
      setImages([...images, mockImages[randomIndex]]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Sell Your Item</h1>
            <p className="text-muted-foreground">Create a listing for your item</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Item Images</CardTitle>
              <CardDescription>
                Upload up to 5 images of your item. The first image will be the cover image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-muted rounded-md overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <Badge
                        className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-primary/80 backdrop-blur-sm"
                      >
                        Cover Image
                      </Badge>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <Button
                    variant="outline"
                    className="aspect-square flex flex-col items-center justify-center border-dashed gap-2 h-auto"
                    onClick={handleImageUpload}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {images.length === 0 ? "Add Images" : "Add More"}
                    </span>
                  </Button>
                )}
              </div>
              
              {form.formState.errors.root && (
                <p className="text-sm text-destructive mt-2">
                  {form.formState.errors.root.message}
                </p>
              )}
              
              <ul className="text-sm text-muted-foreground space-y-1 mt-4">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Use high-quality images with good lighting
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Show the item from multiple angles
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Include photos of any defects or wear
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  Avoid using stock photos
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Item Details Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide accurate details about your item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., iPhone 12 Pro - Excellent Condition" {...field} />
                          </FormControl>
                          <FormDescription>
                            A clear, descriptive title helps buyers find your item.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CONDITIONS.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your item in detail including features, specs, and any defects or wear..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be honest about the condition and include all relevant details.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        List Item for Sale
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Selling Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                    <span>Be honest about the condition and any defects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                    <span>Research similar items to set a competitive price</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                    <span>Respond quickly to buyer inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 text-primary mt-1" />
                    <span>Be clear about payment and pickup/delivery options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Success Dialog */}
        <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Listing Created Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Your item has been listed for sale. You can view and manage your listings in your profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => router.push("/profile")}
              >
                Go to My Listings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Login Required Dialog */}
        <AlertDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in before you can create a listing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push("/")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push("/auth")}
              >
                Sign In
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// Type for the badge component
type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

function Badge({ children, className }: BadgeProps) {
  return (
    <div className={`text-xs font-medium rounded-full ${className}`}>
      {children}
    </div>
  );
}