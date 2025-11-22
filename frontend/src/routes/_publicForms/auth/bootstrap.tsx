import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader, UserPlus } from "lucide-react";
import { useAuth } from "@/auth/AuthContext.tsx";
import { User } from "@shared/entities/user/index.ts";
import { ApiError } from "@shared/entities/api/apiError.ts";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/primitives/button.tsx";
import { FormErrorBox } from "@/components/ui/form/formErrorBox.tsx";
import { redirect } from "@tanstack/react-router";
import { PasswordRequirements } from "@/components/ui/form/passwordRequirements.tsx";
import { cn } from "@/lib/utils.ts";

export const Route = createFileRoute("/_publicForms/auth/bootstrap")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { isBootstrapped } = context.auth;

    if (isBootstrapped === true) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const { bootstrap } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [firstNameDirty, setFirstNameDirty] = useState(false);

  const [lastName, setLastName] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [lastNameDirty, setLastNameDirty] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailDirty, setEmailDirty] = useState(false);

  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordDirty, setPasswordDirty] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [confirmPasswordDirty, setConfirmPasswordDirty] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const _User = useMemo(() => User, []);

  const parseFirstName = useMemo(
    () => _User.firstNameSchema.safeParse(firstName),
    [firstName],
  );
  const parseLastName = useMemo(
    () => _User.lastNameSchema.safeParse(lastName),
    [lastName],
  );
  const parseEmail = useMemo(() => _User.emailSchema.safeParse(email), [email]);
  const parsePassword = useMemo(
    () => _User.passwordSchema.safeParse(password),
    [password],
  );

  const passwordsMatch = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword],
  );

  const buttonLabel = useMemo(() => {
    if (loading) return "Creating Account...";
    if (error) return "Error";
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      confirmPasswordError
    ) {
      return "Fix Errors";
    }
    return "Create Account";
  }, [
    loading,
    error,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  ]);

  useEffect(() => {
    if (!firstNameDirty) return;
    setFirstNameError(null);
  }, [firstName, firstNameDirty]);

  useEffect(() => {
    if (!lastNameDirty) return;
    setLastNameError(null);
  }, [lastName, lastNameDirty]);

  useEffect(() => {
    if (!emailDirty) return;
    setEmailError(null);
  }, [email, emailDirty]);

  useEffect(() => {
    if (!passwordDirty) return;
    setPasswordError(null);
  }, [password, passwordDirty]);

  useEffect(() => {
    if (!confirmPasswordDirty) return;
    setConfirmPasswordError(null);
  }, [confirmPassword, confirmPasswordDirty]);

  useEffect(() => {
    setError(null);
  }, [firstName, lastName, email, password, confirmPassword]);

  const inputClass = (hasError: boolean) =>
    cn(
      "p-2 border rounded w-full mt-4",
      hasError ? "border-red-500" : "border-gray-300",
      loading && "bg-gray-100 cursor-not-allowed cursor-progress",
    );

  const buttonClass = useMemo(() => {
    const baseClass = "text-white p-2 rounded-lg w-full mt-8";
    const errorClass = "bg-red-500 cursor-not-allowed";
    const loadingClass = "opacity-50 cursor-progress hover:bg-blue-500";
    const normalClass = "hover:bg-blue-600 cursor-pointer bg-blue-500";

    const isError = !!firstNameError ||
      !!lastNameError ||
      !!emailError ||
      !!passwordError ||
      !!confirmPasswordError ||
      !!error;

    return cn(
      baseClass,
      loading ? loadingClass : isError ? errorClass : normalClass,
    );
  }, [
    loading,
    error,
    firstNameError,
    lastNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate firstName
    if (!parseFirstName.success) {
      setFirstNameError(parseFirstName.error.issues[0].message);
      setFirstNameDirty(true);
      return;
    }

    // Validate lastName
    if (!parseLastName.success) {
      setLastNameError(parseLastName.error.issues[0].message);
      setLastNameDirty(true);
      return;
    }

    // Validate email
    if (!parseEmail.success) {
      setEmailError(parseEmail.error.issues[0].message);
      setEmailDirty(true);
      return;
    }

    // Validate password
    if (!parsePassword.success) {
      setPasswordError(parsePassword.error.issues[0].message);
      setPasswordDirty(true);
      return;
    }

    // Validate password confirmation
    if (confirmPassword === "") {
      setConfirmPasswordError("Please confirm your password");
      setConfirmPasswordDirty(true);
      return;
    }

    if (!passwordsMatch) {
      setConfirmPasswordError("Passwords must match");
      setConfirmPasswordDirty(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await bootstrap({ email, password, firstName, lastName });

      if (res instanceof ApiError) {
        setError(res.message || "Bootstrap failed. Please try again.");
        return;
      }

      // Success - navigate to dashboard (user is auto-logged in)
      await router.invalidate();
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error(error);
      setError("Internal error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome to
          <br />
          FairShare
        </h1>
        <p className="text-gray-600 mt-2">
          Let's set up your first administrator account to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        {error && <FormErrorBox message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setFirstNameDirty(true);
              }}
              className={inputClass(!!firstNameError)}
              disabled={loading}
            />
            {firstNameError && <FormErrorBox message={firstNameError} />}
          </div>

          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setLastNameDirty(true);
              }}
              className={inputClass(!!lastNameError)}
              disabled={loading}
            />
            {lastNameError && <FormErrorBox message={lastNameError} />}
          </div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailDirty(true);
          }}
          className={inputClass(!!emailError)}
          disabled={loading}
        />
        {emailError && <FormErrorBox message={emailError} />}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordDirty(true);
          }}
          className={inputClass(!!passwordError)}
          disabled={loading}
        />
        {passwordError && <FormErrorBox message={passwordError} />}
        <PasswordRequirements password={password} />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordDirty(true);
          }}
          className={inputClass(!!confirmPasswordError)}
          disabled={loading}
        />
        {confirmPasswordError && <FormErrorBox
          message={confirmPasswordError}
        />}

        <Button
          type="submit"
          className={buttonClass}
          disabled={loading || !!error}
          formNoValidate
        >
          {loading ? <Loader size={16} /> : <UserPlus size={16} />}
          &nbsp;
          {buttonLabel}
        </Button>
      </form>
    </div>
  );
}
