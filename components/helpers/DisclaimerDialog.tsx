"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

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
    let closeBtn = document.getElementById("close-disclaimer");
    // // @ts-ignore
    closeBtn?.click();
    onAccept && onAccept();
    setProceed(true);
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
      if (
        ref.current &&
        ref.current.scrollTop + ref.current.clientHeight >=
          ref.current.scrollHeight
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
        {/* <Eye className="size-5" /> */}
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
            This export management software, designed for banks and
            corporations, facilitates the process of creating, viewing, and
            accepting bids on Letter of Credit (LC) requests. Please read and
            understand the following disclaimer before using this software:
          </p>
          <p>
            1. **Purpose and Use:** This software serves as a tool to streamline
            the management of export transactions, specifically in the context
            of Letter of Credit requests. It is intended solely for use by
            authorized personnel within financial institutions and corporate
            entities engaged in international trade.
          </p>
          <p>
            2. **Accuracy and Reliability:** While we strive to provide accurate
            and reliable information, the software&apos;s effectiveness is
            subject to accurate data entry and appropriate use. Users are
            responsible for inputting correct and up-to-date information.
          </p>
          <p>
            3. **Bid Acceptance:** The software&apos;s bid acceptance
            functionality is designed to enhance efficiency in the Letter of
            Credit request process. However, bid acceptance decisions should be
            based on thorough evaluation, in accordance with the
            organization&apos;s internal procedures and relevant regulatory
            guidelines.
          </p>
          <p>
            4. **Security and Privacy:** We have implemented security measures
            to safeguard data within the software. However, users are advised to
            ensure the confidentiality and security of their login credentials.
            Any unauthorized access or breach should be reported immediately.
          </p>
          <p>
            6. **Professional Consultation:** The software does not replace
            professional judgment, advice, or legal consultation. Users are
            encouraged to seek guidance from legal and financial experts in
            matters pertaining to export management, Letter of Credit
            transactions, and related legal obligations.
          </p>
          <p>
            7. **Modification and Termination:** We reserve the right to modify,
            update, or terminate this software at any time. Changes may include
            adjustments to features, functionalities, and security measures.
          </p>
          <p>
            By accessing and using this export management software, you
            acknowledge that you have read, understood, and agreed to this
            disclaimer. If you do not agree with any part of this disclaimer,
            please refrain from using the software.
          </p>
          <p>
            For further clarification, assistance, or support, please contact
            our designated customer service representatives.
          </p>
          <p>
            Thank you for choosing our software to enhance your export
            management capabilities.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            asperiores aut maiores velit ipsum, iste corrupti unde at alias nam,
            enim deserunt eius? Consectetur error quam non ipsam quisquam vel
            enim! Maxime facilis rerum magnam eaque voluptas culpa. Quibusdam
            voluptatum, recusandae at similique velit possimus officiis nulla
            accusamus necessitatibus dolor a harum porro aspernatur impedit
            nobis mollitia, illum soluta ab facilis explicabo quo minus! Velit
            vero ad nemo voluptatibus, quisquam cupiditate! Accusamus magni
            deserunt doloremque quasi doloribus iure dolore magnam eaque fuga
            possimus? Magni, commodi iste. Ipsam eveniet vitae aspernatur, sed
            voluptates eum recusandae ea laudantium amet vel reiciendis illo
            accusantium, nesciunt dolorum debitis pariatur odio ullam animi
            saepe? Ipsa ullam nam fugiat qui voluptate et numquam aperiam dolor
            nulla repellendus quasi omnis dolorum facilis, maiores tenetur
            ducimus hic molestiae officiis expedita ut voluptates, commodi nemo
            modi nostrum! Veniam ratione laborum fuga ab aliquid consequuntur
            dolor molestiae neque pariatur, nulla sunt odit aspernatur nisi
            fugiat delectus necessitatibus! Quidem tempora est aliquid? Ex ipsam
            itaque quae delectus error, non earum repellat! Perferendis possimus
            vel quo obcaecati quis ratione impedit aliquid unde ipsum minima
            deleniti totam labore eum nemo molestias, dolores quia tenetur
            voluptatem, minus rem deserunt natus officiis. At enim hic fuga iure
            assumenda. Necessitatibus ut dolorem maiores temporibus fuga, cumque
            harum officia iusto consequuntur deleniti ea magni expedita eveniet
            perferendis vitae placeat obcaecati illum reiciendis quasi sunt ipsa
            enim blanditiis ab laborum. Quaerat, voluptate earum maxime magnam
            possimus deserunt mollitia sit magni qui iusto suscipit quod facilis
            dicta vero nisi distinctio labore. Architecto molestias quibusdam
            quia repellat quam cumque cum vero, voluptatem illum corporis
            veritatis perspiciatis. Nemo recusandae quos dignissimos fugit
            reprehenderit alias officia consequuntur, tenetur, similique quod a
            unde sunt quis? Amet cumque nisi modi expedita, ab ipsam quod. Ut
            omnis inventore, ea et iusto pariatur sequi numquam illum tempore
            doloremque ipsam vel neque ab, expedita facilis iste enim. Tempora
            consequuntur eius dolorum praesentium temporibus nobis commodi sint
            odit officiis consequatur cupiditate unde necessitatibus neque,
            expedita quas sequi repellendus est modi aut ipsam repudiandae sunt
            odio? Animi consequatur, ex veniam rem laudantium blanditiis earum
            est deleniti porro cum neque quidem cupiditate consectetur harum
            inventore quae, hic maxime commodi, dolores ad expedita minima
            velit. Cumque quia incidunt consectetur facere explicabo qui rem aut
            aspernatur est! Delectus officia assumenda consectetur perferendis,
            laboriosam nihil eaque doloribus. Error numquam eligendi nesciunt
            architecto amet sequi voluptates vero! Nesciunt, dolorem. Nam magni
            suscipit nostrum esse autem porro cupiditate quaerat, sapiente non
            exercitationem nesciunt repellendus asperiores quos labore qui
            accusamus nulla! Nam laudantium, laborum non incidunt labore
            placeat? Cupiditate pariatur aliquid similique! Quidem odio, amet
            mollitia voluptas ullam sunt dicta tempora, magni rem quo unde eos
            hic non sapiente, dolorem eum? Fuga vero perspiciatis unde? Natus
            eius ipsa sed nam exercitationem excepturi! Dolor, necessitatibus
            optio error omnis modi architecto maiores, fugiat atque deleniti
            veritatis nulla doloremque placeat deserunt rem fugit accusantium
            culpa consequuntur quidem autem blanditiis a pariatur. Animi qui
            neque veniam quibusdam in dolorum, numquam saepe odio fugiat totam,
            impedit laudantium quaerat eius omnis eos!
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
