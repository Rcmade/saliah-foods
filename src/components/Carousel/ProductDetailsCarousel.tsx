"use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function ProductDetailsCarousel({
  images,
}: {
  images: string[];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from(images).map((image, index) => (
            <CarouselItem className="" key={index}>
              <div className="md:flex md:flex-col md:items-center">
                <Image
                  src={image ?? ""}
                  alt="Product Image"
                  width={500}
                  height={508}
                  className="rounded-xl bg-white md:m-0 m-auto"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center flex-col gap-6 mt-4">
        <div className="flex no-scrollbar gap-2 max-w-full overflow-x-auto items-center">
          {Array.from(images).map((image, i) => (
            <Image
              onClick={() => {
                if (api) {
                  api.scrollTo(i);
                }
              }}
              key={`preview-${i}`}
              src={image}
              alt="product"
              width={200}
              height={200}
              className="max-w-full  bg-white cursor-pointer object-contain rounded-lg"
            />
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          {Array.from({ length: images.length }).map((_, i) => (
            <div
              onClick={() => {
                if (api) {
                  api.scrollTo(i);
                }
              }}
              key={`bullet-${i}`}
              className={`w-4 h-4 cursor-pointer border border-bg-primary rounded-full ${
                i === current - 1 ? "bg-bg-primary" : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
