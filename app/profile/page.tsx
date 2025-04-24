"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import {
  User,
  Settings,
  Package,
  Heart,
  Clock,
  PlusCircle,
  LogOut,
  Edit,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import useAuth from "@/store/useAuth";
import useProducts from "@/store/useProducts";
import useUserPreferences from "@/store/useUserPreferences";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const { products, isLoading, fetchProducts, getProductsBySeller } = useProducts();
  const { favorites, recentlyViewed } = useUserPreferences();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
    
    if (products.length === 0) {
      fetchProducts();
    }
  }, [isAuthenticated, router, products.length, fetchProducts]);
  
  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Redirecting to login...</span>
      </div>
    );
  }
  
  const userProducts = getProductsBySeller(user.id);
  
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );
  
  const recentlyViewedProducts = products.filter(product => 
    recentlyViewed.includes(product.id)
  );
  
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since{" "}
                  {user.createdAt ? format(parseISO(user.createdAt), "MMM d, yyyy") : "N/A"}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Package className="h-10 w-10 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">{userProducts.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <ShoppingBag className="h-10 w-10 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="h-10 w-10 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{favorites.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-10 w-10 text-primary mr-4" />
              <div>
                <p className="text-sm text-muted-foreground">Recently Viewed</p>
                <p className="text-2xl font-bold">{recentlyViewed.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="listings" className="mt-8">
          <TabsList className="mb-8">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>My Listings</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Recently Viewed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Listings</h2>
              <Button asChild>
                <Link href="/sell">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Listing
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map((product) => (
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
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            Listed on {format(parseISO(product.createdAt), "MMM d, yyyy")}
                          </span>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Listings Yet</CardTitle>
                  <CardDescription className="text-center mb-6 max-w-md">
                    You haven't listed any items for sale yet. Start selling your items and turn your unused belongings into cash.
                  </CardDescription>
                  <Button asChild>
                    <Link href="/sell">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Listing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            <h2 className="text-2xl font-bold mb-6">Favorites</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </TabsContent>
          
          <TabsContent value="history">
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentlyViewedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewedProducts.map((product) => (
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
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Viewing History</CardTitle>
                  <CardDescription className="text-center mb-6 max-w-md">
                    You haven't viewed any products yet. Start browsing to see your recent product views here.
                  </CardDescription>
                  <Button asChild>
                    <Link href="/products">
                      Start Browsing
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}