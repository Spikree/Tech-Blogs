import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md";
  className?: string;
};

const sizes = { sm: 28, md: 36 };

export default function UserAvatar({ name, image, size = "md", className }: Props) {
  const px = sizes[size];
  const box = cn(
    "shrink-0 rounded-full",
    size === "sm" ? "size-7 text-xs" : "size-9 text-sm",
    className
  );

  if (image) {
    return (
      <Image
        src={image}
        width={px}
        height={px}
        alt=""
        className={cn(box, "aspect-square object-cover")}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(box, "flex items-center justify-center bg-secondary font-medium text-secondary-foreground")}
    >
      {(name?.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}
