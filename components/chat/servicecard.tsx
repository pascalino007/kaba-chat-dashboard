import React from "react";

interface ServiceCardProps {
  text: string;
  date: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ text, date }) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-xs md:max-w-md px-4 py-2 bg-[#CD1F45] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none shadow-md border border-red-600">
         
        <p className="text-sm">{text}</p>
        <p className="mt-1 text-[10px] text-gray-200 italic text-right">{date} <p>You</p></p>
      </div>
    </div>
  );
};

export default ServiceCard;
