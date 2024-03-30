"use client";

import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const { data, isLoading, isError } = trpc.auth.verifyEMail.useQuery({
    token,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="w-8 h-8 text-red-600" />
        <div className="font-semibold">There was a problem</div>
        <p className="text-muted-foreground text-sm">
          This token is invalid or might be expired. Please, try again later.
        </p>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-60 h-60 relative mb-4 text-muted-foreground">
          <Image
            src="/ui-marketplace-email-sent.png"
            fill
            alt="the email was sent"
          />
        </div>

        <h3 className="font-semibold text-2xl">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">
          Thank you for verifying your email.
        </p>
        <Link className={buttonVariants({ className: "mt-4" })} href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
        <div className="font-semibold">Verifying...</div>
        <p className="text-muted-foreground text-sm">
          This won&apos;t take long.
        </p>
      </div>
    );
  }
};

export default VerifyEmail;
