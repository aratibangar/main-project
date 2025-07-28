"use client"
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SocialLink {
  platform: string
  url: string
  label?: string
}

interface SocialMediaButtonsProps {
  links: SocialLink[]
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showLabels?: boolean
  orientation?: "horizontal" | "vertical"
}

const socialIcons: Record<string, LucideIcon> = {
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  youtube: YoutubeIcon,
  email: MailIcon,
  phone: PhoneIcon,
  website: LinkIcon,
}

const socialColors: Record<string, string> = {
  twitter: "hover:bg-blue-500 hover:text-white",
  facebook: "hover:bg-blue-600 hover:text-white",
  instagram: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white",
  linkedin: "hover:bg-blue-700 hover:text-white",
  github: "hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900",
  youtube: "hover:bg-red-600 hover:text-white",
  email: "hover:bg-green-600 hover:text-white",
  phone: "hover:bg-emerald-600 hover:text-white",
  website: "hover:bg-indigo-600 hover:text-white",
}

function getSocialIcon(platform: string): LucideIcon {
  const normalizedPlatform = platform.toLowerCase()
  return socialIcons[normalizedPlatform] || LinkIcon
}

function getSocialColor(platform: string): string {
  const normalizedPlatform = platform.toLowerCase()
  return socialColors[normalizedPlatform] || "hover:bg-primary hover:text-primary-foreground"
}

function getSocialLabel(platform: string, customLabel?: string): string {
  if (customLabel) return customLabel

  const labels: Record<string, string> = {
    twitter: "Twitter",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    youtube: "YouTube",
    email: "Email",
    phone: "Phone",
    website: "Website",
  }

  const normalizedPlatform = platform.toLowerCase()
  return labels[normalizedPlatform] || platform
}

export function SocialMediaButtons({
  links,
  variant = "outline",
  size = "default",
  className,
  showLabels = false,
  orientation = "horizontal",
}: SocialMediaButtonsProps) {
  const containerClasses = cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap", className)

  return (
    <div className={containerClasses}>
      {links.map((link, index) => {
        const Icon = getSocialIcon(link.platform)
        const colorClass = getSocialColor(link.platform)
        const label = getSocialLabel(link.platform, link.label)

        return (
          <Button
            key={index}
            variant={variant}
            size={showLabels ? size : size === "default" ? "icon" : size}
            className={cn("transition-all duration-200", colorClass, showLabels && "justify-start")}
            asChild
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${label} profile`}>
              <Icon className={cn("h-4 w-4", showLabels && "mr-2")} />
              {showLabels && <span>{label}</span>}
            </a>
          </Button>
        )
      })}
    </div>
  )
}

// Preset configurations for common use cases
export function SocialMediaIconButtons({ links, className }: { links: SocialLink[]; className?: string }) {
  return <SocialMediaButtons links={links} variant="outline" size="icon" className={className} />
}

export function SocialMediaLabelButtons({ links, className }: { links: SocialLink[]; className?: string }) {
  return <SocialMediaButtons links={links} variant="outline" size="default" showLabels={true} className={className} />
}

export function SocialMediaGhostButtons({ links, className }: { links: SocialLink[]; className?: string }) {
  return <SocialMediaButtons links={links} variant="ghost" size="icon" className={className} />
}
