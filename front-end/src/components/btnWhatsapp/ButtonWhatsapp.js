"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "+92 3103302133"; // your WhatsApp number (without +)

  return (
    <Link
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105">
        
        {/* Icon */}
        <FaWhatsapp size={22} />

        {/* Text (hidden on mobile) */}
        <span className="hidden sm:block text-sm font-semibold">
          Chat with us
        </span>
      </div>

      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></span>
    </Link>
  );
};

export default WhatsAppButton;
