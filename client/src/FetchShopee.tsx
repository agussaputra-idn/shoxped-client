import React, { useEffect, useState } from "react";
import axios from "axios";

function FetchShopee() {
  // 1. INI VARIABEL STATE-NYA
  const [produk, setProduk] = useState([]); // Produk akan tersimpan di sini
  const [loading, setLoading] = useState(true); // Untuk status loading

  // 2. INI FETCH DATA API-NYA
  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://shopee-e-commerce-data.p.//shopee/item/ratings?itemid=1234&shopid=5678",
      headers: {
        "x-rapidapi-host": "shopee-e-commerce-data.p.//",
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY
      }
    };

    axios.request(options)
      .then(response => {
        setProduk(response.data.data || []); // 3. DATA DISIMPAN DI produk
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        alert("Gagal ambil data produk!");
        console.error(error);
      });
  }, []);

  // 4. INI TAMPILAN UI-NYA
  return (
    <div>
      <h2>Daftar Produk Shopee</h2>
      {loading ? (
        <p>Loading produk...</p>
      ) : (
        <ul>
          {produk.length > 0 ? (
            produk.map((item, idx) => (
              <li key={idx}>{item.itemid} - {item.comment || "Tidak ada deskripsi"}</li>
            ))
          ) : (
            <li>Tidak ada produk ditemukan.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default FetchShopee;
