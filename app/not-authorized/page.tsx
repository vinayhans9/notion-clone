"use client";

import Link from "next/link"

const page = () => {
  return (
    <div>You are not authorized to view this page. Redirect <Link href="/">Home</Link></div>
  )
}

export default page