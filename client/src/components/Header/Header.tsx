import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from 'src/context/LanguageContext';

// Import AI TensorFlow
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage(); 

  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

  // 1. LOAD AI (DENGAN LOG YANG JELAS)
  useEffect(() => {
    const loadAI = async () => {
      try {
        // console.log("Sedang memuat AI...");
        // Menggunakan versi 'quantized' agar lebih ringan di HP
        const loadedModel = await mobilenet.load({ version: 2, alpha: 0.50 });
        setModel(loadedModel);
        // console.log("AI Siap!");
      } catch (error) {
        console.error("Gagal memuat AI:", error);
      }
    };
    loadAI();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?name=${encodeURIComponent(keyword)}`);
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  const handleCameraClick = () => {
    // Cek kesiapan AI dulu
    if (!model) {
        alert("Sabar sebentar, sedang menyiapkan kecerdasan buatan...");
        return;
    }
    fileInputRef.current?.click();
  };

  // --- 2. LOGIKA AI VISION (VERSI RINGAN KHUSUS HP) ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setIsAnalyzing(true);
      setKeyword("Menganalisa..."); 

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.src = e.target?.result as string;
        
        // PENTING: Tunggu gambar loading, lalu resize paksa agar HP tidak berat
        imgElement.onload = async () => {
          try {
            // Kita paksa ukurannya jadi kecil (224px) standar MobileNet
            // agar memori HP tidak meledak
            imgElement.width = 224;
            imgElement.height = 224;

            // Proses AI
            if (model) {
                const predictions = await model.classify(imgElement);
                
                if (predictions && predictions.length > 0) {
                    // Ambil tebakan pertama
                    const bestGuess = predictions[0].className;
                    // Bersihkan kata (ambil kata pertama sebelum koma)
                    let cleanKeyword = bestGuess.split(',')[0];
                    
                    // Translate manual sederhana (karena AI outputnya Inggris)
                    // (Opsional: bisa dihapus kalau mau Inggris aja)
                    if(cleanKeyword.includes("shoe")) cleanKeyword = "sepatu";
                    if(cleanKeyword.includes("shirt")) cleanKeyword = "baju";
                    if(cleanKeyword.includes("bag")) cleanKeyword = "tas";
                    if(cleanKeyword.includes("phone")) cleanKeyword = "hp";

                    setKeyword(cleanKeyword);
                    navigate(`/search?name=${encodeURIComponent(cleanKeyword)}`);
                } else {
                    alert("AI tidak mengenali objek. Coba foto lebih jelas.");
                    setKeyword("");
                }
            }
          } catch (err) {
            console.error(err);
            alert("Gagal analisa. Gunakan foto yang lebih kecil/jelas.");
            setKeyword("");
          } finally {
            setIsAnalyzing(false);
            // Reset input agar bisa foto ulang
            if(fileInputRef.current) fileInputRef.current.value = "";
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto max-w-[1920px] px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group cursor-pointer">
           <div className="text-[#ee4d2d]">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9">
               <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
             </svg>
           </div>
           <div className="text-2xl md:text-3xl font-bold tracking-tight hidden md:block">
             <span className="text-gray-900">Shox</span>
             <span className="text-[#ee4d2d]">ped</span>
           </div>
        </Link>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative mx-4">
            {/* UPDATE INPUT FILE KHUSUS HP:
               1. accept="image/*" : Biar galeri gambar aja yg muncul
               2. capture="environment" : Biar default buka Kamera Belakang (di beberapa HP)
            */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />

            <input 
              type="text" 
              placeholder={isAnalyzing ? "Menganalisa foto..." : t.placeholder}
              className={`w-full border rounded-md py-2.5 px-4 pr-32 text-sm focus:outline-none transition-all bg-gray-50 focus:bg-white
                ${isAnalyzing ? 'border-[#ee4d2d] animate-pulse bg-orange-50' : 'border-gray-300 focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d]'}
              `}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isAnalyzing}
            />

            <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                
                {/* Tombol X */}
                {keyword && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition mr-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Ikon Kamera (Loading State) */}
                <button 
                  type="button" 
                  onClick={handleCameraClick}
                  className="text-gray-400 hover:text-[#ee4d2d] p-2 hover:bg-orange-50 rounded-full transition mr-1"
                  title="Foto Barang"
                  disabled={isAnalyzing}
                >
                   {isAnalyzing ? (
                     <svg className="animate-spin h-5 w-5 text-[#ee4d2d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                   )}
                </button>

                <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

                {/* Tombol Search */}
                <button type="submit" className="bg-[#ee4d2d] text-white px-5 py-2 rounded-md hover:bg-orange-600 transition flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </button>
            </div>
        </form>

        {/* MENU KANAN (HIDDEN) */}
        <div className="flex items-center gap-4 text-gray-600 flex-shrink-0">
            <div className="hidden gap-1 text-sm font-bold">
                <button onClick={() => setLanguage('id')} className="text-gray-400">ID</button>
                <button onClick={() => setLanguage('en')} className="text-gray-400">EN</button>
            </div>
        </div>

      </div>
    </header>
  );
}