import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";
import Image from "next/image";

const Separator = () => {
  return (
    <BreadcrumbSeparator>
      <Image
        src="/images/arrow.png"
        alt="arr"
        width={8}
        height={8}
        className=""
      />
    </BreadcrumbSeparator>
  );
};

export const BreadcrumbDetails = () => {
  const crumbs = [
    "Transaction as",
    "Amount",
    "LC Details",
    "Importer Info",
    "Exporter Info",
    "Confirmation Charges",
    "Attachments",
  ];

  return (
    <div className="flex items-center justify-between gap-x-2">
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, idx) => (
            <>
              <BreadcrumbItem key={`${crumb}-${idx}`}>
                <BreadcrumbList>{crumb}</BreadcrumbList>
              </BreadcrumbItem>
              {idx !== crumbs.length - 1 && <Separator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Button className="bg-transparent text-para hover:bg-para hover:text-white rounded-lg py-1 border border-para">
        Drafts (3)
      </Button>
    </div>
  );
};
