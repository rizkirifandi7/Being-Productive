class Pendaftar {
	constructor(nama, umur, uangSangu) {
		this.nama = nama;
		this.umur = umur;
		this.uangSangu = uangSangu;
	}
}

class DaftarPendaftar {
	constructor() {
		this.pendaftars = [];
	}

	async tambahPendaftar(nama, umur, uangSangu) {
		return new Promise((resolve, reject) => {
			if (nama.length < 10 || umur < 25 || uangSangu < 100000 || uangSangu > 1000000) {
				reject("Kriteria tidak memenuhi syarat");
			} else {
				this.pendaftars.push(new Pendaftar(nama, umur, uangSangu));
				resolve("Pendaftar berhasil ditambahkan");
			}
		});
	}

	async hapusPendaftar(nama) {
		return new Promise((resolve, reject) => {
			const index = this.pendaftars.findIndex((pendaftar) => pendaftar.nama === nama);
			if (index !== -1) {
				this.pendaftars.splice(index, 1);
				resolve("Pendaftar berhasil dihapus");
			} else {
				reject("Pendaftar tidak ditemukan");
			}
		});
	}

	async updatePendaftar(namaLama, namaBaru, umurBaru, uangSanguBaru) {
		return new Promise((resolve, reject) => {
			const index = this.pendaftars.findIndex((pendaftar) => pendaftar.nama === namaLama);
			if (index !== -1) {
				this.pendaftars[index] = new Pendaftar(namaBaru, umurBaru, uangSanguBaru);
				resolve("Pendaftar berhasil diperbarui");
			} else {
				reject("Pendaftar tidak ditemukan");
			}
		});
	}

	async getRataRata() {
		return new Promise((resolve) => {
			let totalUmur = 0;
			let totalUangSangu = 0;

			for (let pendaftar of this.pendaftars) {
				totalUmur += Number(pendaftar.umur);
				totalUangSangu += Number(pendaftar.uangSangu);
			}

			const rataRataUmur = totalUmur / this.pendaftars.length;
			const rataRataUangSangu = (totalUangSangu / this.pendaftars.length).toFixed(2);

			resolve(
				`Rata-rata pendaftar memiliki uang sangu sebesar ${rataRataUangSangu} dengan rata-rata umur ${rataRataUmur}`
			);
		});
	}
}

const daftarPendaftar = new DaftarPendaftar();

document.getElementById("formPendaftaran").addEventListener("submit", async (event) => {
	event.preventDefault();

	const nama = document.getElementById("nama").value;
	const umur = document.getElementById("umur").value;
	const uangSangu = document.getElementById("uangSangu").value;

	try {
		await daftarPendaftar.tambahPendaftar(nama, umur, uangSangu);

		// Update tabel dan resume setelah menambahkan pendaftar baru
		updateTabel();
		updateResume();

		alert("Pendaftar berhasil ditambahkan");
	} catch (error) {
		alert(error);
	}
});

function updateTabel() {
	const tabelPendaftar = document.getElementById("tabelPendaftar");

	// Hapus semua baris sebelumnya
	while (tabelPendaftar.firstChild) {
		tabelPendaftar.removeChild(tabelPendaftar.firstChild);
	}

	// Tambahkan baris baru untuk setiap pendaftar
	for (let pendaftar of daftarPendaftar.pendaftars) {
		const row = document.createElement("tr");

		const namaCell = document.createElement("td");
		namaCell.textContent = pendaftar.nama;

		const umurCell = document.createElement("td");
		umurCell.textContent = pendaftar.umur;

		const uangSanguCell = document.createElement("td");
		uangSanguCell.textContent = pendaftar.uangSangu;

		const hapusButton = document.createElement("button");
		hapusButton.textContent = "Hapus";
		hapusButton.addEventListener("click", async () => {
			try {
				await daftarPendaftar.hapusPendaftar(pendaftar.nama);
				updateTabel();
				updateResume();
				alert("Pendaftar berhasil dihapus");
			} catch (error) {
				alert(error);
			}
		});

		const updateButton = document.createElement("button");
		updateButton.textContent = "Update";
		updateButton.addEventListener("click", async () => {
			const namaBaru = prompt("Masukkan nama baru:");
			const umurBaru = prompt("Masukkan umur baru:");
			const uangSanguBaru = prompt("Masukkan uang sangu baru:");

			try {
				await daftarPendaftar.updatePendaftar(pendaftar.nama, namaBaru, umurBaru, uangSanguBaru);
				updateTabel();
				updateResume();
				alert("Pendaftar berhasil diperbarui");
			} catch (error) {
				alert(error);
			}
		});

		row.appendChild(namaCell);
		row.appendChild(umurCell);
		row.appendChild(uangSanguCell);
		row.appendChild(hapusButton);
		row.appendChild(updateButton);

		tabelPendaftar.appendChild(row);
	}
}

async function updateResume() {
	const resume = await daftarPendaftar.getRataRata();
	document.getElementById("resume").textContent = resume;
}

function showTab(tabId) {
	const tabs = document.getElementsByClassName("tab");

	for (let tab of tabs) {
		tab.style.display = "none";
	}

	document.getElementById(tabId).style.display = "block";
}
