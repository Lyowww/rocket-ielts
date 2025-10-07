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
}
const GlobalModal: React.FC<GlobalModalProps> = ({ open, onOpenChange, children, title, actionButton,isNeedBtn }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent className="!w-[50vw]  !max-w-[50vw] max-h-[80vh] overflow-y-auto border-b border-b-[#E0E0E0] ">
    {isNeedBtn ? <button
      aria-label="Close"
      onClick={() => onOpenChange(false)}
      className="absolute top-2 right-2 mt-2 mr-2 mb-2 focus:outline-none"
      style={{ zIndex: 10, cursor: 'pointer' }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" fill="#555" />
        <path d="M10 10L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 10L10 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button> : ''}
        {title ? (
          <AlertDialogTitle>{title}</AlertDialogTitle>
        ) : (
          <AlertDialogTitle>
            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
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