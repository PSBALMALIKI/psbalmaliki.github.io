
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

    // Tambahkan objek hasil form ke dalam array
    jsonResult[header].push(formData);

    return jsonResult;
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