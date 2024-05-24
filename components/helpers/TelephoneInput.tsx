"use client";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import 'react-phone-input-2/lib/material.css'

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
  const [selectedCountry, setSelectedCountry] = useState<string>("sa");

  const handleChange = (val: any, country: string) => {
    if (selectedCountry === country) {
      setSelectedCountry(country);
      setVal(val);
      setValue(name, val);
      setPhoneInput(val);
      // setAllowSubmit && setAllowSubmit(true);
    } else {
      setSelectedCountry(country);
      setVal("");
      setValue(name, "");
      setPhoneInput("");
    }
  };
  return (
    <div className="w-full">
      <PhoneInput
        enableSearch
        country={selectedCountry}
        value={val}
        placeholder={placeholder}
        onChange={(e, countryObj) => {
          handleChange(e, countryObj?.countryCode);
        }}
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
