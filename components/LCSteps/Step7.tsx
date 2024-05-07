import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatFileSize } from "@/utils";
import { filter } from "d3-array";

const FileCard = ({file,onRemoveFile}:{file:FileList,onRemoveFile:(name:string) => void}) => {
  return (
    <div className="flex items-center justify-between gap-x-2 border border-borderCol p-2 rounded-lg">
      <div className="flex items-center gap-x-2 w-full">
        <Button type="button" className="bg-red-200 p-1 hover:bg-red-300">
          <Image
            src="/images/pdf.png"
            alt="pdf"
            width={500}
            height={500}
            className="size-8"
          />
        </Button>
        <div>
          <p className="text-lightGray">{file[0]?.name}</p>
          <p className="text-[12px] text-para">{file[0]?.type.split('/')[1].toUpperCase()}, {formatFileSize(file[0]?.size)}</p>
        </div>
      </div>

      <Button variant="ghost" onClick={() => onRemoveFile(file[0]?.name)}>
        <X className="text-lightGray" />
      </Button>
    </div>
  );
};

export const Step7 = ({ register,step }: {register:any, step: number }) => {

  const [selectedFiles, setSelectedFiles] = useState<FileList[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        return !selectedFiles?.some(fileList => Array.from(fileList).some(f => f.name === file.name));
      });
      setSelectedFiles(prevFiles => [...(prevFiles ?? []), newFiles]);
    }
  };
  
  const handleRemoveFile = (name:string) => {
    const filterFiles = selectedFiles?.filter(file => file[0]?.name !== name)
    setSelectedFiles(filterFiles as FileList[])
  } 

  useEffect(() => {
    if (selectedFiles) {
      selectedFiles.forEach((fileList, index) => {
        Array.from(fileList).forEach((file, subIndex) => {
          // register(`attachments[${index}][${subIndex}]`); 
        });
      });
    }
  }, [selectedFiles, register]);

  return (
    <div className="w-full border border-borderCol rounded-lg py-3 px-4 h-full">
      <div className="flex items-center gap-x-2 ml-3 mb-3">
        <p className="size-6 rounded-full bg-primaryCol center text-white font-semibold">
          {step}
        </p>
        <p className="font-semibold text-lg text-lightGray">Attachments</p>
      </div>

      <p className="font-semibold">Add Documents (PDF,JPG,PNG,TIFF)</p>
      <label
        htmlFor="attachment-input"
        className="flex flex-col justify-center items-center border-4 border-borderCol border-dotted py-4 rounded-md mt-2"
      >
        <input
          id="attachment-input"
          type="file"
          onChange={handleFileChange}
          multiple 
          style={{ display: 'none' }} 
        />
        <Image src="/images/attachment.png" alt="att" width={25} height={25} />
        <p className="text-lg font-semibold text-lightGray mt-4">
          Drag your files here
        </p>
        <p className="text-lightGray">or click to select from your device</p>
      </label>

      {/* Display selected files */}
      {selectedFiles && (
        <div className="flex flex-col gap-y-3 mt-5">
          {Array.from(selectedFiles).map((fileList, index) => (
            <FileCard key={fileList[0].name} file={fileList} onRemoveFile={handleRemoveFile} />
          ))}
        </div>
      )}
    </div>
  );
};
