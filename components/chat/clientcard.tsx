import React from "react";

interface ClientCardProps {
  text: string;
  date: string;
}

const ClientCard: React.FC<ClientCardProps> = ({ text, date }) => {
  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-xs md:max-w-md px-4 py-2 bg-blue-500 text-white rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-none shadow-sm">
        <p className="text-sm">{text}</p>
        <p className="mt-1 text-[10px] text-blue-100 italic text-left">{date}</p>
      </div>
    </div>
  );
};

export default ClientCard;
