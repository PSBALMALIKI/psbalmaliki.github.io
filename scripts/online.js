const url = 'https://script.google.com/macros/s/AKfycbyXwjZqGaVi76x2SySndmRAfpMH9ARl82uiLFqcx0gWINPl-hF1LzajQZilejzKiLhP/exec'

// -------------------Post Data-------------------
/**
 * Fungsi untuk encode data ke URL-encoded format.
 * @param {Object} data - Data yang akan di-encode.
 * @returns {string} - Data dalam format URL-encoded.
 */
function encodeData(data) {
    return Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join("&");
  }


/**
 * Mengirim data JSON menggunakan metode GET.
 * @param {Object} jsonData - Data JSON yang akan dikirim.
 * @returns {Promise<Object>} Respons JSON dari server.
 */
async function sendPostWithGet(jsonData) {

    if (jsonData.Santri && jsonData.Santri[0] && jsonData.Santri[0].NIK) {
      localStorage.setItem(jsonData.Santri[0].NIK, JSON.stringify(jsonData));
    }

    updateBadgeCount();
  
    try {
        // Cek koneksi internet
        if (!navigator.onLine) {
            throw new Error("Tidak ada koneksi internet.");
        }
  
        const encodedData = encodeData({
            action: "Post",
            json: JSON.stringify(jsonData)
        });
  
        const response = await fetch(`${url}?${encodedData}`, {
            method: "GET"
        });
  
        if (!response.ok) {
            throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);
        }
  
        const data = await response.json();
        
        if (jsonData.Santri && jsonData.Santri[0] && jsonData.Santri[0].NIK) {
            localStorage.removeItem(jsonData.Santri[0].NIK);
        }
  
        updateBadgeCount();
        updateModalContent();
  
        return data;
    } catch (error) {
        console.error("Kesalahan saat mengirim data:", error);
        throw error;
    }
  }
  
  function updateBadgeCount() {
    let count = 0;
    
    // Loop melalui semua item di localStorage
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        
        // Lewati key yang bernama 'IDS'
        if (key !== 'IDS') {
            count++;
        }
    }
    
    // Update angka dalam badge
    const badge = document.querySelector(".app-content-headerButton .badge");
    if (badge) {
        badge.textContent = count;
    }
  }
  
  // Panggil fungsi saat halaman dimuat
  document.addEventListener("DOMContentLoaded", updateBadgeCount);
  
  function updateBadgeCount() {
    let count = 0;
    
    // Loop melalui semua item di localStorage
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
        
      if (!isNaN(key) && key !== 'IDS') {
          count++;
      }
    }
    
    // Update angka dalam badge
    const badge = document.querySelector(".app-content-headerButton .badge");
    const simpan = document.getElementById('SimpanSemuaLocal')
  
    if (badge) {
      badge.textContent = count;
      if (simpan) {
        simpan.disabled = count === 0;
      }
    }
  }
  
  
  // Panggil fungsi saat halaman dimuat
  document.addEventListener("DOMContentLoaded", updateBadgeCount);
  
  function updateModalContent() {
    const modalBody = document.querySelector("#ModalNotifikasi .modal-body");
    if (!modalBody) return;
  
    let list = document.createElement("ul");
    list.classList.add("list-group");
    
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      
      // Lewati key yang bernama 'IDS'
      if (!isNaN(key)) {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.style.width = "auto";
        listItem.textContent = `${key}`;
        list.appendChild(listItem);
      }
    }
    
    modalBody.innerHTML = ""; // Hapus konten lama
    if (list.children.length === 0) {
      const paragraph = document.createElement("p");
      paragraph.textContent = "Proses simpan akan tampil di sini.";
      paragraph.style.fontSize = "small";
      modalBody.appendChild(paragraph);
    } else {
      modalBody.appendChild(list);
    }
  }
  
  // Tambahkan event listener agar fungsi dipanggil saat modal dibuka
  document.querySelector("#ModalNotifikasi").addEventListener("show.bs.modal", updateModalContent);
  
  
  
  async function simpanSemua() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!isNaN(key)) {
          const jsonData = JSON.parse(localStorage.getItem(key));
          await sendPostWithGet(jsonData);
        }
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  }
























  //-------------------------------------- Get Data --------------------------------

  async function GetData(url, json) {
    try {
      // Tambahkan parameter ke URL
      const fullUrl = `${url}?action=Data&filters=${encodeURIComponent(JSON.stringify(json))}`;
  
      // Ambil data dari URL
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
}

async function DownloadData() {
  await ambilDataSantri();
  
  console.log("Memulai proses download data...");
  
  const LoadingDownload = document.getElementById('Loading');

  // Pastikan elemen indikator loading ada sebelum mengaksesnya
  if (LoadingDownload) {
      LoadingDownload.style.display = 'block';
  }

  try {
      console.log("Menghapus data lama dari IndexedDB...");
      await clearIndexedDBStore("Santri");
      console.log("Data lama berhasil dihapus.");

      const filters = { Santri: {} }; // Kriteria filter

      console.log("Mengambil data dari server...");
      const data = await GetData(url, filters);
      console.log("Data diterima:", data);

      if (!data || !data.Santri || data.Santri.length === 0) {
          throw new Error("Data kosong atau tidak sesuai format.");
      }

      console.log("Menyimpan data ke IndexedDB...");
      await saveOrUpdateData("Santri", data, "NIK");
      console.log("Data berhasil disimpan.");

      console.log("Mengambil ulang data untuk ditampilkan...");
      ambilDataSantri();
      
  } catch (error) {
      console.error("Terjadi kesalahan:", error);
  } finally {
      // Sembunyikan indikator loading setelah proses selesai
      if (LoadingDownload) {
          LoadingDownload.style.display = 'none';
      }
  }
}


document.addEventListener("DOMContentLoaded", DownloadData);

async function clearIndexedDBStore(storeName) {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open("db"); // Gunakan versi terbaru yang ada

      request.onsuccess = function(event) {
          const db = event.target.result;

          if (!db.objectStoreNames.contains(storeName)) {
              console.warn(`Store '${storeName}' tidak ditemukan, tidak ada yang perlu dihapus.`);
              db.close();
              return resolve(`Store '${storeName}' tidak ditemukan.`);
          }

          const transaction = db.transaction(storeName, "readwrite");
          const objectStore = transaction.objectStore(storeName);
          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = function() {
              console.log(`Data dalam store '${storeName}' berhasil dikosongkan.`);
              db.close();
              resolve(`Store '${storeName}' berhasil dikosongkan.`);
          };

          clearRequest.onerror = function(event) {
              console.error(`Gagal mengosongkan store '${storeName}':`, event.target.error);
              db.close();
              reject(`Gagal mengosongkan store '${storeName}': ${event.target.error}`);
          };
      };

      request.onerror = function(event) {
          console.error("Gagal membuka database:", event.target.error);
          reject(`Gagal membuka database: ${event.target.error}`);
      };
  });
}
