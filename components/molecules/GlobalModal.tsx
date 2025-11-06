import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/atom/alert-dialog";

interface GlobalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
  isNeedBtn?: boolean; 
  className?: string;
}
const GlobalModal: React.FC<GlobalModalProps> = ({ open, onOpenChange, children, title, actionButton,isNeedBtn, className }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent overlayClassName="!bg-[#3F3B3B33] backdrop-blur" className={`!w-[50vw]  !max-w-[50vw] max-h-[80vh] overflow-y-auto border-b border-b-[#E0E0E0] scrollbar-23085A ${className}`}>
    {isNeedBtn ? <button
      aria-label="Close"
      onClick={() => onOpenChange(false)}
      className="absolute top-4 right-4 rounded-full bg-[#23085A] p-2 text-white"
      style={{ zIndex: 10, cursor: 'pointer' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M6 6L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button> : ''}
        {title ? (
          <AlertDialogTitle>{title}</AlertDialogTitle>
        ) : (
          <AlertDialogTitle>
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden,', clip: 'rect(0,0,0,0)', border: 0 }}>
              Modal
            </span>
          </AlertDialogTitle>
        )}
        {children}
        {actionButton && (
          <div className="mt-6 w-full flex justify-center">{actionButton}</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalModal; 