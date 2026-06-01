"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "./lib/auth-client"
import GoogleSignInButton from "./components/GoogleSignInButton"

export default function Page() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard")
    }
  }, [session, isPending, router])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5]">
      <section className="relative px-6 pb-0 pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-black md:text-7xl"
            >
              <span className="inline-flex items-center justify-center">
                Break your

                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 110, opacity: 1 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="inline-flex items-center justify-center overflow-visible"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 10 }}
                    transition={{
                      delay: 0.75,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 220,
                    }}
                    className="inline-flex items-center justify-center"
                  >
                    <svg
                      width="68"
                      height="48"
                      viewBox="0 0 800 560"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="relative top-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M28.6647 35.4017C3.35339 61.1829 2.60794 100.503 1.11702 179.143C0.47453 213.032 0.0181862 247.316 0.000541175 276.863C-0.0182893 308.395 0.456153 345.167 1.1329 381.295C2.61487 460.411 3.35586 499.968 28.8175 525.786C54.2791 551.603 93.8944 552.894 173.125 555.478H173.125C246.337 557.865 330.74 560 398.435 560C467.126 560 553.018 557.802 626.966 555.372C704.908 552.812 743.879 551.532 769.268 526.071C794.658 500.611 795.82 461.934 798.145 384.581C799.232 348.439 800.006 311.568 800 280C799.994 248.578 799.213 211.871 798.124 175.899C795.796 98.9997 794.631 60.5503 769.393 35.1251C744.154 9.70003 705.468 8.24373 628.097 5.33111C553.898 2.53793 467.482 0 398.435 0C330.37 0 245.425 2.46628 171.945 5.21214C93.299 8.15103 53.976 9.62048 28.6647 35.4017ZM283.366 138.824L539.335 271.373L284.932 405.49L283.366 138.824Z"
                        fill="#FF0000"
                      />
                    </svg>
                  </motion.span>
                </motion.span>

                Feed
              </span>

              <br />

              Without Losing Your Mind
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-black/55"
            >
              Analyze your subscriptions, likes and watch history to discover
              healthier, smarter and more meaningful content.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10"
            >
              <GoogleSignInButton size="large" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                duration: 0.9,
                ease: "easeOut",
              }}
              className="relative mt-8 w-full"
            >
              <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#f7f7f5] to-transparent" />

              <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl shadow-black/10">
                <Image
                  src="/dashboard.png"
                  alt="FeedMeDaddy Dashboard"
                  width={1600}
                  height={1000}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}