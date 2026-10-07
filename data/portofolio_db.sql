/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-13.0.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: portofolio_db
-- ------------------------------------------------------
-- Server version	13.0.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `inbox_messages`
--

DROP TABLE IF EXISTS `inbox_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `inbox_messages` (
  `id` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` varchar(100) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inbox_messages`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `inbox_messages` WRITE;
/*!40000 ALTER TABLE `inbox_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `inbox_messages` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `portfolio_data`
--

DROP TABLE IF EXISTS `portfolio_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_data` (
  `id` varchar(50) NOT NULL,
  `data_json` longtext NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_data`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `portfolio_data` WRITE;
/*!40000 ALTER TABLE `portfolio_data` DISABLE KEYS */;
INSERT INTO `portfolio_data` VALUES
('main','{\"hero\":{\"badge\":\"FULL-STACK SOFTWARE ENGINEER\",\"title\":\"baliqDev\",\"tagline\":\"CRAFTING ROBUST WEB SYSTEMS & SCALABLE DIGITAL PRODUCTS\",\"description\":\"Fokus pada pengembangan aplikasi web performa tinggi, sistem informasi terintegrasi, dan antarmuka modern yang bersih.\",\"imageUrl\":\"/images/hero-bg.jpg\",\"profileImageUrl\":\"/profil.jpeg\",\"primaryBtnText\":\"Lihat Karya\",\"primaryBtnLink\":\"#projects\",\"secondaryBtnText\":\"Hubungi Saya\",\"secondaryBtnLink\":\"#contact\",\"stats\":[{\"label\":\"Tahun Pengalaman\",\"value\":\"4+\"},{\"label\":\"Proyek Tuntas\",\"value\":\"30+\"},{\"label\":\"Tingkat Kepuasan\",\"value\":\"98%\"},{\"label\":\"Teknologi Utama\",\"value\":\"14+\"}]},\"projects\":[{\"id\":\"proj-1\",\"title\":\"SKARIGA Academic & PPDB Portal\",\"subtitle\":\"Sistem Informasi Akademik & Portal Pendaftaran\",\"category\":\"Web Platform\",\"description\":\"Portal manajemen akademik dan pendaftaran siswa baru terpadu dengan integrasi pembayaran otomatis dan manajemen data terpusat.\",\"imageUrl\":\"/images/projects/project-1.jpg\",\"tags\":[\"Next.js\",\"TypeScript\",\"TailwindCSS\",\"PostgreSQL\"],\"demoUrl\":\"https://skarigajaya.web.id\",\"githubUrl\":\"https://github.com/baliqdev/skariga-portal\",\"featured\":true,\"year\":\"2026\"},{\"id\":\"proj-2\",\"title\":\"OmniPOS Multi-Outlet & Inventory\",\"subtitle\":\"Point of Sale & Real-time Stock Manager\",\"category\":\"Enterprise App\",\"description\":\"Sistem kasir multi-cabang dengan sinkronisasi inventori otomatis, pencatatan transaksi offline-first, dan laporan analitik penjualan.\",\"imageUrl\":\"/images/projects/project-2.jpg\",\"tags\":[\"React\",\"Next.js\",\"Node.js\",\"PostgreSQL\",\"Docker\"],\"demoUrl\":\"https://omnipos-demo.dev\",\"githubUrl\":\"https://github.com/baliqdev/omni-pos\",\"featured\":true,\"year\":\"2025\"},{\"id\":\"proj-3\",\"title\":\"Logistika Fleet Telematics\",\"subtitle\":\"Monitoring & Dispatch Management System\",\"category\":\"Logistics Web\",\"description\":\"Dashboard pelacakan armada kendaraan logistik dengan visualisasi rute real-time berbasis peta digital dan estimasi waktu kedatangan.\",\"imageUrl\":\"/images/projects/project-3.jpg\",\"tags\":[\"TypeScript\",\"Go\",\"Next.js\",\"WebSocket\",\"PostgreSQL\"],\"demoUrl\":\"https://logistika.dev\",\"githubUrl\":\"https://github.com/baliqdev/logistika-fleet\",\"featured\":true,\"year\":\"2026\"},{\"id\":\"proj-4\",\"title\":\"Finansia Cashflow & Budget Tracker\",\"subtitle\":\"Personal & Business Wealth Manager\",\"category\":\"Fintech App\",\"description\":\"Aplikasi pencatat keuangan dan perencana anggaran bulanan dengan ringkasan visual grafik pengeluaran dan export laporan keuangan.\",\"imageUrl\":\"/images/projects/project-4.jpg\",\"tags\":[\"Next.js\",\"React\",\"TailwindCSS\",\"Redis\"],\"demoUrl\":\"https://finansia-demo.dev\",\"githubUrl\":\"https://github.com/baliqdev/finansia-tracker\",\"featured\":true,\"year\":\"2025\"},{\"id\":\"proj-5\",\"title\":\"Minimalist CMS & Editorial Studio\",\"subtitle\":\"Lightweight Publishing & Content System\",\"category\":\"CMS & Publishing\",\"description\":\"Sistem manajemen konten editorial cepat dan bersih dengan editor markdown terpadu, manajemen media, dan rendering statis berkecepatan tinggi.\",\"imageUrl\":\"/images/projects/project-5.jpg\",\"tags\":[\"Next.js\",\"React\",\"TypeScript\",\"TailwindCSS\"],\"demoUrl\":\"https://studio-cms.dev\",\"githubUrl\":\"https://github.com/baliqdev/minimal-cms\",\"featured\":true,\"year\":\"2025\"}],\"techStack\":[{\"id\":\"tech-1791207983877\",\"name\":\"PHP\",\"category\":\"Bahasa Pemrograman\",\"description\":\"Pemrograman backend web dinamis & RESTful API\",\"iconKey\":\"php\",\"color\":\"#777BB4\"},{\"id\":\"tech-1791207988855\",\"name\":\"Laravel\",\"category\":\"Backend & API\",\"description\":\"Framework PHP arsitektur MVC elegan & ekosistem kaya\",\"iconKey\":\"laravel\",\"color\":\"#FF2D20\"},{\"id\":\"tech-1791207997048\",\"name\":\"Tailwind CSS\",\"category\":\"Frontend & Framework\",\"description\":\"Utility-first CSS framework untuk styling cepat & presisi\",\"iconKey\":\"tailwind\",\"color\":\"#06B6D4\"},{\"id\":\"tech-1791208007994\",\"name\":\"MySQL\",\"category\":\"Database & Cache\",\"description\":\"Sistem database relasional open-source terpopuler di dunia\",\"iconKey\":\"mysql\",\"color\":\"#00758F\"},{\"id\":\"tech-1791208017804\",\"name\":\"Linux\",\"category\":\"DevOps & Cloud\",\"description\":\"Sistem operasi server produksi, bash script, & deployment\",\"iconKey\":\"linux\",\"color\":\"#FCC624\"},{\"id\":\"tech-1791208025138\",\"name\":\"HTML5\",\"category\":\"Frontend & Framework\",\"description\":\"Fondasi struktur semantik konten & dokumen web\",\"iconKey\":\"html\",\"color\":\"#E34F26\"},{\"id\":\"tech-1791208029137\",\"name\":\"CSS3\",\"category\":\"Frontend & Framework\",\"description\":\"Desain visual, animasi transisi, & responsive layout\",\"iconKey\":\"css\",\"color\":\"#1572B6\"},{\"id\":\"tech-1791208040582\",\"name\":\"Git & GitHub\",\"category\":\"DevOps & Cloud\",\"description\":\"Version control system & kolaborasi kode repositori\",\"iconKey\":\"git\",\"color\":\"#F05032\"},{\"id\":\"tech-1791208048580\",\"name\":\"React\",\"category\":\"Frontend & Framework\",\"description\":\"Library komponen antarmuka pengguna interaktif (SPA)\",\"iconKey\":\"react\",\"color\":\"#61DAFB\"}],\"contact\":{\"name\":\"Iqbal Isnanda (baliqDev)\",\"email\":\"contact@baliq.dev\",\"phone\":\"+62 812-3456-7890\",\"whatsapp\":\"6281234567890\",\"location\":\"Malang & Jakarta, Indonesia\",\"address\":\"Jl. Soekarno Hatta No. 45, Lowokwaru, Kota Malang, Jawa Timur 65141\",\"bio\":\"Software engineer yang berdedikasi membangun web application performan, bersih, dan handal. Terbuka untuk diskusi proyek dan kolaborasi pengembangan sistem.\",\"availability\":\"Tersedia untuk proyek baru\",\"socials\":{\"github\":\"https://github.com/baliqdev\",\"linkedin\":\"https://linkedin.com/in/baliqdev\",\"instagram\":\"https://instagram.com/baliqdev\",\"twitter\":\"https://x.com/baliqdev\",\"telegram\":\"https://t.me/baliqdev\",\"youtube\":\"https://youtube.com/@baliqdev\",\"tiktok\":\"https://tiktok.com/@baliqdev\",\"discord\":\"https://discord.gg/baliqdev\",\"website\":\"https://baliq.dev\"}},\"messages\":[{\"id\":\"msg-sample-1\",\"name\":\"Budi Santoso\",\"email\":\"budi.santoso@startup.co.id\",\"subject\":\"Diskusi Pengembangan Web Portal\",\"message\":\"Halo baliqDev, kami tertarik berkolaborasi untuk proyek pembuatan portal manajemen internal.\",\"createdAt\":\"2026-10-02T10:15:00.000Z\",\"read\":true}],\"songs\":[{\"id\":\"song-1791206528210\",\"title\":\"33x\",\"artist\":\"Perunggu\",\"album\":\"33x\",\"genre\":\"Spotify Track\",\"duration\":\"7:14\",\"coverUrl\":\"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022f6309d853e9a87b7ccb08a1\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/7ea62a1c3aceb7684169f1a477b24d5b3cef0a9f\",\"spotifyUrl\":\"https://open.spotify.com/track/2pOLzpYmuDlcbTJUXYkPSr\",\"color\":\"rgb(88, 82, 82)\",\"gradient\":\"linear-gradient(135deg, rgb(88, 82, 82) 0%, #0d0d11 100%)\",\"lyrics\":\"Risalah terikatnya\\nBatin dan raga yang mengunci\\nDiatas Sang Maha Daya\\nSemua kendali terambil alih\\n\\nJikalau kau keluhkan\\nDengung sumbang yang mengganggu\\nBuka lagi visimu\\nKau tahu mana urutan satu\\n\\nDiantara pusaran nirfungsi\\nPetakan semua lagi\\nTitik tuju yang t\'lah terpatri\\n\\nMelamban bukanlah hal yang tabu\\nKadang itu yang kau butuh\\nBersandar hibahkan bebanmu\\n\\nRotasikan pandanganmu\\nAmbil sudut yang terbaru\\nBelum pernah kau coba\\nLihat semua bukan dari matamu\\n\\nKelak kau kan mengingat\\nYang membawamu kesini\\nKami pernah disitu\\nDi posisimu\\nHelakan kesahmu\\n\\nDiantara pusaran nirfungsi\\nPetakan semua lagi\\nTitik tuju yang t\'lah terpatri\\n\\nMelamban bukanlah hal yang tabu\\nKadang itu yang kau butuh\\nBersandar hibahkan bebanmu\\n\\nTak perlu kau berhenti kurasi\\nIni hanya sementara\\nBukan ujung dari rencana\\n\\nJalanmu kan sepanjang niatmu\\nSimpan tegar dalam hati\\nDua sembilan kau terus mencari\\n\\nSebutlah namaNya\\nTetap di jalanNya\\nKelak kau mengingat\\nKau akan teringat\\n\\nSebutlah namaNya\\nTetap di jalanNya\\nKelak kau mengingat\\nKau akan teringat\\n\\nSebutlah namaNya\\nTetap di jalanNya\\nKelak kau mengingat\\nKau akan teringat\\n\\nSebutkanlah namaNya\\nResapilah jalanNya\\nKelak kau mengingat\\nKau akan teringat\\n\\nTerus berenang\\nLanjutlah mendaki\\n\\nTerus berenang\\nLanjutlah mendaki\\n\\nTerus berenang\\nLanjutlah mendaki\\n\\nTerus berenang\\nLanjutlah mendaki\"},{\"id\":\"song-1791206519521\",\"title\":\"Berapa Kali Kita Akan Saling Memaafkan\",\"artist\":\"Pamungkas\",\"album\":\"Berapa Kali Kita Akan Saling Memaafkan\",\"genre\":\"Spotify Track\",\"duration\":\"4:40\",\"coverUrl\":\"https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027fd11848d664ff0e9a3694b2\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/be06dd32591ef2ad395ce4d81f32f2086f8f0928\",\"spotifyUrl\":\"https://open.spotify.com/track/7c03QS94XIfcetKSNDhUdd\",\"color\":\"rgb(64, 32, 0)\",\"gradient\":\"linear-gradient(135deg, rgb(64, 32, 0) 0%, #0d0d11 100%)\",\"lyrics\":\"Kau panggil lagi nama depanku\\nBukannya cinta, bukannya sayang\\nPertanda pasti, yeah, amarah murka\\nDan panasnya hati, emosi buta\\n\\nOh, berapa kali kita akan saling memaafkan\\nAtas nama janji \'tuk saling mengerti?\\n\\nSudah kuterima luka-luka lama\\nYang engkau jaga, pandai-pandai aku\\nIngatkan diri ada yang takkan pernah ku mengerti\\nKarena tak pernah aku lalui yang kau lalui\\n\\nBerapa kali kita akan saling memaafkan\\nAtas nama janji \'tuk saling mengerti?\\n\\n(It\'s not the end, we\'ll try again, we\'ll try again)\\n(It\'s not the end, we\'ll try again)\\n(Let\'s try again, let\'s try again, let\'s try again)\\n\\nKupanggil lagi, hm, nama kecilmu\\nPengingat bahwa (it\'s not the end, we\'ll try again)\\nKau yang tercinta (let\'s try again, let\'s try again, let\'s try again)\\nKau yang tercinta, kau yang tercinta\\nKau yang tercinta, kau yang tercinta\\n\\nOh, berapa kali kita akan saling memaafkan\\nAtas nama janji \'tuk saling mengerti?\\n\\nOh, sudah kuterima luka-luka lama\\nYang engkau jaga pandai-pandai aku\\nIngatkan diri ada yang takkan pernah ku mengerti\\nKarena tak pernah aku lalui yang kau lalui\\n\\nOh, berapa kali kita akan saling memaafkan\\nAtas nama janji, oh, \'tuk saling mengerti?\\n\\nIt\'s not the end, we\'ll try again\\nIt\'s not the end, it\'s not\\nLet\'s try again, let\'s try again\\nIt\'s not the end\\n\\nIt\'s not the end, we\'ll try again\\nWe\'ll try again, we\'ll try\"},{\"id\":\"song-1791206508931\",\"title\":\"Kita Lewati Berdua\",\"artist\":\"Overnight\",\"album\":\"Kita Lewati Berdua\",\"genre\":\"Spotify Track\",\"duration\":\"3:59\",\"coverUrl\":\"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d05559e98f982b79eb508dcc\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/4eabca8bfafa5f1ea1623eb02027ab29bdd9b865\",\"spotifyUrl\":\"https://open.spotify.com/track/5Enpui55il1ZW0HgwRTSds\",\"color\":\"rgb(159, 0, 0)\",\"gradient\":\"linear-gradient(135deg, rgb(159, 0, 0) 0%, #0d0d11 100%)\",\"lyrics\":\"Sepi menerpa\\nSelimuti kabut jiwa\\nMenjelma dirimu\\nDalam untaian kata rindu\\n\\nSemoga jarak yang terbentang ini\\nSegera mereda\\nMerubah rindu yang meradang ini\\nJadi kabar bahagia\\n\\nDi kala hujan turun deras\\nKala rindunya merasuk jiwa\\nTenangkan dirimu, aku bersamamu\\nWalau tak kupeluk tubuhmu\\n\\nAtaupun saat gelap tiba\\nMungkin hanya lentera intuisimu\\nYang \'kan membawaku\\nMembasuh perih di hatimu\\n\\nJangan pergi dulu, oh, Sayang\\nTetap bersamaku\\nKu tahu semua takkan mudah (ku tahu semua takkan mudah)\\nJalannya pun akan panjang (jalannya pun akan panjang)\\nNamun, percayalah\\nKita akan lewati berdua\\n\\nDi kala hujan turun deras\\nPekatnya badai mungkin terasa\\nTenangkan dirimu, aku bersamamu\\nWalau tak kupeluk tubuhmu (peluk aku)\\n\\nAtaupun saat gelap tiba\\nMungkin hanya lentera intuisimu\\nYang \'kan membawaku\\nMembasuh perih di hatimu\"},{\"id\":\"song-1791206495830\",\"title\":\"Kisah Sedih Kontemporer (Air & Api)\",\"artist\":\"Dongker\",\"album\":\"Kisah Sedih Kontemporer (Air & Api)\",\"genre\":\"Spotify Track\",\"duration\":\"3:27\",\"coverUrl\":\"https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02dafcc1e0b04485db7fe8e0c4\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/e609669af49a02b960c620032cf71df9a93413e4\",\"spotifyUrl\":\"https://open.spotify.com/track/7zCiQIqSrjOJaOUddGMX42\",\"color\":\"rgb(83, 83, 83)\",\"gradient\":\"linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)\",\"lyrics\":\"Di jalanan panjang menuju nirwana\\nKita berdua tahu kita memang gila\\nEntah karena kita skizofrenia\\nEntah karena Korin atau Mira\\n\\nDi harapan panjang yang tiada habisnya\\nKita berdua tahu kita pasti bisa\\nMeski hidup kita singkat dan ditodong senjata\\nMeski dunia tak berubah, adakah kau di sana?\\n\\nSampai kapan cinta kita terus mengalir\\nLayaknya air\\nYang dihadang api? Perih\\nSampai kapan kita akan terus bernyanyi\\nLagu-lagu Naif\\nTentang air dan api? Perih\\n\\nMengapa kita saling membenci?\\nAwalnya kita selalu memberi\\nApakah mungkin hati yang murni\\nSudah cukup berarti\\nAtaukah kita belum mencoba\\nMemberi waktu pada logika\\nJangan seperti selama ini\\nHidup bagaikan air dan api\"},{\"id\":\"song-1791206476137\",\"title\":\"Lagu Selepas Hujan\",\"artist\":\"Dongker\",\"album\":\"Lagu Selepas Hujan\",\"genre\":\"Spotify Track\",\"duration\":\"3:32\",\"coverUrl\":\"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02224aa6a20f9a55b76d669d18\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/db482c05ffe54c247b8863d70e90896f302c35b6\",\"spotifyUrl\":\"https://open.spotify.com/track/5DcsPJ5VVz8V8YoLVO2T05\",\"color\":\"rgb(61, 90, 62)\",\"gradient\":\"linear-gradient(135deg, rgb(61, 90, 62) 0%, #0d0d11 100%)\",\"lyrics\":\"Rindu dan rintiknya\\nTergenang di jalan\\nSelepas hujan\\nKuingin pulang mencarimu\\n\\nLubang-lubang aspal\\nMencelakai warga\\nTata letak kota\\nTak pernah pedulikan aku\\n\\nHidup memang bukan pilihan\\nSemoga kita takkan menyesal\\n\\nKita terus berlari sampai mampus\\nBahkan tangan kaki kita pun terputus\\nNiat baik kita memang selalu tulus\\nTapi takkan cukup selalu tutup mulut\\nHusss\\nKuterjebak melankolia\\n\\nKunyalakan Jimny dan Astreaku\\nUntuk segera berangkat subuh nanti\\nDengan bahan bakar subsidi gagal\\nRakyat pun bersabar menanti ajal\\n\\nHidup memang bukan pilihan\\nSemoga kita takkan menyesal\\n\\nKita terus berlari sampai mampus\\nBahkan tangan kaki kita pun terputus\\nNiat baik kita memang selalu tulus\\nTapi takkan cukup selalu tutup mulut\\nTangis yang tragis di reruntuh kota\\nSenyum yang manis di wajahmu cinta\\n\\nKuterjebak melankolia\\nSemoga kita bahagia\"},{\"id\":\"song-1791206464298\",\"title\":\"Sambutlah\",\"artist\":\"The Jeblogs\",\"album\":\"Sambutlah\",\"genre\":\"Spotify Track\",\"duration\":\"5:01\",\"coverUrl\":\"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b2ac8e98b0fe410e0bd9fd52\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/dc7e313a7f319584ac2da4677c83dcf230271b14\",\"spotifyUrl\":\"https://open.spotify.com/track/2HSEx8vqPIu6aMZB60OVTm\",\"color\":\"rgb(83, 83, 83)\",\"gradient\":\"linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)\",\"lyrics\":\"Sambutlah matahari\\nYang terbit di ufuk timur\\nMembelah gelap\\nHangat merambat\\nMembangunkan lelap\\nSampaikan salam kami\\nKepada bulan dan bintang\\nOh tenang saja\\nGenerasi baru telah tiba\\nUh-uh-uh-uh\\nUh-uh-uh-uh\\nMalam yang memuakkan harus diakhiri\\nGelapnya membungkam suara\\nJiwa baru yang putih serupa lilin\\nBakarlah kedua sisinya\\nUh-uh-uh-uh\\nUh-uh-uh-uh\\nBenih-benih bertumbuh di sela puing\\nHarapan mencari jalannya\\nOrang-orang muda berkobar menjelma cahaya\\nLajunya tak terbendung jadi bersiaplah maka rayakanlah\\nTabuh genderangnya\\nTiup terompetnya\\nNyalakan api di dadanya\\nSambutlah matahari\\nYang terbit di ufuk timur\\nMembelah gelap\\nHangat merambat\\nMembangunkan lelap\\nSampaikan salam kami\\nKepada bulan dan bintang\\nOh tenang saja\\nGenerasi baru telah tiba\\nUh-uh-uh-uh\\nUh-uh-uh-uh\\nMungkin kita sampai\\nMungkin saja tidak\\nTugas kita hanyalah berjalan oh\\nSambutlah matahari\\nYang terbit di ufuk timur\\nMembelah gelap\\nHangat merambat\\nMembangunkan lelap\\nSampaikan salam kami\\nKepada bulan dan bintang\\nOh tenang saja\\nGenerasi baru telah\\nSambutlah matahari\\nYang terbit di ufuk timur\\nMembelah gelap\\nHangat merambat\\nMembangunkan lelap\\nSampaikan salam kami\\nKepada bulan dan bintang\\nOh tenang saja\\nGenerasi baru telah tiba\\nUh-uh-uh-uh\\nUh-uh-uh-uh\\nUh-uh-uh-uh\\nUh-uh-uh-uh\"},{\"id\":\"song-1791206432847\",\"title\":\"Menangisi Akhir Pekan\",\"artist\":\"Jenny\",\"album\":\"Menangisi Akhir Pekan\",\"genre\":\"Spotify Track\",\"duration\":\"4:30\",\"coverUrl\":\"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022d88ef49cdf1c03f26a3eb52\",\"previewUrl\":\"https://p.scdn.co/mp3-preview/42d61ea64dd6c2ef0ef41c14eb231487c37c6b29\",\"spotifyUrl\":\"https://open.spotify.com/track/5IqEcSpcNQ8Mb3XEe1s2iw\",\"color\":\"rgb(83, 83, 83)\",\"gradient\":\"linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)\",\"lyrics\":\"Hingar bingar hampa\\nDalam tempo yang semakin melambat\\nSepekan tertukar dengan lari paksa rutinitas\\nSatu terakhir dari tujuh\\nSaatnya tanggalkan baju peranku\\nSandarkan tubuh lelah lemah sandarkan\\nSandarkan dulu\\nPermintaan dan pemenuhan\\nTerangkai dalam sebuah rantai makanan\\nSepekan termakan dalam rantai makanan itu\\nSatu paling ujung dari tujuh\\nSaatnya tumpahkan keluh kesahku\\nBingarkan panggung rendah luas terang tanpa barikade\\nTeman dan pencerita\\nPanggung dan pertunjukan\\nCairan dan pendosa\\nRayakan dengan asap\\nDi hela napas\\nJalan dan pencarian jawaban\\nIngatan dan penyesalan\\nTangisi akhir pekanmu\\nSatu yang tearkhir dari tujuh\\nSaatnya tanggalkan baju perangku\\nSatu yang terakhir dari tujuh\\nSaatnya sandarkan tubuh lelahku\\nSatu yang terakhir dari tujuh\\nSaatnya tumpahkan keluh kesahku\\nSatu yang terakhir dari tujuh\\nSaatnya bingarkan panggungku\\nOw ow ow\\nTeman dan pencerita\\nPanggung dan pertunjukan\\nCairan dan pendosa\\nRayakan dengan asap\\nDi hela napas\\nJalan dan pencarian jawaban\\nIngatan dan penyesalan\\nRayakan akhir pekanmu\\nTangisilah\\nRayakanlah\\nTangisilah\\nRayakanlah\\nTangisilah\\nRayakanlah\\nTangisilah\"}]}','2026-10-06 12:13:29');
/*!40000 ALTER TABLE `portfolio_data` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Web Platform',
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `demo_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `pinned` tinyint(1) DEFAULT 0,
  `year` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES
('proj-1','SKARIGA Academic & PPDB Portal','Sistem Informasi Akademik & Portal Pendaftaran','Web Platform','Portal manajemen akademik dan pendaftaran siswa baru terpadu dengan integrasi pembayaran otomatis dan manajemen data terpusat.','/images/projects/project-1.jpg','[\"Next.js\",\"TypeScript\",\"TailwindCSS\",\"PostgreSQL\"]','https://skarigajaya.web.id','https://github.com/baliqdev/skariga-portal',1,0,'2026','2026-10-06 12:13:29'),
('proj-2','OmniPOS Multi-Outlet & Inventory','Point of Sale & Real-time Stock Manager','Enterprise App','Sistem kasir multi-cabang dengan sinkronisasi inventori otomatis, pencatatan transaksi offline-first, dan laporan analitik penjualan.','/images/projects/project-2.jpg','[\"React\",\"Next.js\",\"Node.js\",\"PostgreSQL\",\"Docker\"]','https://omnipos-demo.dev','https://github.com/baliqdev/omni-pos',1,0,'2025','2026-10-06 12:13:29'),
('proj-3','Logistika Fleet Telematics','Monitoring & Dispatch Management System','Logistics Web','Dashboard pelacakan armada kendaraan logistik dengan visualisasi rute real-time berbasis peta digital dan estimasi waktu kedatangan.','/images/projects/project-3.jpg','[\"TypeScript\",\"Go\",\"Next.js\",\"WebSocket\",\"PostgreSQL\"]','https://logistika.dev','https://github.com/baliqdev/logistika-fleet',1,0,'2026','2026-10-06 12:13:29'),
('proj-4','Finansia Cashflow & Budget Tracker','Personal & Business Wealth Manager','Fintech App','Aplikasi pencatat keuangan dan perencana anggaran bulanan dengan ringkasan visual grafik pengeluaran dan export laporan keuangan.','/images/projects/project-4.jpg','[\"Next.js\",\"React\",\"TailwindCSS\",\"Redis\"]','https://finansia-demo.dev','https://github.com/baliqdev/finansia-tracker',1,0,'2025','2026-10-06 12:13:29'),
('proj-5','Minimalist CMS & Editorial Studio','Lightweight Publishing & Content System','CMS & Publishing','Sistem manajemen konten editorial cepat dan bersih dengan editor markdown terpadu, manajemen media, dan rendering statis berkecepatan tinggi.','/images/projects/project-5.jpg','[\"Next.js\",\"React\",\"TypeScript\",\"TailwindCSS\"]','https://studio-cms.dev','https://github.com/baliqdev/minimal-cms',1,0,'2025','2026-10-06 12:13:29');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `spotify_songs`
--

DROP TABLE IF EXISTS `spotify_songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `spotify_songs` (
  `id` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `album` varchar(255) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `cover_url` text DEFAULT NULL,
  `preview_url` text DEFAULT NULL,
  `spotify_url` text DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `gradient` text DEFAULT NULL,
  `lyrics` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spotify_songs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `spotify_songs` WRITE;
/*!40000 ALTER TABLE `spotify_songs` DISABLE KEYS */;
INSERT INTO `spotify_songs` VALUES
('song-1791206432847','Menangisi Akhir Pekan','Jenny','Menangisi Akhir Pekan','Spotify Track','4:30','https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022d88ef49cdf1c03f26a3eb52','https://p.scdn.co/mp3-preview/42d61ea64dd6c2ef0ef41c14eb231487c37c6b29','https://open.spotify.com/track/5IqEcSpcNQ8Mb3XEe1s2iw','rgb(83, 83, 83)','linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)','Hingar bingar hampa\nDalam tempo yang semakin melambat\nSepekan tertukar dengan lari paksa rutinitas\nSatu terakhir dari tujuh\nSaatnya tanggalkan baju peranku\nSandarkan tubuh lelah lemah sandarkan\nSandarkan dulu\nPermintaan dan pemenuhan\nTerangkai dalam sebuah rantai makanan\nSepekan termakan dalam rantai makanan itu\nSatu paling ujung dari tujuh\nSaatnya tumpahkan keluh kesahku\nBingarkan panggung rendah luas terang tanpa barikade\nTeman dan pencerita\nPanggung dan pertunjukan\nCairan dan pendosa\nRayakan dengan asap\nDi hela napas\nJalan dan pencarian jawaban\nIngatan dan penyesalan\nTangisi akhir pekanmu\nSatu yang tearkhir dari tujuh\nSaatnya tanggalkan baju perangku\nSatu yang terakhir dari tujuh\nSaatnya sandarkan tubuh lelahku\nSatu yang terakhir dari tujuh\nSaatnya tumpahkan keluh kesahku\nSatu yang terakhir dari tujuh\nSaatnya bingarkan panggungku\nOw ow ow\nTeman dan pencerita\nPanggung dan pertunjukan\nCairan dan pendosa\nRayakan dengan asap\nDi hela napas\nJalan dan pencarian jawaban\nIngatan dan penyesalan\nRayakan akhir pekanmu\nTangisilah\nRayakanlah\nTangisilah\nRayakanlah\nTangisilah\nRayakanlah\nTangisilah'),
('song-1791206464298','Sambutlah','The Jeblogs','Sambutlah','Spotify Track','5:01','https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b2ac8e98b0fe410e0bd9fd52','https://p.scdn.co/mp3-preview/dc7e313a7f319584ac2da4677c83dcf230271b14','https://open.spotify.com/track/2HSEx8vqPIu6aMZB60OVTm','rgb(83, 83, 83)','linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)','Sambutlah matahari\nYang terbit di ufuk timur\nMembelah gelap\nHangat merambat\nMembangunkan lelap\nSampaikan salam kami\nKepada bulan dan bintang\nOh tenang saja\nGenerasi baru telah tiba\nUh-uh-uh-uh\nUh-uh-uh-uh\nMalam yang memuakkan harus diakhiri\nGelapnya membungkam suara\nJiwa baru yang putih serupa lilin\nBakarlah kedua sisinya\nUh-uh-uh-uh\nUh-uh-uh-uh\nBenih-benih bertumbuh di sela puing\nHarapan mencari jalannya\nOrang-orang muda berkobar menjelma cahaya\nLajunya tak terbendung jadi bersiaplah maka rayakanlah\nTabuh genderangnya\nTiup terompetnya\nNyalakan api di dadanya\nSambutlah matahari\nYang terbit di ufuk timur\nMembelah gelap\nHangat merambat\nMembangunkan lelap\nSampaikan salam kami\nKepada bulan dan bintang\nOh tenang saja\nGenerasi baru telah tiba\nUh-uh-uh-uh\nUh-uh-uh-uh\nMungkin kita sampai\nMungkin saja tidak\nTugas kita hanyalah berjalan oh\nSambutlah matahari\nYang terbit di ufuk timur\nMembelah gelap\nHangat merambat\nMembangunkan lelap\nSampaikan salam kami\nKepada bulan dan bintang\nOh tenang saja\nGenerasi baru telah\nSambutlah matahari\nYang terbit di ufuk timur\nMembelah gelap\nHangat merambat\nMembangunkan lelap\nSampaikan salam kami\nKepada bulan dan bintang\nOh tenang saja\nGenerasi baru telah tiba\nUh-uh-uh-uh\nUh-uh-uh-uh\nUh-uh-uh-uh\nUh-uh-uh-uh'),
('song-1791206476137','Lagu Selepas Hujan','Dongker','Lagu Selepas Hujan','Spotify Track','3:32','https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02224aa6a20f9a55b76d669d18','https://p.scdn.co/mp3-preview/db482c05ffe54c247b8863d70e90896f302c35b6','https://open.spotify.com/track/5DcsPJ5VVz8V8YoLVO2T05','rgb(61, 90, 62)','linear-gradient(135deg, rgb(61, 90, 62) 0%, #0d0d11 100%)','Rindu dan rintiknya\nTergenang di jalan\nSelepas hujan\nKuingin pulang mencarimu\n\nLubang-lubang aspal\nMencelakai warga\nTata letak kota\nTak pernah pedulikan aku\n\nHidup memang bukan pilihan\nSemoga kita takkan menyesal\n\nKita terus berlari sampai mampus\nBahkan tangan kaki kita pun terputus\nNiat baik kita memang selalu tulus\nTapi takkan cukup selalu tutup mulut\nHusss\nKuterjebak melankolia\n\nKunyalakan Jimny dan Astreaku\nUntuk segera berangkat subuh nanti\nDengan bahan bakar subsidi gagal\nRakyat pun bersabar menanti ajal\n\nHidup memang bukan pilihan\nSemoga kita takkan menyesal\n\nKita terus berlari sampai mampus\nBahkan tangan kaki kita pun terputus\nNiat baik kita memang selalu tulus\nTapi takkan cukup selalu tutup mulut\nTangis yang tragis di reruntuh kota\nSenyum yang manis di wajahmu cinta\n\nKuterjebak melankolia\nSemoga kita bahagia'),
('song-1791206495830','Kisah Sedih Kontemporer (Air & Api)','Dongker','Kisah Sedih Kontemporer (Air & Api)','Spotify Track','3:27','https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02dafcc1e0b04485db7fe8e0c4','https://p.scdn.co/mp3-preview/e609669af49a02b960c620032cf71df9a93413e4','https://open.spotify.com/track/7zCiQIqSrjOJaOUddGMX42','rgb(83, 83, 83)','linear-gradient(135deg, rgb(83, 83, 83) 0%, #0d0d11 100%)','Di jalanan panjang menuju nirwana\nKita berdua tahu kita memang gila\nEntah karena kita skizofrenia\nEntah karena Korin atau Mira\n\nDi harapan panjang yang tiada habisnya\nKita berdua tahu kita pasti bisa\nMeski hidup kita singkat dan ditodong senjata\nMeski dunia tak berubah, adakah kau di sana?\n\nSampai kapan cinta kita terus mengalir\nLayaknya air\nYang dihadang api? Perih\nSampai kapan kita akan terus bernyanyi\nLagu-lagu Naif\nTentang air dan api? Perih\n\nMengapa kita saling membenci?\nAwalnya kita selalu memberi\nApakah mungkin hati yang murni\nSudah cukup berarti\nAtaukah kita belum mencoba\nMemberi waktu pada logika\nJangan seperti selama ini\nHidup bagaikan air dan api'),
('song-1791206508931','Kita Lewati Berdua','Overnight','Kita Lewati Berdua','Spotify Track','3:59','https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d05559e98f982b79eb508dcc','https://p.scdn.co/mp3-preview/4eabca8bfafa5f1ea1623eb02027ab29bdd9b865','https://open.spotify.com/track/5Enpui55il1ZW0HgwRTSds','rgb(159, 0, 0)','linear-gradient(135deg, rgb(159, 0, 0) 0%, #0d0d11 100%)','Sepi menerpa\nSelimuti kabut jiwa\nMenjelma dirimu\nDalam untaian kata rindu\n\nSemoga jarak yang terbentang ini\nSegera mereda\nMerubah rindu yang meradang ini\nJadi kabar bahagia\n\nDi kala hujan turun deras\nKala rindunya merasuk jiwa\nTenangkan dirimu, aku bersamamu\nWalau tak kupeluk tubuhmu\n\nAtaupun saat gelap tiba\nMungkin hanya lentera intuisimu\nYang \'kan membawaku\nMembasuh perih di hatimu\n\nJangan pergi dulu, oh, Sayang\nTetap bersamaku\nKu tahu semua takkan mudah (ku tahu semua takkan mudah)\nJalannya pun akan panjang (jalannya pun akan panjang)\nNamun, percayalah\nKita akan lewati berdua\n\nDi kala hujan turun deras\nPekatnya badai mungkin terasa\nTenangkan dirimu, aku bersamamu\nWalau tak kupeluk tubuhmu (peluk aku)\n\nAtaupun saat gelap tiba\nMungkin hanya lentera intuisimu\nYang \'kan membawaku\nMembasuh perih di hatimu'),
('song-1791206519521','Berapa Kali Kita Akan Saling Memaafkan','Pamungkas','Berapa Kali Kita Akan Saling Memaafkan','Spotify Track','4:40','https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027fd11848d664ff0e9a3694b2','https://p.scdn.co/mp3-preview/be06dd32591ef2ad395ce4d81f32f2086f8f0928','https://open.spotify.com/track/7c03QS94XIfcetKSNDhUdd','rgb(64, 32, 0)','linear-gradient(135deg, rgb(64, 32, 0) 0%, #0d0d11 100%)','Kau panggil lagi nama depanku\nBukannya cinta, bukannya sayang\nPertanda pasti, yeah, amarah murka\nDan panasnya hati, emosi buta\n\nOh, berapa kali kita akan saling memaafkan\nAtas nama janji \'tuk saling mengerti?\n\nSudah kuterima luka-luka lama\nYang engkau jaga, pandai-pandai aku\nIngatkan diri ada yang takkan pernah ku mengerti\nKarena tak pernah aku lalui yang kau lalui\n\nBerapa kali kita akan saling memaafkan\nAtas nama janji \'tuk saling mengerti?\n\n(It\'s not the end, we\'ll try again, we\'ll try again)\n(It\'s not the end, we\'ll try again)\n(Let\'s try again, let\'s try again, let\'s try again)\n\nKupanggil lagi, hm, nama kecilmu\nPengingat bahwa (it\'s not the end, we\'ll try again)\nKau yang tercinta (let\'s try again, let\'s try again, let\'s try again)\nKau yang tercinta, kau yang tercinta\nKau yang tercinta, kau yang tercinta\n\nOh, berapa kali kita akan saling memaafkan\nAtas nama janji \'tuk saling mengerti?\n\nOh, sudah kuterima luka-luka lama\nYang engkau jaga pandai-pandai aku\nIngatkan diri ada yang takkan pernah ku mengerti\nKarena tak pernah aku lalui yang kau lalui\n\nOh, berapa kali kita akan saling memaafkan\nAtas nama janji, oh, \'tuk saling mengerti?\n\nIt\'s not the end, we\'ll try again\nIt\'s not the end, it\'s not\nLet\'s try again, let\'s try again\nIt\'s not the end\n\nIt\'s not the end, we\'ll try again\nWe\'ll try again, we\'ll try'),
('song-1791206528210','33x','Perunggu','33x','Spotify Track','7:14','https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022f6309d853e9a87b7ccb08a1','https://p.scdn.co/mp3-preview/7ea62a1c3aceb7684169f1a477b24d5b3cef0a9f','https://open.spotify.com/track/2pOLzpYmuDlcbTJUXYkPSr','rgb(88, 82, 82)','linear-gradient(135deg, rgb(88, 82, 82) 0%, #0d0d11 100%)','Risalah terikatnya\nBatin dan raga yang mengunci\nDiatas Sang Maha Daya\nSemua kendali terambil alih\n\nJikalau kau keluhkan\nDengung sumbang yang mengganggu\nBuka lagi visimu\nKau tahu mana urutan satu\n\nDiantara pusaran nirfungsi\nPetakan semua lagi\nTitik tuju yang t\'lah terpatri\n\nMelamban bukanlah hal yang tabu\nKadang itu yang kau butuh\nBersandar hibahkan bebanmu\n\nRotasikan pandanganmu\nAmbil sudut yang terbaru\nBelum pernah kau coba\nLihat semua bukan dari matamu\n\nKelak kau kan mengingat\nYang membawamu kesini\nKami pernah disitu\nDi posisimu\nHelakan kesahmu\n\nDiantara pusaran nirfungsi\nPetakan semua lagi\nTitik tuju yang t\'lah terpatri\n\nMelamban bukanlah hal yang tabu\nKadang itu yang kau butuh\nBersandar hibahkan bebanmu\n\nTak perlu kau berhenti kurasi\nIni hanya sementara\nBukan ujung dari rencana\n\nJalanmu kan sepanjang niatmu\nSimpan tegar dalam hati\nDua sembilan kau terus mencari\n\nSebutlah namaNya\nTetap di jalanNya\nKelak kau mengingat\nKau akan teringat\n\nSebutlah namaNya\nTetap di jalanNya\nKelak kau mengingat\nKau akan teringat\n\nSebutlah namaNya\nTetap di jalanNya\nKelak kau mengingat\nKau akan teringat\n\nSebutkanlah namaNya\nResapilah jalanNya\nKelak kau mengingat\nKau akan teringat\n\nTerus berenang\nLanjutlah mendaki\n\nTerus berenang\nLanjutlah mendaki\n\nTerus berenang\nLanjutlah mendaki\n\nTerus berenang\nLanjutlah mendaki');
/*!40000 ALTER TABLE `spotify_songs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `tech_stack`
--

DROP TABLE IF EXISTS `tech_stack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tech_stack` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon_key` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tech_stack`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `tech_stack` WRITE;
/*!40000 ALTER TABLE `tech_stack` DISABLE KEYS */;
INSERT INTO `tech_stack` VALUES
('tech-1791207983877','PHP','Bahasa Pemrograman','Pemrograman backend web dinamis & RESTful API','php','#777BB4',0),
('tech-1791207988855','Laravel','Backend & API','Framework PHP arsitektur MVC elegan & ekosistem kaya','laravel','#FF2D20',1),
('tech-1791207997048','Tailwind CSS','Frontend & Framework','Utility-first CSS framework untuk styling cepat & presisi','tailwind','#06B6D4',2),
('tech-1791208007994','MySQL','Database & Cache','Sistem database relasional open-source terpopuler di dunia','mysql','#00758F',3),
('tech-1791208017804','Linux','DevOps & Cloud','Sistem operasi server produksi, bash script, & deployment','linux','#FCC624',4),
('tech-1791208025138','HTML5','Frontend & Framework','Fondasi struktur semantik konten & dokumen web','html','#E34F26',5),
('tech-1791208029137','CSS3','Frontend & Framework','Desain visual, animasi transisi, & responsive layout','css','#1572B6',6),
('tech-1791208040582','Git & GitHub','DevOps & Cloud','Version control system & kolaborasi kode repositori','git','#F05032',7),
('tech-1791208048580','React','Frontend & Framework','Library komponen antarmuka pengguna interaktif (SPA)','react','#61DAFB',8);
/*!40000 ALTER TABLE `tech_stack` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-10-07  6:45:24
