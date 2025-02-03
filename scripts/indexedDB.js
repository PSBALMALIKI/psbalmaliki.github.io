async function saveOrUpdateData(storeName, jsonData, primaryKey = 'NIK') {
    const dbName = 'db'; // Nama database tetap 'Santri'
    const version = 1;

    // Pastikan data sesuai dengan storeName
    if (!jsonData[storeName]) {
        console.error(`Property '${storeName}' tidak ditemukan dalam jsonData.`);
        return;
    }

    if (!Array.isArray(jsonData[storeName])) {
        console.warn(`Property '${storeName}' is not an array. Converting to array.`);
        jsonData[storeName] = [jsonData[storeName]];
    }

    // Membuka database
    const request = indexedDB.open(dbName, version);
    let db;

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: primaryKey });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        jsonData[storeName].forEach(item => {
            if (!item[primaryKey]) {
                console.error(`Missing '${primaryKey}' property in item:`, item);
                return;
            }

            const request = store.get(item[primaryKey]);

            request.onsuccess = function(event) {
                const existingData = event.target.result;

                if (existingData) {
                    store.put({ ...existingData, ...item });
                } else {
                    store.add(item);
                }
            };

            request.onerror = function(event) {
                console.error('Error checking data:', event.target.error);
            };
        });

        transaction.oncomplete = function() {
            console.log('Data saved or updated successfully');
            db.close();
        };

        transaction.onerror = function(event) {
            console.error('Error saving or updating data');
            db.close();
        };
    };

    request.onerror = function(event) {
        console.error('Error opening database:', event.target.error);
    };
}

function ambilDataSantri() {
    let dbRequest = indexedDB.open("db"); // Tidak menentukan versi agar selalu mendapatkan versi terbaru
    
    dbRequest.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction("Santri", "readonly");
        let store = transaction.objectStore("Santri");
        let request = store.getAll();
        
        request.onsuccess = function() {
            let data = request.result;
            buatTabelSantri(data);
        };
    };
    
    dbRequest.onerror = function() {
        console.error("Gagal membuka database");
    };
}

async function ambilDataSantri() {
    let dbRequest = indexedDB.open("db"); // Tidak menentukan versi agar selalu mendapatkan versi terbaru
    
    dbRequest.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction("Santri", "readonly");
        let store = transaction.objectStore("Santri");
        let request = store.getAll();
        
        request.onsuccess = function() {
            let data = request.result;
            buatTabelSantri(data);
        };
    };
    
    dbRequest.onerror = function() {
        console.error("Gagal membuka database");
    };
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

// Panggil fungsi untuk mengambil dan menampilkan data
ambilDataSantri();

