"use client";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const TelephoneInput = ({
  name,
  placeholder,
  setValue,
  setPhoneInput,
  value,
  setAllowSubmit,
}: {
  name: string;
  placeholder: string;
  setValue: any;
  setPhoneInput?: any;
  value?: string;
  setAllowSubmit?: (allowSubmit: boolean) => void;
}) => {
  const [val, setVal] = useState(value || undefined);

  const handleChange = (val: any) => {
    setVal(val);
    setValue(name, val);
    setPhoneInput(val);
    setAllowSubmit && setAllowSubmit(true);
  };
  return (
    <div className="w-full">
      <PhoneInput
        enableSearch
        country={"sa"}
        value={val}
        placeholder={placeholder}
        onChange={handleChange}
        countryCodeEditable={false}
        onBlur={() => {
          setAllowSubmit && setAllowSubmit(true);
        }}
        inputStyle={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          height: "38px",
          color: "#777",
        }}
      />
    </div>
  );
};
