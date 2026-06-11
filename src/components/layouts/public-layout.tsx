"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SocialIcon from "@/components/ui/social-icon";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Button } from "../ui/button";
import type { ContactInfo } from "@/models/settings";

interface BasicContactInfo {
  email: string;
  phone: string;
  address: string;
}

const contactableKeys = [
  "get in touch",
  "contact us",
  "our contact",
  "contact",
];

function getBasicContactInfo(
  data?: Partial<ContactInfo> | null,
): BasicContactInfo {
  const email = typeof data?.email === "string" ? data.email : "";
  const phone = Array.isArray(data?.phones)
    ? data.phones.filter((p) => typeof p === "string").join(",")
    : "";
  const address =
    Array.isArray(data?.addresses) &&
    data.addresses.length > 0 &&
    typeof data.addresses[0]?.address === "string"
      ? data.addresses[0].address
      : "";
  return {
    email,
    phone,
    address,
  };
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { systemSettings } = useAppSelector((state) => state.content.content);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    headerLinks = [],
    footerLinks = [],
    socialLinks = [],
    contact = {},
  } = systemSettings ?? {};

  const navLinks = useMemo(
    () => headerLinks.filter((link) => !link.isButton),
    [headerLinks],
  );

  const actionLinks = useMemo(() => {
    const buttons = headerLinks.filter((link) => link.isButton);
    if (buttons.length > 0) return buttons;
    return [];
  }, [headerLinks]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = useMemo(() => {
    const current = (pathname ?? "/").replace(/\/+$/, "") || "/";
    return (href: string) => {
      if (!href.startsWith("/")) return false;
      const target = href.replace(/\/+$/, "") || "/";
      if (target === "/") return current === "/";
      return current === target || current.startsWith(`${target}/`);
    };
  }, [pathname]);

  return (
    <>
      {/* HEADER */}
      <nav className="fixed inset-x-0 top-2.5 z-50 px-4 transition-all duration-300 sm:px-6">
        <div
          className={cn(
            "mx-auto container rounded-xl md:rounded-full px-4 py-2.5 sm:px-6",
            isScrolled
              ? "border border-black/10 bg-white/85 backdrop-blur-xl"
              : "border border-transparent bg-primary",
          )}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-[200px]">
                <Image
                  src={
                    isScrolled ? "/images/logo.svg" : "/images/logo-white.svg"
                  }
                  alt={systemSettings?.siteName ?? ""}
                  loading="eager"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <div className="hidden md:flex items-center justify-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActiveLink(link.href) &&
                      (isScrolled
                        ? "bg-black/10 text-gray-900"
                        : "bg-white/15 text-white"),
                    isScrolled
                      ? "text-gray-700 hover:bg-black/5 hover:text-gray-900"
                      : "text-white/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <div className="hidden md:flex items-center gap-3">
                {actionLinks.slice(0, 2).map((link, idx) => (
                  <Button
                    key={link.label}
                    asChild
                    className={cn(
                      "rounded-full",
                      idx === 0 &&
                        !isScrolled &&
                        "bg-white text-black hover:bg-white/80",
                    )}
                    variant={idx === 1 ? "default" : "secondary"}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </div>

              <button
                className={cn(
                  "md:hidden rounded-full p-2 transition-colors",
                  isScrolled
                    ? "text-gray-900 hover:bg-black/5"
                    : "text-white hover:bg-white/10",
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-3 rounded-2xl border border-black/10 bg-white/90 p-3 backdrop-blur-xl md:hidden">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-black/5 hover:text-gray-900",
                      isActiveLink(link.href) && "bg-black/10 text-gray-900",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 border-t border-black/10 pt-3">
                <div className="grid gap-2">
                  {actionLinks.slice(0, 2).map((link, idx) => (
                    <Button
                      key={link.label}
                      asChild
                      className="w-full rounded-full"
                      variant={idx === 0 ? "secondary" : "default"}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {children}
      {/* FOOTER */}
      <footer className="bg-white py-14 text-black-foreground overflow-x-clip">
        <div className="mx-auto container px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4 min-w-0">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logo.svg"
                  alt={systemSettings?.siteName ?? ""}
                  loading="eager"
                  width={170}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-sm break-words">
                {systemSettings?.siteDescription ?? ""}
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link, i) => {
                  return (
                    <a
                      key={`${link.href}-${i}`}
                      href={link.href}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
                      aria-label={link.label}
                      target={link.target}
                      rel={link.target === "_blank" ? "noreferrer" : undefined}
                    >
                      <SocialIcon label={link.label} />
                    </a>
                  );
                })}
              </div>
            </div>

            {footerLinks.map((section) =>
              contactableKeys.includes(section.section.toLowerCase()) ? (
                <div key={section.section} className="min-w-0">
                  <h4 className="font-semibold mb-4">{section.section}</h4>
                  <ul className="space-y-2 text-sm break-words">
                    {Object.entries(getBasicContactInfo(contact)).map(
                      ([key, value]) => (
                        <li key={key} className="flex items-center space-x-2">
                          <SocialIcon label={key} color="text-primary" />
                          <p className="hover:text-primary transition-colors break-words">
                            {value}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ) : (
                <div key={section.section} className="min-w-0">
                  <h4 className="font-semibold mb-4">{section.section}</h4>
                  <ul className="space-y-2 text-sm break-words">
                    {section.links.map((link, li) => (
                      <li key={`${section.section}-${link.href}-${li}`}>
                        <Link
                          href={link.href}
                          className="hover:text-primary transition-colors break-words"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>

          <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} {systemSettings?.siteName ?? ""}. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
