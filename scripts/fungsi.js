
function BuatJson(header, idForm) {
    // Ambil elemen form berdasarkan ID
    const form = document.getElementById(idForm);
    if (!form) {
        console.error(`Form dengan ID "${idForm}" tidak ditemukan.`);
        return null;
    }

    // Inisialisasi objek JSON
    const jsonResult = {};
    jsonResult[header] = []; // Tambahkan array untuk menyimpan data objek

    // Buat objek untuk satu set data berdasarkan input form
    const formData = {};

    // Iterasi semua elemen input dan select dalam form
    const elements = form.querySelectorAll('input, select');
    elements.forEach((el) => {
        const key = el.name; // Gunakan name sebagai header
        let value = el.value; // Ambil nilai dari input atau select

        if (key && key.startsWith("Tanggal") && value) {
            const date = new Date(value);
            if (!isNaN(date)) {
                value = date.toISOString().split("T")[0]; // Format yyyy-mm-dd
            }
        }

        if (key) {
            formData[key] = value || ""; // Jika nilai kosong, isi dengan string kosong
        }
    });

    formData.TanggalUpdate = new Date().toISOString().replace("T", " ").split(".")[0].replace("Z", "")

    formData.Hijriyah = `${jdToHijri(Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24)) + 2440587.5).year}-${jdToHijri(Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24)) + 2440587.5).month}-${jdToHijri(Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24)) + 2440587.5).day}`
    formData.Masehi = `${new Date().toISOString().split("T")[0]}`


    // Tambahkan objek hasil form ke dalam array
    jsonResult[header].push(formData);

    return jsonResult;
}

// Fungsi untuk mengonversi Julian Day ke Hijriyah
function jdToHijri(jd) {
  const jd1 = 1948440; // Julian Day untuk 1 Muharram 1 H
  const iDate = jd - jd1;
  const iYear = Math.floor(iDate / 354.367);
  const iMonth = Math.floor((iDate - (iYear * 354.367)) / 29.5306) + 1;
  const iDay = Math.floor(iDate - (iYear * 354.367) - ((iMonth - 1) * 29.5306)) + 1;

  // Mengembalikan objek dengan hari, bulan, dan tahun Hijriyah
  return {
      day: iDay,
      month: iMonth < 10 ? '0' + iMonth : iMonth, // Format bulan dua digit
      year: iYear + 1 // Tahun Hijriyah dimulai dari 1
  };
}



function hideElementById(id) {
    const element = document.getElementById(id);
    element.style.opacity = 1;
    element.style.transition = 'opacity 0.5s';
    element.style.opacity = 0;
    setTimeout(() => {
      element.style.display = 'none';
    }, 500);
  }

function showElementById(id) {
    const element = document.getElementById(id);
    if (element.style.display === 'block') {
        return;
    }
    
    element.style.display = 'block';
    element.style.opacity = 0;
    element.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        element.style.opacity = 1;
    }, 0);
}
  
  function ubahText(id, newText) {
    const element = document.getElementById(id);
    const text = element.textContent;
    if (text === newText) {
      return;
    }
    const textArray = text.split('');
    const newTextArray = newText.split('');
    const speed = 5;
  
    function hapusText() {
      if (textArray.length > 0) {
        textArray.pop();
        element.textContent = textArray.join('');
        setTimeout(hapusText, speed);
      } else {
        mengetikText();
      }
    }
  
    function mengetikText() {
      if (newTextArray.length > 0) {
        textArray.push(newTextArray.shift());
        element.textContent = textArray.join('');
        setTimeout(mengetikText, speed);
      }
    }
  
    hapusText();
  }

















async function simpanData() {
    const jsonData = BuatJson('Santri', 'formulir');
    console.log(jsonData)

    try {
        const result = await saveOrUpdateData('Santri', jsonData, 'NIK');
        console.log(result);
        ambilDataSantri();
    //document.getElementById('offcanvasBottom').classList.remove('show'); document.getElementById('offcanvasBottom').dispatchEvent(new Event('hide.bs.offcanvas'));
    } catch (error) {
        console.error(error);
    }

    try {
        const response = await sendPostWithGet(jsonData);
        console.log("Respons dari server:", response);
    } catch (error) {
        console.error("Kesalahan saat memproses data:", error);
    }
}