"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";
import useProducts from "@/store/useProducts";
import useAuth from "@/store/useAuth";
import useUserPreferences from "@/store/useUserPreferences";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { products, getProductById, fetchProducts, isLoading } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const { addToRecentlyViewed, addToFavorites, removeFromFavorites, isFavorite } =
    useUserPreferences();
  
  const [product, setProduct] = useState<ReturnType<typeof getProductById>>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<ReturnType<typeof getProductById>[]>([]);
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    } else {
      const foundProduct = getProductById(id as string);
      setProduct(foundProduct);
      
      // Track viewed product
      if (foundProduct) {
        addToRecentlyViewed(foundProduct.id);
        
        // Get related products (same category)
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id, products, fetchProducts, getProductById, addToRecentlyViewed]);
  
  const toggleFavorite = () => {
    if (!product) return;
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };
  
  const handleShare = () => {
    if (navigator.share && product) {
      navigator
        .share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="inline-block h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${product.title} - Image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            {/* Thumbnail Preview */}
            {product.images.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-md overflow-hidden border-2 border-muted cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start">
              <Badge variant="secondary" className="mb-2">
                {product.condition}
              </Badge>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={toggleFavorite}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(product.id)
                              ? "fill-primary text-primary"
                              : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={handleShare}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share this product</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4 text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{product.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {format(parseISO(product.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            <Separator className="mb-6" />
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="text-muted-foreground">Category</dt>
                <dd>{product.category}</dd>
                <dt className="text-muted-foreground">Condition</dt>
                <dd>{product.condition}</dd>
                <dt className="text-muted-foreground">Location</dt>
                <dd>{product.location}</dd>
                <dt className="text-muted-foreground">Listed</dt>
                <dd>{format(parseISO(product.createdAt), "MMM d, yyyy")}</dd>
              </dl>
            </div>
            
            <Separator className="mb-6" />
            
            {/* Seller Info */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Seller</h2>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={product.sellerAvatar} alt={product.sellerName} />
                  <AvatarFallback>{product.sellerName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{product.sellerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {format(parseISO(product.createdAt), "MMM yyyy")}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="flex-1">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button size="lg" variant="secondary" className="flex-1">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Make Offer
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/products/${relProduct.id}`}
                  onClick={() => addToRecentlyViewed(relProduct.id)}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={relProduct.images[0]}
                        alt={relProduct.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isFavorite(relProduct.id)) {
                            removeFromFavorites(relProduct.id);
                          } else {
                            addToFavorites(relProduct.id);
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full transition-transform hover:scale-110"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(relProduct.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {relProduct.condition}
                        </Badge>
                        <p className="font-bold text-lg">${relProduct.price}</p>
                      </div>
                      <h3 className="font-semibold text-base line-clamp-1 mb-1">
                        {relProduct.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relProduct.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}