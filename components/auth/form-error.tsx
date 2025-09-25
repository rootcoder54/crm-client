import React from "react";
import { CircleHelp } from "lucide-react";

interface formErroProp {
  message?: string;
}

function FormError({ message }: formErroProp) {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 rounded p-3 flex gap-x-3 text-destructive items-center">
      <CircleHelp className="h-6 w-6" />
      {message}
    </div>
  );
}

export default FormError;
