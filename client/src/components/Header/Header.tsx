import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from 'src/context/LanguageContext';

// Import AI TensorFlow
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Indikator Loading AI
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage(); 

  // Variable untuk menyimpan model AI
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);

  // 1. LOAD MODEL AI SAAT WEBSITE DIBUKA (Background Process)
  useEffect(() => {
    const loadAI = async () => {
      try {
        console.log("Sedang memuat AI...");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("AI Siap Digunakan!");
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
    fileInputRef.current?.click();
  };

  // --- 2. LOGIKA AI VISION (REAL AI) ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // Cek apakah model AI sudah siap
    if (!model) {
        alert("AI sedang dipersiapkan, coba 5 detik lagi...");
        return;
    }

    if (file) {
      setIsAnalyzing(true); // Tampilkan loading
      setKeyword("Menganalisa gambar..."); // Feedback ke user

      const reader = new FileReader();
      reader.onload = async (e) => {
        // Buat elemen gambar HTML sementara di memori
        const imgElement = document.createElement('img');
        imgElement.src = e.target?.result as string;
        
        imgElement.onload = async () => {
          try {
            // AJAIB: AI MENEBAK GAMBAR
            const predictions = await model.classify(imgElement);
            
            if (predictions && predictions.length > 0) {
                // Ambil tebakan paling yakin (urutan pertama)
                // Contoh hasil: "running shoe" atau "backpack"
                const bestGuess = predictions[0].className;
                
                // Hapus koma jika ada (kadang AI jawab: "sandal, flip-flop")
                let cleanKeyword = bestGuess.split(',')[0];

                console.log("AI Menebak:", cleanKeyword);
                
                // Masukkan ke kolom search
                setKeyword(cleanKeyword);
                
                // Langsung cari!
                navigate(`/search?name=${encodeURIComponent(cleanKeyword)}`);
            } else {
                alert("AI bingung, coba gambar lain yang lebih jelas.");
                setKeyword("");
            }
          } catch (err) {
            console.error(err);
            alert("Gagal menganalisa gambar.");
          } finally {
            setIsAnalyzing(false);
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
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />

            <input 
              type="text" 
              placeholder={isAnalyzing ? "🤖 AI sedang melihat..." : t.placeholder}
              className={`w-full border rounded-md py-2.5 px-4 pr-32 text-sm focus:outline-none transition-all bg-gray-50 focus:bg-white
                ${isAnalyzing ? 'border-blue-500 animate-pulse' : 'border-gray-300 focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d]'}
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

                {/* Ikon Kamera (Dengan Loading Spinner saat Analisa) */}
                <button 
                  type="button" 
                  onClick={handleCameraClick}
                  className="text-gray-400 hover:text-[#ee4d2d] p-2 hover:bg-orange-50 rounded-full transition mr-1"
                  title="Cari dengan Gambar"
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

        {/* MENU KANAN (HIDDEN ID | EN) */}
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