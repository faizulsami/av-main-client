import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CompactBlogCardProps {
  title: string;
  image: string;
  slug: string;
  author: string;
  excerpt: string;
  blogCategory: string;
  date: string;
}

export default function CompactBlogCard({
  title,
  image,
  slug,
  author,
  excerpt,
  blogCategory,
  date,
}: CompactBlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="relative block group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="space-y-2 p-4 pb-3">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground/90 line-clamp-2">
              {title}
            </h2>

            <div className="flex flex-col gap-3 items-start">
              <Badge
                key={blogCategory}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {blogCategory}
              </Badge>
              <div className="flex gap-3 items-center">
                <p className="text-xs text-muted-foreground">@ {author}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={14} />
                  {date}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground text-wrap line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button
            asChild
            variant="ghost"
            className="ml-auto text-xs font-bold hover:bg-primary/10 hover:text-primary rounded-full"
          ></Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
