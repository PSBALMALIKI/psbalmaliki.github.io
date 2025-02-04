async function saveOrUpdateData(storeName, jsonData, primaryKey = 'NIK') {
    const dbName = 'db';
    let db;
    
    // Pastikan data sesuai dengan storeName
    if (!jsonData[storeName]) {
        console.error(`Property '${storeName}' tidak ditemukan dalam jsonData.`);
        return;
    }

    if (!Array.isArray(jsonData[storeName])) {
        console.warn(`Property '${storeName}' is not an array. Converting to array.`);
        jsonData[storeName] = [jsonData[storeName]];
    }

    try {
        db = await openOrUpgradeDatabase(dbName, storeName, primaryKey);
        await saveDataToStore(db, storeName, jsonData[storeName], primaryKey);
        db.close();
    } catch (error) {
        console.error('Database operation failed:', error);
    }
}

async function openOrUpgradeDatabase(dbName, storeName, primaryKey) {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(dbName);

        request.onsuccess = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.close();
                // Upgrade database jika store belum ada
                const newVersion = db.version + 1;
                request = indexedDB.open(dbName, newVersion);
                
                request.onupgradeneeded = function (event) {
                    db = event.target.result;
                    db.createObjectStore(storeName, { keyPath: primaryKey });
                };

                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            } else {
                resolve(db);
            }
        };

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: primaryKey });
            }
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

function saveDataToStore(db, storeName, dataArray, primaryKey) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        let pendingOperations = dataArray.length;

        if (pendingOperations === 0) {
            resolve();
            return;
        }

        dataArray.forEach(item => {
            if (!item[primaryKey]) {
                console.error(`Missing '${primaryKey}' property in item:`, item);
                pendingOperations--;
                if (pendingOperations === 0) resolve();
                return;
            }

            const request = store.get(item[primaryKey]);

            request.onsuccess = function (event) {
                const existingData = event.target.result;
                const saveRequest = existingData ? store.put({ ...existingData, ...item }) : store.add(item);

                saveRequest.onsuccess = function () {
                    pendingOperations--;
                    if (pendingOperations === 0) resolve();
                };

                saveRequest.onerror = function (event) {
                    console.error('Error saving data:', event.target.error);
                    pendingOperations--;
                    if (pendingOperations === 0) reject(event.target.error);
                };
            };

            request.onerror = function (event) {
                console.error('Error checking data:', event.target.error);
                pendingOperations--;
                if (pendingOperations === 0) reject(event.target.error);
            };
        });

        transaction.onerror = function (event) {
            reject(event.target.error);
        };
    });
}



async function ambilDataSantri() {
    const dbName = 'db';
    const storeName = 'Santri';

    try {
        const db = await openIndexedDB(dbName);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        if (!db.objectStoreNames.contains(storeName)) {
            console.log('Store Santri tidak ditemukan');
            return;
        }

        const request = store.getAll();

        request.onsuccess = function() {
            const data = request.result;
            buatTabelSantri(data);
        };

        request.onerror = function() {
            console.error("Gagal membuka database");
        };
    } catch (error) {
        console.error('Database operation failed:', error);
    }
}

function buatTabelSantri(data) {
    let tempatTabel = document.getElementById("tempatTabel");
    tempatTabel.innerHTML = ""; // Hapus tabel sebelumnya jika ada
    
    let table = document.createElement("table");
    table.id = "santriTable";
    table.className = "table table-bordered table-striped table-sm";
    
    let thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Formal</th>
        </tr>
    `;
    
    let tbody = document.createElement("tbody");
    data.forEach((santri, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${santri.Nama}</td>
            <td>${santri.Formal}</td>
        `;
        tbody.appendChild(tr);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    tempatTabel.appendChild(table);
    
    $('#santriTable').DataTable({
        "paging": true,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "info": true,
        "ordering": true,
        "searching": true,
        "language": {
            "lengthMenu": "Tampilkan _MENU_ data per halaman",
            "zeroRecords": "Tidak ada data yang ditemukan",
            "info": "Menampilkan _START_ hingga _END_ dari _TOTAL_ data",
            "infoEmpty": "Tidak ada data tersedia",
            "infoFiltered": "(disaring dari _MAX_ total data)"
        }
    });
}


document.getElementById('NIK').addEventListener('input', function() {
    const nikInput = this.value.trim();
    selectUserByNIK(nikInput);
});


function getDataByNIK(db, storeName, nik) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.openCursor(); // Gunakan cursor untuk mencari NIK

        request.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.NIK === nik) {
                    resolve(cursor.value); // Data ditemukan
                    return;
                }
                cursor.continue(); // Lanjut ke data berikutnya
            } else {
                resolve(null); // Data tidak ditemukan
            }
        };

        request.onerror = () => reject(request.error);
    });
}


async function selectUserByNIK(nik) {
    if (!nik) {
        console.log("NIK tidak ditemukan");
        return;
    }
  
    //console.log("Mencari NIK: ", nik);

    const dbName = 'db';  // Sesuaikan dengan nama database IndexedDB
    const storeName = 'Santri'; // Sesuaikan dengan store tempat data Santri disimpan
    
    const editBtn = document.getElementById('Edit');
    editBtn.innerHTML = 'Isi Formulir <i class="fas fa-pen"></i>';
    
    try {
        const db = await openIndexedDB(dbName);
        const userData = await getDataByNIK(db, storeName, nik);
  
        if (!userData) {
            //console.warn("⚠️ Data pengguna tidak ditemukan untuk NIK:", nik);
            return;
        }

        console.log("✅ Data ditemukan:", userData);

        document.querySelectorAll('#isiFormulir input, #isiFormulir select').forEach(input => {
            input.value = userData[input.name] || ' ';
        });

        
        editBtn.innerHTML = 'Edit Formulir <i class="fas fa-pen"></i>';

    } catch (error) {
        console.error("❌ Terjadi kesalahan:", error);
        
    }
}



function openIndexedDB(dbName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
  
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = () => reject(request.error);
    });
  }
  
  function getDataFromStore(db, storeName, key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
  }
    