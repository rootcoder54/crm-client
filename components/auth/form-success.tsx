import React from "react";
import { CheckCircle } from "lucide-react";

interface formErroProp {
  message?: string;
}

function FormSuccess({ message }: formErroProp) {
  if (!message) return null;
  return (
    <div className="bg-green-400/15 rounded p-3 flex gap-x-3 text-green-900 dark:text-green-400 items-center">
      <CheckCircle className="h-6 w-6" />
      {message}
    </div>
  );
}

export default FormSuccess;
