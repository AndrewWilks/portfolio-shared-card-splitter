import { useCallback, useRef } from "react";

export interface UseStepValidationResult {
  registerStepValidation: (
    step: number,
    validator: () => boolean,
    onValidationFailed?: () => void,
  ) => void;
  unregisterStepValidation: (step: number) => void;
  isStepValid: (step: number) => boolean;
  validationFns: React.RefObject<
    Map<number, { validator: () => boolean; onFailed?: () => void }>
  >;
}

/**
 * Custom hook for step validation logic
 * Manages validation function registration and checking
 */
export function useStepValidation(): UseStepValidationResult {
  // Store validation functions and failure callbacks for each step
  const validationFns = useRef<
    Map<number, { validator: () => boolean; onFailed?: () => void }>
  >(new Map());

  const registerStepValidation = useCallback(
    (
      step: number,
      validator: () => boolean,
      onValidationFailed?: () => void,
    ) => {
      validationFns.current.set(step, {
        validator,
        onFailed: onValidationFailed,
      });
    },
    [],
  );

  const unregisterStepValidation = useCallback((step: number) => {
    validationFns.current.delete(step);
  }, []);

  const isStepValid = useCallback((step: number): boolean => {
    const entry = validationFns.current.get(step);
    return entry ? entry.validator() : true;
  }, []);

  return {
    registerStepValidation,
    unregisterStepValidation,
    isStepValid,
    validationFns,
  };
}
