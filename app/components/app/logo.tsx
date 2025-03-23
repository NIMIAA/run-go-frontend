"use client";

import React from "react";
import Image from "next/image";

export default function AppLogo() {
  return (
    <Image
      src="/images/Logo.png"
      alt="logo"
      width={150}
      height={10}
      className=""
    />
  );
}
