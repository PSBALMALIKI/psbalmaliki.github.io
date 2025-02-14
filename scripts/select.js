const pendidikan = [
  { value: 'Tidak Sekolah', label: 'Tidak Sekolah' },
  { value: 'SD/MI Sederajat', label: 'SD/MI Sederajat' },
  { value: 'SMP/MTs Sederajat', label: 'SMP/MTs Sederajat' },
  { value: 'SMA/MA/SMK Sederajat', label: 'SMA/MA/SMK Sederajat' },
  { value: 'D I', label: 'D I' },
  { value: 'D II', label: 'D II' },
  { value: 'D III', label: 'D III' },
  { value: 'D IV', label: 'D IV' },
  { value: 'S2', label: 'S1' },
  { value: 'S2', label: 'S2' },
  { value: 'S3', label: 'S3' }
];

const penghasilan = [
    { value: 'Dibawah 1 juta', label: 'Dibawah 1 juta' },
    { value: '1 - 2 juta', label: '1 - 2 juta' },
    { value: '2 - 3 juta', label: '2 - 3 juta' },
    { value: '3 - 4 juta', label: '3 - 4 juta' },
    { value: '4 - 5 juta', label: '4 - 5 juta' },
    { value: 'Di atas 5 juta', label: 'Di atas 5 juta' }
  ];


function setOptions(selectId, options) {
  const selectElement = document.getElementById(selectId);
  options.forEach((option) => {
    const newOption = document.createElement('option');
    newOption.value = option.value;
    newOption.text = option.label;
    selectElement.appendChild(newOption);
  });
}

// Panggil fungsi setiap halaman selesai dibuka
document.addEventListener('DOMContentLoaded', () => {
    setOptions('PendidikanAyah', pendidikan);
    setOptions('PendidikanIbu', pendidikan);
    setOptions('PendidikanWali', pendidikan);

    setOptions('PenghasilanAyah', penghasilan);
    setOptions('PenghasilanIbu', penghasilan);
    setOptions('PenghasilanWali', penghasilan);
});




function setOpsiHide(idHide, Hide, selectId) {
  const selectElement = document.getElementById(selectId).value;
  if (selectElement != Hide) {
      hideElementById(idHide);
  } else {
      showElementById(idHide);
  }
}

document.getElementById('NIK').addEventListener('input', function() {
  if (this.value.length === 19) {
    document.getElementById('Edit').disabled = false;
    ubahText('notif1', 'Pastikan NIK sudah benar...!');
  } else if (this.value.length === 0) {
    document.getElementById('Edit').disabled = true;
    ubahText('notif1', 'Silakan isi NIK terlebih dahulu.');
  } else {
    document.getElementById('Edit').disabled = true;
    ubahText('notif1', 'NIK belum lengkap');
  }
});