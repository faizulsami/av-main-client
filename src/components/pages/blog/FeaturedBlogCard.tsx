import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface FeaturedBlogCardProps {
  title: string;
  image: string;
  slug: string;
  author: string;
  excerpt: string;
  date: string;
  content: string;
  blogCategory: string;
  categories?: string[];
}

export default function FeaturedBlogCard({
  title,
  image,
  slug,
  author,
  date,
  excerpt,
  blogCategory,
}: FeaturedBlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-background">
        <div className="relative">
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col space-y-4 p-6">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground/90 line-clamp-2">
              {title}
            </h2>

            <div className="flex gap-3 items-center">
              <Badge
                key={blogCategory}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {blogCategory}
              </Badge>
              <p className="text-sm text-muted-foreground">@ {author}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={16} />
                {date}
              </p>
            </div>
          </div>

          {/* Display the excerpt */}
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-muted-foreground line-clamp-6">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
