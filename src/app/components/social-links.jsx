"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiMail,
  FiLink
} from "react-icons/fi";

const iconMap = {
  facebook: <FiFacebook />,
  instagram: <FiInstagram />,
  github: <FiGithub />,
  email: <FiMail />,
};

export const SocialLinks = ({ socialLinks = [] }) => {

  return (
    <section className=" w-full p-4 space-x-2 flex justify-center">
      {socialLinks.map((link) => {
        const IconComponent = iconMap[link.key] || <FiLink />;
        return (
          <Button
            key={link.id}
            variant="ghost"
            size="icon"
            className="rounded-full aspect-square"
            asChild
          >
            <Link href={link.value} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
              {IconComponent}
            </Link>
          </Button>
        );
      })}
    </section>
  );
};
