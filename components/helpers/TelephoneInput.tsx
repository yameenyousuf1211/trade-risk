"use client";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
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
      <PhoneInput
        placeholder={placeholder}
        value={val}
        onChange={(val: any) => {
          setVal(val);
          setValue(name, val);
        }}
      />
    </div>
  );
};
