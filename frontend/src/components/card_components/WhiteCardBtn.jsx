import React from 'react';

function WhiteCardBtn({ text, disabled, onClick , viewOnly}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-[200px] h-[275px] rounded-lg shadow-sm border transition-all
        bg-white text-black font-bold text-md text-left
        ${(disabled && !viewOnly)? "border-[#804385] border-4 cursor-not-allowed" : "border-white hover:scale-[1.02] hover:shadow-md"}
      `}
    >
      <div className="p-3 pb-[150px]">
        {text || "None"}
      </div>
    </button>
  );
}

export default WhiteCardBtn;
