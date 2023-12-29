"use client";

import { useFormStatus } from "react-dom";
import { Loading } from "../loading";

interface SubmitButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export function SubmitButton({
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" {...props} disabled={pending}>
      {pending ? <Loading /> : children}
    </button>
  );
}
