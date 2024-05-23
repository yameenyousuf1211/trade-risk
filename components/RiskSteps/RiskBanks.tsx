"use client";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";

export const RiskBanks = ({ setValue }: { setValue: any }) => {
  const [products, setProducts] = useState([]);
  const [productInput, setProductInput] = useState("");

  return (
    <div className="bg-white rounded-lg border border-borderCol py-4 px-4">
      <p className="text-lightGray font-semibold">
        Select banks you want to send your risk participation request
      </p>
      <div className="mt-3">
        <TagsInput
          value={products}
          onChange={(val: any) => {
            setProducts(val);
            // setValue("product", val.join(", "));
            setProductInput("");
          }}
          onKeyUp={(e) => {
            if (e.key.length === 1) {
              setProductInput((prev) => prev + e.key);
            }
          }}
          onBlur={(e: any) => {
            if (productInput.length > 1) {
              setProducts((prev) => [...prev, productInput]);
              e.target.value = "";
            }
            setProductInput("");
          }}
          name="product"
          placeHolder="Your Product(s)"
        />
      </div>
    </div>
  );
};
