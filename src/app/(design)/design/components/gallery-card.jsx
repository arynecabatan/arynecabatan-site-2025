import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function GalleryCard({ image, title, description, link }) {
  return (
    <Link href={link}>
      <Card className="w-fit p-1 lg:p-2 hover:bg-muted/20 cursor-pointer">
        <CardContent className="flex gap-2 lg:gap-4 p-1 lg:p-2">
          <div className="relative w-[120px] aspect-square flex-1 sm:flex-2">
            <Image
              alt={title}
              src={image || "/placeholder.jpg"}
              fill
              className="object-cover rounded-lg aspect-square"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="flex flex-col justify-end space-y-2 flex-3 lg:pb-3">
            <h3 className="text-sm md:text-base leading-none font-medium">
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 text-xs lg:text-sm leading-snug">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


// export default function GalleryCard({ image, title, description, link }) {
//   return (
//     <Link href={link}>
//       <Card className="w-fit p-1 lg:p-2 hover:bg-muted/20 cursor-pointer">
//         <CardContent className="flex gap-2 lg:gap-4 p-1 lg:p-2">
//           <div className="relative w-full aspect-square flex-1 sm:flex-2">
//             <Image
//               alt={title}
//               src={image}
//               fill
//               className="object-cover rounded-lg aspect-square"
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             />
//           </div>

//           <div className="flex flex-col justify-end space-y-2 flex-3 lg:pb-3">
//             <h3 className="text-sm md:text-base leading-none font-medium">
//               {title}
//             </h3>
//             <p className="text-muted-foreground line-clamp-3 md:line-clamp-4 text-xs lg:text-sm leading-snug">
//               {description}
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }