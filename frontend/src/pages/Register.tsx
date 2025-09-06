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

import { RegisterRequest } from "@/types/api";
import DefaultLayout from "@/layouts/default";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // Basic validation
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError("Please fill in all required fields");

      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");

      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");

      return;
    }

    setIsLoading(true);

    try {
      const userData: RegisterRequest = {
        username: username.trim(),
        password,
        email: email.trim(),
        ...(firstName.trim() && { first_name: firstName.trim() }),
        ...(lastName.trim() && { last_name: lastName.trim() }),
      };

      await api.register(userData);

      setSuccess("Account created successfully! Redirecting to login...");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (e) {
      if (e instanceof ApiError) {
        // Handle specific error messages from the API
        if (e.details?.username) {
          setError(`Username: ${e.details.username[0]}`);
        } else if (e.details?.email) {
          setError(`Email: ${e.details.email[0]}`);
        } else if (e.details?.password) {
          setError(`Password: ${e.details.password[0]}`);
        } else {
          setError(
            e.details?.detail || "Registration failed. Please try again.",
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
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
                  Create Account
                </h1>
                <p className="text-foreground-500">Sign up for a new account</p>
              </div>

              {error && (
                <Alert className="mb-2" color="danger">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert className="mb-2" color="success">
                  {success}
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
                  label="Email"
                  placeholder="Enter your email"
                  startContent={
                    <Icon
                      className="text-default-400 text-lg"
                      icon="lucide:mail"
                    />
                  }
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                />

                <div className="flex gap-2">
                  <Input
                    label="First Name"
                    placeholder="First name"
                    startContent={
                      <Icon
                        className="text-default-400 text-lg"
                        icon="lucide:user-circle"
                      />
                    }
                    value={firstName}
                    onValueChange={setFirstName}
                  />

                  <Input
                    label="Last Name"
                    placeholder="Last name"
                    startContent={
                      <Icon
                        className="text-default-400 text-lg"
                        icon="lucide:user-circle"
                      />
                    }
                    value={lastName}
                    onValueChange={setLastName}
                  />
                </div>

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
                  Create Account
                </Button>

                <div className="text-center text-sm text-foreground-500 mt-4">
                  Already have an account?{" "}
                  <Link className="text-primary hover:underline" to="/login">
                    Sign in
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
