import {
  createFileRoute,
  useSearch,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import classname from "classnames";
import { useAuth } from "../../auth/AuthContext.tsx";
import { User } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { useRouter } from "@tanstack/react-router";
import Button from "../../components/ui/primitives/Button.tsx";
import { FormErrorBox } from "../../components/ui/form/FormErrorBox.tsx";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown> | undefined) => {
    return {
      redirectTo:
        typeof search?.redirectTo === "string" ? search?.redirectTo : undefined,
    };
  },
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context.auth;

    if (isAuthenticated) {
      return { redirectTo: "/" };
    }
  },
});

function RouteComponent() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const search = useSearch({ from: Route.id });

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const _User = useMemo(() => User, []);

  const parseEmail = useMemo(() => _User.emailSchema.safeParse(email), [email]);
  const parsePassword = useMemo(
    () => _User.passwordSchema.safeParse(password),
    [password]
  );

  const buttonLabel = useMemo(() => {
    if (loading) return "Logging in...";
    if (error) return "Error";
    if (emailError || passwordError) return "Fix Errors";
    return "Login";
  }, [loading, error, emailError, passwordError]);

  useEffect(() => {
    if (!isDirty) return;
    setEmailError(null);
  }, [email]);

  useEffect(() => {
    if (!isDirty) return;
    setPasswordError(null);
  }, [password]);

  useEffect(() => {
    if (!isDirty) return;
    setError(null);
    setIsDirty(false);
  }, [email, password]);

  const emailInputClass = useMemo(
    () =>
      classname(
        "p-2 border rounded w-full mt-4",
        emailError ? "border-red-500" : "border-gray-300",
        loading && "bg-gray-100 cursor-not-allowed cursor-progress"
      ),
    [emailError, loading]
  );

  const passwordInputClass = useMemo(
    () =>
      classname(
        "p-2 border rounded w-full mt-4",
        passwordError ? "border-red-500" : "border-gray-300",
        loading && "bg-gray-100 cursor-not-allowed cursor-progress"
      ),
    [passwordError, loading]
  );

  const buttonClass = useMemo(() => {
    const baseClass = " text-white p-2 rounded-lg  w-full mt-8";
    const errorClass = "bg-red-500 cursor-not-allowed";
    const loadingClass = "opacity-50 cursor-progress hover:bg-blue-500";
    const normalClass = "hover:bg-blue-600 cursor-pointer bg-blue-500";

    const isError = !!emailError || !!passwordError || !!error;

    return classname(
      baseClass,
      loading ? loadingClass : isError ? errorClass : normalClass
    );
  }, [loading, error, emailError, passwordError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!parseEmail.success) {
      setEmailError(parseEmail.error.issues[0].message);
      return;
    }

    // Validate password
    if (!parsePassword.success) {
      setPasswordError(parsePassword.error.issues[0].message);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await login({ email, password });

      if (res instanceof ApiError) {
        setError(res.message || "Invalid email or password.");
        return;
      }

      // Redirect after login
      const redirectTo = search.redirectTo || "/dashboard";
      await router.invalidate();
      navigate({ to: redirectTo });
    } catch (error) {
      console.error(error);
      setError("Internal error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-center">Login Page</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        {error && <FormErrorBox message={error} />}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsDirty(true);
          }}
          className={emailInputClass}
          disabled={loading}
        />
        {emailError && <FormErrorBox message={emailError} />}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsDirty(true);
          }}
          className={passwordInputClass}
          disabled={loading}
        />
        {passwordError && <FormErrorBox message={passwordError} />}
        <Button
          type="submit"
          className={buttonClass}
          disabled={loading || !!error}
          formNoValidate
          startIcon={
            loading ? { name: "Loader", size: 16 } : { name: "LogIn", size: 16 }
          }
        >
          {buttonLabel}
        </Button>

        <Link
          to="/auth/accept-invite"
          className="text-blue-500 underline mt-2 block w-fit ml-auto"
        >
          Accept Invitation
        </Link>
      </form>
    </div>
  );
}
