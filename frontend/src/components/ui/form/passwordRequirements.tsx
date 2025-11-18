import { useMemo } from "react";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = useMemo<PasswordRequirement[]>(
    () => [
      {
        label: "At least 8 characters",
        test: (pwd) => pwd.length >= 8,
      },
      {
        label: "One uppercase letter (A-Z)",
        test: (pwd) => /[A-Z]/.test(pwd),
      },
      {
        label: "One lowercase letter (a-z)",
        test: (pwd) => /[a-z]/.test(pwd),
      },
      {
        label: "One number (0-9)",
        test: (pwd) => /[0-9]/.test(pwd),
      },
      {
        label: "One special character (!@#$%^&*)",
        test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
      },
    ],
    []
  );

  return (
    <div className="mt-2 text-sm">
      <p className="text-gray-600 mb-1">Password requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li
              key={index}
              className={`flex items-center gap-2 ${
                isMet ? "text-green-600" : "text-gray-500"
              }`}
            >
              <span className="text-xs">{isMet ? "✓" : "○"}</span>
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
