"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import {
  Heart,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import useProducts, { CATEGORIES, CONDITIONS, type Category, type Condition } from "@/store/useProducts";
import useUserPreferences from "@/store/useUserPreferences";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, filters, isLoading, fetchProducts, setFilter, clearFilters } = useProducts();
  const { addToRecentlyViewed, addToFavorites, removeFromFavorites, isFavorite } =
    useUserPreferences();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilters, setOpenFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState("newest");
  const itemsPerPage = 12;
  
  // Handle initial URL params for filters
  useEffect(() => {
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    const sort = searchParams.get("sort");
    
    if (category) {
      setFilter("category", category as Category);
    }
    
    if (query) {
      setSearchQuery(query);
      setFilter("search", query);
    }
    
    if (sort) {
      setSortOption(sort);
    }
    
    fetchProducts();
  }, [searchParams, fetchProducts, setFilter]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }
    
    // Apply condition filter
    if (filters.condition) {
      result = result.filter(
        (product) => product.condition === filters.condition
      );
    }
    
    // Apply price filter
    result = result.filter(
      (product) => 
        product.price >= priceRange[0] && 
        product.price <= priceRange[1]
    );
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    setFilteredProducts(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, filters, sortOption, priceRange]);
  
  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter("search", searchQuery);
  };
  
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  const handleClearFilters = () => {
    clearFilters();
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setSortOption("newest");
    router.push("/products");
  };
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than the max we want to show, render all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Calculate start and end of the pagination window
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to ensure we show 3 pages in the middle
      if (startPage === 2) endPage = Math.min(4, totalPages - 1);
      if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
      
      // If there's a gap after page 1, show ellipsis
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // If there's a gap before last page, show ellipsis
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Mobile filters toggle */}
          <Sheet open={openFilters} onOpenChange={setOpenFilters}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden mb-4 w-full flex items-center"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters & Sort
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:max-w-md">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear all
                  </Button>
                </div>
                
                <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                  
                  {/* Mobile Sorting */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Sort By</h4>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => setSortOption(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.category === category}
                            onCheckedChange={() => {
                              if (filters.category === category) {
                                setFilter("category", null);
                              } else {
                                setFilter("category", category);
                              }
                            }}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Condition */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Condition</h4>
                    <div className="space-y-2">
                      {CONDITIONS.map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={filters.condition === condition}
                            onCheckedChange={() => {
                              if (filters.condition === condition) {
                                setFilter("condition", null);
                              } else {
                                setFilter("condition", condition);
                              }
                            }}
                          />
                          <label
                            htmlFor={`condition-${condition}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-medium mb-4">Price Range</h4>
                    <Slider
                      defaultValue={[0, 1000]}
                      value={priceRange}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setOpenFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 sticky top-24">
            <div className="pr-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-8 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
              
              <Accordion type="multiple" defaultValue={["categories", "condition", "price"]}>
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`desktop-category-${category}`}
                            checked={filters.category === category}
                            onCheckedChange={() => {
                              if (filters.category === category) {
                                setFilter("category", null);
                              } else {
                                setFilter("category", category);
                              }
                            }}
                          />
                          <label
                            htmlFor={`desktop-category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="condition">
                  <AccordionTrigger>Condition</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {CONDITIONS.map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`desktop-condition-${condition}`}
                            checked={filters.condition === condition}
                            onCheckedChange={() => {
                              if (filters.condition === condition) {
                                setFilter("condition", null);
                              } else {
                                setFilter("condition", condition);
                              }
                            }}
                          />
                          <label
                            htmlFor={`desktop-condition-${condition}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <Slider
                      defaultValue={[0, 1000]}
                      value={priceRange}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">${priceRange[0]}</span>
                      <span className="text-sm">${priceRange[1]}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort for Desktop */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters */}
            {(filters.category || filters.condition || filters.search) && (
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                
                {filters.category && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {filters.category}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setFilter("category", null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filters.condition && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Condition: {filters.condition}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setFilter("condition", null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => {
                        setFilter("search", "");
                        setSearchQuery("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={handleClearFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
            
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {currentProducts.length} of {filteredProducts.length} results
              </p>
            </div>
            
            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      isDisabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {getPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      isDisabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}