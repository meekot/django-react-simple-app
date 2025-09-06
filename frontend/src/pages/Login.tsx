import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Alert } from "@heroui/alert";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";

import { api, ApiError } from "../api";

import { LoginRequest } from "@/types/api";
import DefaultLayout from "@/layouts/default";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");

      return;
    }

    setIsLoading(true);

    try {
      const credentials: LoginRequest = { username, password };
      const response = await api.login(credentials);

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      navigate("/");
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.details?.detail || "Some error happens");
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <DefaultLayout showNavigation={false}>
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome back
                </h1>
                <p className="text-foreground-500">Sign in to your account</p>
              </div>

              {error && (
                <Alert className="mb-2" color="danger">
                  {error}
                </Alert>
              )}

              <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                  isRequired
                  label="Username"
                  placeholder="Enter your username"
                  startContent={
                    <Icon
                      className="text-default-400 text-lg"
                      icon="lucide:user"
                    />
                  }
                  value={username}
                  onValueChange={setUsername}
                />

                <Input
                  isRequired
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      <Icon
                        className="text-default-400 text-lg cursor-pointer"
                        icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                      />
                    </button>
                  }
                  label="Password"
                  placeholder="Enter your password"
                  startContent={
                    <Icon
                      className="text-default-400 text-lg"
                      icon="lucide:lock"
                    />
                  }
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onValueChange={setPassword}
                />

                <Button
                  fullWidth
                  className="mt-2"
                  color="primary"
                  isLoading={isLoading}
                  type="submit"
                >
                  Sign In
                </Button>

                <div className="text-center text-sm text-foreground-500 mt-4">
                  Don&apos;t have an account?{" "}
                  <Link className="text-primary hover:underline" to="/register">
                    Sign up
                  </Link>
                </div>
              </Form>
            </div>
          </Card>
        </motion.div>
      </div>
    </DefaultLayout>
  );
};
