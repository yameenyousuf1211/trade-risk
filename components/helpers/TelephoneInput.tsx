"use client";
import { useState } from "react";

export const TelephoneInput = ({
  name,
  placeholder,
  setValue,
}: {
  name: string;
  placeholder: string;
  setValue: any;
}) => {
  const [val, setVal] = useState();
  console.log(val);
  return (
    <div>
      
    </div>
  );
};
