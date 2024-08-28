import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DisclaimerDialog = ({
  title,
  className,
  setProceed,
  onAccept,
}: {
  title: string;
  className?: string;
  setProceed?: any;
  onAccept?: () => void;
}) => {
  const handleProceed = () => {
    setProceed(true);
    let closeBtn = document.getElementById("close-disclaimer");
    closeBtn?.click();
    onAccept && onAccept();
  };
  const [disabled, setDisabled] = useState(true);
  const [state, setState] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeout(() => {
      setState(!state);
    }, 1000);
    const handleScroll = () => {
      console.log("Scrolling...");
      console.log(ref.current?.scrollHeight, "sc");
      if (
        ref.current &&
        ref.current.scrollTop + ref.current.clientHeight >= 1200
      ) {
        console.log("Reached bottom");
        setDisabled(false); // Enable the button
      } else {
        setDisabled(true); // Disable the button
      }
    };

    const dialogContent = ref.current;
    if (dialogContent) {
      dialogContent.addEventListener("scroll", handleScroll);

      // Cleanup function to remove the event listener
      return () => {
        dialogContent.removeEventListener("scroll", handleScroll);
      };
    }
  });

  return (
    <Dialog>
      <DialogTrigger className={className} id="open-disclaimer">
        {title}
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-0 !max-h-[85vh] h-full">
        <div className="flex items-center justify-between border-b border-b-borderCol px-7 !py-5 max-h-20">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <DialogClose>
            <X className="size-7" />
          </DialogClose>
        </div>

        <div
          ref={ref}
          className="px-8 flex flex-col gap-y-4 overflow-y-auto max-h-[60vh] text-[#696974] text-sm"
        >
          <p>
            Welcome to our advanced export management software, meticulously
            designed for banks and corporations to revolutionize the process of
            creating, viewing, and accepting bids on Letter of Credit (LC)
            requests. We kindly request that you thoroughly read and comprehend
            the following comprehensive disclaimer before engaging with this
            sophisticated software:
          </p>
          <p>
            1. <strong>Purpose and Utilization:</strong> This state-of-the-art
            software serves as a cutting-edge tool to optimize and streamline
            the intricate management of export transactions, with a particular
            focus on Letter of Credit requests. It is exclusively intended for
            use by authorized personnel within esteemed financial institutions
            and corporate entities actively engaged in the complex realm of
            international trade. The software aims to enhance efficiency, reduce
            errors, and facilitate smoother transactions in the global
            marketplace.
          </p>
          <p>
            2. <strong>Accuracy and Reliability:</strong> While we have invested
            substantial resources and expertise to ensure the highest standards
            of accuracy and reliability in our software, its effectiveness is
            intrinsically linked to the precision of data entry and appropriate
            utilization by end-users. It is imperative that users assume full
            responsibility for inputting correct, comprehensive, and up-to-date
            information. The software&apos;s algorithms and decision-making
            processes are only as reliable as the data they are fed, emphasizing
            the critical role of user diligence in maintaining the integrity of
            the system.
          </p>
          <p>
            3. <strong>Bid Acceptance Mechanism:</strong> The software&apos;s
            sophisticated bid acceptance functionality has been meticulously
            engineered to significantly enhance efficiency in the complex Letter
            of Credit request process. However, it is crucial to understand that
            bid acceptance decisions should not be made solely based on the
            software&apos;s recommendations. These decisions must be grounded in
            a thorough, multi-faceted evaluation, strictly adhering to the
            organization&apos;s established internal procedures, relevant
            regulatory guidelines, and industry best practices. The software
            serves as a powerful tool to inform decision-making, not to replace
            human judgment and expertise.
          </p>
          <p>
            4. <strong>Robust Security and Privacy Measures:</strong> We have
            implemented state-of-the-art security protocols and encryption
            methods to safeguard the sensitive data within the software. Our
            multi-layered security approach includes regular security audits,
            penetration testing, and compliance with international data
            protection standards. However, the effectiveness of these measures
            also relies heavily on user vigilance. Users are strongly advised to
            ensure the utmost confidentiality and security of their login
            credentials, employ strong passwords, and adhere to cybersecurity
            best practices. Any suspicious activity, unauthorized access
            attempts, or potential security breaches should be reported
            immediately to our dedicated security team for swift action and
            mitigation.
          </p>
          <p>
            5. <strong>Continuous Updates and Improvements:</strong> Our
            commitment to excellence drives us to continuously enhance and
            refine the software. Regular updates will be rolled out to improve
            functionality, address any identified issues, and introduce new
            features that align with evolving industry needs. Users are
            encouraged to stay informed about these updates and promptly install
            them to ensure they are benefiting from the latest improvements and
            security enhancements.
          </p>
          <p>
            6. <strong>Professional Consultation and Legal Compliance:</strong>{" "}
            It is paramount to understand that while this software is a powerful
            tool in export management, it does not serve as a substitute for
            professional judgment, specialized advice, or legal consultation.
            Users are strongly encouraged to seek guidance from legal experts,
            financial advisors, and industry specialists in matters pertaining
            to export management, Letter of Credit transactions, and related
            legal obligations. Compliance with international trade laws,
            sanctions, and regulatory requirements remains the responsibility of
            the user and their organization.
          </p>
          <p>
            7. <strong>Software Modification and Termination Rights:</strong> We
            reserve the unequivocal right to modify, update, or terminate this
            software at any time, without prior notice, as deemed necessary to
            maintain quality, enhance features, or comply with regulatory
            changes. Such modifications may encompass, but are not limited to,
            adjustments in features, functionalities, user interface, security
            measures, and data handling processes. Users are advised to
            regularly review the terms of use and any notifications regarding
            software changes to ensure continued compliance and optimal
            utilization.
          </p>
          <p>
            8. <strong>Data Retention and Archiving:</strong> The software
            incorporates advanced data retention and archiving capabilities to
            support audit trails and historical analysis. Users should be aware
            of and comply with their organization&apos;s data retention policies
            and relevant regulatory requirements regarding the storage and
            deletion of transaction records and related data. While the software
            provides tools for data management, ultimate responsibility for data
            governance lies with the user&apos;s organization.
          </p>
          <p>
            9. <strong>Training and Support:</strong> To maximize the benefits
            of this sophisticated software, we strongly recommend that all users
            undergo comprehensive training provided by our expert team. This
            training covers not only the technical aspects of using the software
            but also best practices in export management and Letter of Credit
            processes. Our dedicated support team is available to address
            queries, provide guidance, and resolve issues promptly, ensuring a
            smooth user experience and optimal utilization of the
            software&apos;s capabilities.
          </p>
          <p>
            10. <strong>Limitation of Liability:</strong> While we strive for
            excellence in every aspect of our software, it is important to
            acknowledge that no system is infallible. Therefore, we explicitly
            state that our liability is limited to the extent permitted by
            applicable law. We shall not be held responsible for any direct,
            indirect, incidental, consequential, or exemplary damages resulting
            from the use or inability to use the software, including but not
            limited to financial losses, data loss, or business interruption.
          </p>
          <p>
            By accessing and utilizing this advanced export management software,
            you hereby acknowledge that you have thoroughly read, fully
            understood, and unequivocally agreed to this comprehensive
            disclaimer in its entirety. If you find yourself in disagreement
            with any part of this disclaimer, we kindly request that you refrain
            from using the software and promptly contact our customer service
            department for clarification or to terminate your access.
          </p>
          <p>
            For further clarification, assistance, or support regarding any
            aspect of this software or its use, please do not hesitate to
            contact our designated customer service representatives. Our team of
            experts is committed to providing you with prompt, professional, and
            comprehensive support to ensure your experience with our software is
            both productive and satisfying.
          </p>
          <p>
            We sincerely appreciate your choice of our cutting-edge software to
            enhance and optimize your export management capabilities. Your trust
            in our product drives us to continually innovate and improve,
            ensuring that we remain at the forefront of export management
            technology. We look forward to supporting your success in the
            dynamic world of international trade.
          </p>
          <p>
            Thank you for your attention to this important information. Your
            understanding and compliance with these terms are crucial for
            maintaining the integrity, security, and effectiveness of our export
            management ecosystem. We are confident that this software will
            significantly contribute to your organization&apos;s efficiency and
            success in navigating the complexities of international trade and
            Letter of Credit transactions.
          </p>
        </div>

        <DialogClose className="hidden" id="close-disclaimer"></DialogClose>
        <Button
          className={`text-lightGray w-[95%] mx-auto bg-[#F1F1F5] hover:bg-[#F1F1F5]/90 text-lg py-7 cursor-pointer ${
            !disabled && "!bg-blue-600 text-white"
          }`}
          disabled={disabled}
          onClick={handleProceed}
        >
          Accept Terms and Conditions
        </Button>
      </DialogContent>
    </Dialog>
  );
};
