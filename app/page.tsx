"use client";

import { useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  ThumbsUp,
  Search,
} from "lucide-react";
import useProducts from "@/store/useProducts";
import useUserPreferences from "@/store/useUserPreferences";
import { CATEGORIES } from "@/store/useProducts";

export default function Home() {
  const { products, featuredProducts, fetchProducts } = useProducts();
  const { addToRecentlyViewed, addToFavorites, removeFromFavorites, isFavorite } =
    useUserPreferences();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Featured categories to show on homepage
  const featuredCategories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
  ];

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <Badge variant="outline" className="mb-4 animate-pulse">New Items Every Day</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                Discover Quality <br className="hidden md:block" /> Second-Hand Treasures
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto md:mx-0">
                Buy and sell pre-loved items in your community. Save money and help the planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-[400px] rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-background/60 to-transparent z-10"></div>
              <Image
                src="https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg"
                alt="Featured marketplace items"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Items</h2>
            <Link href="/products" className="group flex items-center text-primary">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => addToRecentlyViewed(product.id)}
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
                        className={`h-5 w-5 ${
                          isFavorite(product.id)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
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
        </div>
      </section>

      {/* Browse By Category */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse By Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md text-center">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      {category === "Electronics" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                      )}
                      {category === "Clothing" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M3 6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C4.52 3 5.08 3 6.2 3h5.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C15 4.52 15 5.08 15 6.2v.6c0 .84 0 1.26-.164 1.581a1.5 1.5 0 0 1-.655.655C13.86 9.2 13.44 9.2 12.6 9.2h-7.2c-.84 0-1.26 0-1.581-.164a1.5 1.5 0 0 1-.655-.655C3 8.06 3 7.64 3 6.8v-.6Z"/><path d="M3 6.2v12.6c0 .28 0 .42.055.527a.5.5 0 0 0 .218.218C3.38 19.6 3.52 19.6 3.8 19.6h6.4c.28 0 .42 0 .527-.055a.5.5 0 0 0 .218-.218c.055-.107.055-.247.055-.527V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C9.48 3 8.92 3 7.8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 4.52 3 5.08 3 6.2Z"/><path d="M13.8 19.6h2.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 17.32 21 16.48 21 14.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 3 18.92 3 17.8 3h-5.6C11.08 3 10.52 3 10.092 3.218a2 2 0 0 0-.874.874C9 4.52 9 5.08 9 6.2v.6c0 .84 0 1.26.164 1.581a1.5 1.5 0 0 0 .655.655c.321.164.741.164 1.581.164h1.2c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874c.218.428.218.988.218 2.108v7.2Z"/></svg>
                      )}
                      {category === "Home & Garden" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M2 22V7c0-1.4 0-2.1.327-2.635a3 3 0 0 1 1.311-1.311C4.2 2.8 4.9 2.8 6.3 2.8H11c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C19 6.6 19 8 19 10.8V22"/><path d="M2 5h17"/><path d="M2 22h20"/><path d="M19 22v-4.6c0-1.33 0-1.995-.342-2.636a3.5 3.5 0 0 0-1.522-1.522C16.495 12.9 15.83 12.9 14.5 12.9h-1c-1.33 0-1.995 0-2.636.342a3.5 3.5 0 0 0-1.522 1.522C9 15.405 9 16.07 9 17.4V22"/><path d="M14 22v-2.5c0-.464 0-.697-.076-.89a1 1 0 0 0-.534-.534C13.197 18 12.964 18 12.5 18h-1c-.464 0-.697 0-.89.076a1 1 0 0 0-.534.534C10 18.803 10 19.036 10 19.5V22"/></svg>
                      )}
                      {category === "Sports" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SecondShop</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <ShieldCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We ensure your payments and personal information are always protected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <Truck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Local Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with sellers in your area for pickup or local delivery options.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <RefreshCw className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Sustainable Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Extend the life of products and reduce waste by shopping second-hand.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <ThumbsUp className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Verified Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our community ratings help you buy with confidence from trusted sellers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recently Added</h2>
            <Link href="/products?sort=newest" className="group flex items-center text-primary">
              <span>View all</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <Tabs defaultValue={CATEGORIES[0]} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-6 w-full md:w-auto md:inline-flex">
              {featuredCategories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-center">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {featuredCategories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products
                    .filter(product => product.category === category)
                    .slice(0, 4)
                    .map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => addToRecentlyViewed(product.id)}
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
                                className={`h-5 w-5 ${
                                  isFavorite(product.id)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
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
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Declutter and Earn?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Turn your unused items into cash. Listing is quick, easy, and free.
          </p>
          <Link href="/sell">
            <Button size="lg" variant="secondary" className="text-primary font-semibold">
              Start Selling Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}