import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative pt-20 flex flex-col items-center justify-center lg:pt-0">
      <div className="w-full sm:w-[350px] flex flex-col justify-center mx-auto space-y-6">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1">
            <div className="relative w-60 h-60 mb-4 text-muted-foreground">
              <Image
                src="/ui-marketplace-email-sent.png"
                fill
                alt=" ui marketplace email sent image"
              />
            </div>
            <h3 className="font-semibold text-2xl">Check your email</h3>
            {toEmail ? (
              <p>
                We&apos;ve sent a verification link to
                <span className="font-semibold">{toEmail}</span>.
              </p>
            ) : (
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a verification link to your email.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
