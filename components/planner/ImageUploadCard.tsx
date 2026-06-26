"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploadCard() {
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanned(false);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full flex flex-col items-center gap-2.5 px-4 py-4 hover:bg-[#FAFBFC] transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] group-hover:bg-[#EEF2FF] flex items-center justify-center transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="#6B7280" strokeWidth="1.4"/>
                <circle cx="5.5" cy="6.5" r="1.25" stroke="#6B7280" strokeWidth="1.2"/>
                <path d="M2 10L5.5 7.5L7.5 9.5L10 7L14 10" stroke="#6B7280" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-[#374151]">Upload Image</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Timetables, notes, whiteboards</p>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="relative overflow-hidden" style={{ maxHeight: "140px" }}>
              <img
                src={preview}
                alt="Uploaded"
                className="w-full object-cover"
                style={{ maxHeight: "140px" }}
              />

              {/* Scanning animation overlay */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#4F46E5]/10 flex flex-col items-center justify-center gap-2"
                  >
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-[#4F46E5]/60"
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="flex flex-col items-center gap-1.5 z-10 bg-white/90 px-3 py-2 rounded-xl shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M6.5 1.5V3.5M6.5 9.5V11.5M11.5 6.5H9.5M3.5 6.5H1.5" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </motion.span>
                        <span className="text-[11px] font-semibold text-[#4F46E5]">Analyzing image...</span>
                      </div>
                      <span className="text-[10px] text-[#6B7280]">Google Vision API (soon)</span>
                    </div>
                  </motion.div>
                )}
                {scanned && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#10B981]/10 flex items-center justify-center"
                  >
                    <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl shadow-sm">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5" fill="#10B981"/>
                        <path d="M4 6.5L5.8 8.3L9 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[11px] font-semibold text-[#059669]">Content extracted</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => { setPreview(null); setScanned(false); setScanning(false); }}
              className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-20"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
