"use client";
import Image from "next/image";

export const HomeHeader = ({homeHeader}) => {
  return (
    <header className="w-full justify-center items-center flex flex-col">
      <div className="relative w-30 h-30 aspect-square">
        <Image
          src={homeHeader.avatar || `/placeholder.jpg`}
          fill
          alt="avatar"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute rounded-full object-cover p-2"
        />
      </div>
      <h1 className="text-2xl font-bold">{homeHeader.headline}</h1>
      <p className="font-mono text-base">{homeHeader.subheader}</p>
    </header>
  );
};
