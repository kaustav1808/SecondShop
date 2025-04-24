"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, ArrowLeft } from "lucide-react";
import useProducts from "@/store/useProducts";
import useUserPreferences from "@/store/useUserPreferences";

export default function FavoritesPage() {
  const { products, isLoading, fetchProducts } = useProducts();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useUserPreferences();
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);
  
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );
  
  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full transition-transform hover:scale-110"
                    >
                      <Heart
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {product.condition}
                      </Badge>
                      <p className="font-bold text-lg">${product.price}</p>
                    </div>
                    <h3 className="font-semibold text-base line-clamp-1 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={product.sellerAvatar}
                          alt={product.sellerName}
                        />
                        <AvatarFallback>{product.sellerName[0]}</AvatarFallback>
                      </Avatar>
                      <span>{product.sellerName}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/40 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Favorites Yet</CardTitle>
              <CardDescription className="text-center mb-6 max-w-md">
                You haven't added any items to your favorites yet. Browse products and click the heart icon to save them here.
              </CardDescription>
              <Button asChild>
                <Link href="/products">
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}