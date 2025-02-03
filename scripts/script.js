let isEditMode = false;

function toggleEditMode() {
    isEditMode = !isEditMode;
    const inputs = document.querySelectorAll('.profile-content input');
    const selects = document.querySelectorAll('.profile-content select');
    const editBtn = document.getElementById('Edit');
    //const savetBtn = document.getElementById('Simpan');

    //document.querySelectorAll('.gelar').forEach(gelar => gelar.style.display = 'block');

    inputs.forEach(input => {
        input.disabled = !isEditMode;
    });

    selects.forEach(select => {
      select.disabled = !isEditMode;
    });

    document.getElementById('NIK').disabled = true
    hideElementById('notif1')
    showElementById('isiFormulir')

    editBtn.innerHTML = isEditMode ? 'Simpan <i class="fas fa-save"></i>' : 'Edit Formulir <i class="fas fa-pen"></i>';
    //savetBtn.innerHTML = isEditMode ? 'Simpan <i class="fas fa-save"></i>' : 'Edit <i class="fas fa-pen"></i>';

    if (isEditMode) {
      editBtn.addEventListener('click', function() {
        simpanData();
      });
    }
}

function toggleKirim() {
  isEditMode = !isEditMode;
  const inputs = document.querySelectorAll('.profile-content input');
  const selects = document.querySelectorAll('.profile-content select');
  const editBtn = document.getElementById('Simpan');

  document.querySelectorAll('.gelar').forEach(gelar => gelar.style.display = 'block');

  inputs.forEach(input => {
      input.disabled = !isEditMode;
  });

  selects.forEach(select => {
    select.disabled = !isEditMode;
  });

  document.getElementById('NIK').disabled = true
  hideElementById('notif1')
  showElementById('isiFormulir')

  editBtn.innerHTML = isEditMode ? 'Simpan <i class="fas fa-save"></i>' : 'Edit Formulir <i class="fas fa-pen"></i>';

  if (isEditMode) {
    editBtn.addEventListener('click', function() {
      simpanData();
    });
  }
}


var modeSwitch = document.querySelector('.mode-switch');
modeSwitch.addEventListener('click', function () {
  document.documentElement.classList.toggle('light');
  modeSwitch.classList.toggle('active');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
});

window.addEventListener('load', function() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.documentElement.classList.add(storedTheme);
    modeSwitch.classList.toggle('active', storedTheme === 'light');
  }
});



