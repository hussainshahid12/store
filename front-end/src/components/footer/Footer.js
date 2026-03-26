"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaPhoneFlip,
} from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Accessories", href: "/accessories" },
      { name: "Offers", href: "/offers" },
    ],
    support: [
      { name: "Order Status", href: "/orders" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Contact Us", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] text-slate-600 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tight">
              <span className="bg-primary text-white px-2 py-1 rounded-md">
                Pak
              </span>
              <span className="text-slate-900 ml-1 font-bold">Bazar</span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mt-3">
              Premium shopping experience with curated collections and modern
              design.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[FaInstagram, FaFacebookF].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="group w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-primary transition-all duration-300"
                >
                  <Icon className="text-slate-500 group-hover:text-white transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-slate-900 mb-6 uppercase">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-all hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-slate-900 mb-6 uppercase">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-all hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-slate-900 uppercase">
              Contact
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3 hover:text-primary transition">
                <IoMailOutline />
                <span className="text-sm">hello@pakbazar.com</span>
              </div>

              <div className="flex items-center gap-3 hover:text-primary transition">
                <FaPhoneFlip />
                <span className="text-sm">+92 (310) 3302133</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
              Support available 24/7
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} Pak Bazar. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-primary"
            >
              Terms
            </Link>

            {/* <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500">Online</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
