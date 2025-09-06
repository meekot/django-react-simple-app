import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { useNavigate } from "react-router-dom";

import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <DefaultLayout showNavigation={false}>
      <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-16 min-h-[60vh]">
        <div className="text-center">
          {/* Large 404 Number */}
          <div className="mb-8">
            <span className={title({ size: "lg", color: "violet" })}>404</span>
          </div>

          {/* Main Message */}
          <div className="inline-block max-w-2xl text-center justify-center mb-8">
            <h1 className={title({ size: "md" })}>Oops! Page Not Found</h1>
            <div className={subtitle({ class: "mt-4 max-w-md mx-auto" })}>
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved to another location.
            </div>
          </div>

          {/* Illustration Card */}
          <Card className="max-w-md mx-auto mb-8 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/20 dark:to-pink-950/20 border-none shadow-lg">
            <CardBody className="flex flex-col items-center justify-center p-8">
              <div className="text-8xl mb-4 opacity-60">🔍</div>
              <p className="text-default-600 text-center">
                We searched everywhere but couldn&apos;t find what you&apos;re
                looking for.
              </p>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="min-w-[140px]"
              color="primary"
              size="lg"
              variant="solid"
              onPress={handleGoHome}
            >
              Go Home
            </Button>
            <Button
              className="min-w-[140px]"
              color="default"
              size="lg"
              variant="bordered"
              onPress={handleGoBack}
            >
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-divider">
            <p className="text-default-500 mb-4">
              Need help? Try these popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                className="text-primary hover:text-primary-600 transition-colors"
                href="/"
              >
                Home
              </Link>
              <span className="text-default-300">•</span>
              <Link
                className="text-primary hover:text-primary-600 transition-colors"
                href="/login"
              >
                Login
              </Link>
              <span className="text-default-300">•</span>
              <Link
                className="text-primary hover:text-primary-600 transition-colors"
                href="/register"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
