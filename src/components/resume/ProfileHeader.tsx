"use client";

import { Mail, Phone, MapPin, Globe, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui";
import { SocialLinks } from "@/components/contact/SocialLinks";

export function ProfileHeader() {
  return (
    <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
      {/* Profile Photo */}
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg flex-shrink-0 bg-gray-200 dark:bg-gray-700">
        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        {/* Large gradient headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
            {profile.name.split(" ")[0]}
          </span>
          {profile.name.split(" ").length > 1 && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-slow">
                {profile.name.split(" ").slice(1).join(" ")}
              </span>
            </>
          )}
        </h1>

        {/* Animated subtitle */}
        <p className="text-xl md:text-2xl font-medium mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-[length:100%_auto] bg-clip-text text-transparent">
            {profile.title}
          </span>
        </p>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <a
            href={`mailto:${profile.email}`}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {profile.email}
          </a>
          {/* <span className="flex items-center gap-1.5"> */}
          {/* <Phone className="w-4 h-4" /> */}
          {/* {profile.phone} */}
          {/* </span> */}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {profile.location}
          </span>
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Portfolio
          </a>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <SocialLinks />
          <Button href="/print">
            <Download className="w-4 h-4 mr-2" />
            View Resume
          </Button>
        </div>
      </div>
    </header>
  );
}
