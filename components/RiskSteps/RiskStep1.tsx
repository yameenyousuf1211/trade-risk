"use client";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";

export const RiskStep1 = ({ setValue }: { setValue: any }) => {
  const [products, setProducts] = useState([]);
  const [productInput, setProductInput] = useState("");

  return (
    <div className="bg-white rounded-lg border-borderCol py-4 px-4">
      <p className="text-lightGray font-semibold">
        Select banks you want to send your risk participation request
      </p>
      <div>
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
