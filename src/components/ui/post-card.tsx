import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/models/post";

interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
  href?: string;
  variant?: "default" | "horizontal" | "featured";
  aspectRatio?: "portrait" | "video" | "square";
  actions?: React.ReactNode;
  actionsClassName?: string;
}

export function PostCard({
  post,
  href,
  variant = "default",
  aspectRatio = "video",
  actions,
  actionsClassName,
  className,
  ...props
}: PostCardProps) {
  const hrefLink = href ?? `/blog/${encodeURIComponent(post.slug)}`;
  // Horizontal Layout
  if (variant === "horizontal") {
    if (actions) {
      return (
        <Card
          className={cn(
            "flex flex-col h-full py-0 overflow-hidden hover:border-primary/50 transition-all duration-300 border border-primary/25",
            className,
          )}
          {...props}
        >
          <Link href={hrefLink} className="block h-full group">
            <div className="flex flex-col sm:flex-row h-full">
              <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-muted">
                <Image
                  src={post.featuredMedia.url}
                  alt={post.featuredMedia.alt || post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                    {post.category.name}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(
                      new Date(post.publishedAt || post.createdAt),
                      "MMM d, yyyy",
                    )}
                  </span>
                  <span>•</span>
                  <span>{post.stats.readingTime} min read</span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground line-clamp-2 mb-4 text-sm flex-1">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
          <CardFooter className="mt-auto pt-4 border-t">
            <div
              className={cn(
                "flex items-center justify-between w-full",
                actionsClassName,
              )}
            >
              {actions}
            </div>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Link href={hrefLink} className="block h-full group">
        <Card
          className={cn(
            "flex flex-col sm:flex-row h-full py-0 overflow-hidden hover:border-primary/50 transition-all duration-300 border border-primary/25",
            className,
          )}
          {...props}
        >
          <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-muted">
            <Image
              src={post.featuredMedia.url}
              alt={post.featuredMedia.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                {post.category.name}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col flex-1 p-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(
                  new Date(post.publishedAt || post.createdAt),
                  "MMM d, yyyy",
                )}
              </span>
              <span>•</span>
              <span>{post.stats.readingTime} min read</span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-muted-foreground line-clamp-2 mb-4 text-sm flex-1">
              {post.excerpt}
            </p>
          </div>
        </Card>
      </Link>
    );
  }

  // Featured Layout
  if (variant === "featured") {
    if (actions) {
      return (
        <div className={cn("space-y-3", className)} {...props}>
          <Link href={hrefLink} className="block h-full group">
            <Card className="relative h-full overflow-hidden hover:border-primary/50 transition-all duration-300 border border-primary/25 min-h-[400px]">
              <Image
                src={post.featuredMedia.url}
                alt={post.featuredMedia.alt || post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <Badge className="mb-4 bg-primary text-primary-foreground border-none hover:bg-primary/90">
                  {post.category.name}
                </Badge>

                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(
                      new Date(post.publishedAt || post.createdAt),
                      "MMM d, yyyy",
                    )}
                  </span>
                  <span>•</span>
                  <span>{post.stats.readingTime} min read</span>
                </div>

                <h3 className="max-w-2xl text-2xl sm:text-4xl font-black mb-4 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-300 line-clamp-2 mb-6 max-w-2xl text-base sm:text-lg">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
          <div
            className={cn(
              "flex items-center justify-between gap-2",
              actionsClassName,
            )}
          >
            {actions}
          </div>
        </div>
      );
    }

    return (
      <Link href={hrefLink} className="block h-full group">
        <Card
          className={cn(
            "relative h-full overflow-hidden hover:border-primary/50 transition-all duration-300 border border-primary/25 min-h-[400px]",
            className,
          )}
          {...props}
        >
          <Image
            src={post.featuredMedia.url}
            alt={post.featuredMedia.alt || post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <Badge className="mb-4 bg-primary text-primary-foreground border-none hover:bg-primary/90">
              {post.category.name}
            </Badge>

            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
              <Calendar className="h-4 w-4" />
              <span>
                {format(
                  new Date(post.publishedAt || post.createdAt),
                  "MMM d, yyyy",
                )}
              </span>
              <span>•</span>
              <span>{post.stats.readingTime} min read</span>
            </div>

            <h3 className="max-w-2xl text-2xl sm:text-4xl font-black mb-4 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-gray-300 line-clamp-2 mb-6 max-w-2xl text-base sm:text-lg">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Default Vertical Layout
  if (actions) {
    return (
      <Card
        className={cn(
          "flex flex-col h-full overflow-hidden hover:border-primary/50 transition-all duration-300 border border-primary/25",
          className,
        )}
        {...props}
      >
        <Link href={hrefLink} className="block h-full group">
          <div
            className={cn(
              "relative w-full overflow-hidden bg-muted",
              aspectRatio === "portrait"
                ? "aspect-[3/4]"
                : aspectRatio === "square"
                  ? "aspect-square"
                  : "aspect-video",
            )}
          >
            <Image
              src={post.featuredMedia.url}
              alt={post.featuredMedia.alt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                {post.category.name}
              </Badge>
            </div>
          </div>

          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(
                  new Date(post.publishedAt || post.createdAt),
                  "MMM d, yyyy",
                )}
              </span>
              <span>•</span>
              <span>{post.stats.readingTime} min read</span>
            </div>
            <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {post.excerpt}
            </p>
          </CardContent>
        </Link>

        <CardFooter className="mt-auto pt-4 border-t">
          <div
            className={cn(
              "flex items-center justify-between w-full",
              actionsClassName,
            )}
          >
            {actions}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Link href={hrefLink} className="block h-full group">
      <Card
        className={cn(
          "flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-muted",
            aspectRatio === "portrait"
              ? "aspect-[3/4]"
              : aspectRatio === "square"
                ? "aspect-square"
                : "aspect-video",
          )}
        >
          <Image
            src={post.featuredMedia.url}
            alt={post.featuredMedia.alt || post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
              {post.category.name}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(
                new Date(post.publishedAt || post.createdAt),
                "MMM d, yyyy",
              )}
            </span>
            <span>•</span>
            <span>{post.stats.readingTime} min read</span>
          </div>
          <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="mt-auto pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              className="group/btn pointer-events-none" // pointer-events-none because parent is link
            >
              Read More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
