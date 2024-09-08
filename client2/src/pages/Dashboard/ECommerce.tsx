import React, { useState, useEffect } from 'react';
import HapusAkunModal from '../../components/modal/hapusakun';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ViewModal from '../../components/modal/modalview';

const formatDate = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const tanggal = date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const jam = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${tanggal} ${jam}`;
};

const ECommerce: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('nama'); // pastikan username tersimpan di localStorage
  const userId = localStorage.getItem('userId'); // pastikan username tersimpan di localStorage
  const url = 'http://localhost:5000';

  const [selectedOption, setSelectedOption] = useState<'Mahasiswa' | 'Tamu'>(
    'Mahasiswa',
  );
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const showQRModal = () => {
    setIsQRModalOpen(true);
  };

  const closeQRModal = () => {
    setIsQRModalOpen(false);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option as 'Mahasiswa' | 'Tamu');
  };

  const tableTitle =
    selectedOption === 'Mahasiswa'
      ? 'Data Pertemuan Mahasiswa'
      : 'Data Pertemuan Tamu';

  // fetch mahasiswa
  const [mahasiswaData, setMahasiswaData] = useState([
    {
      id: '',
      user: { nama: '', penjurusan: '', no_induk: '' },
      aslab: { nama: '', id: '' },
      timestamp: '',
    },
  ]);
  useEffect(() => {
    fetchMahasiswaData();
  }, [url]);

  const fetchMahasiswaData = () => {
    if (role === 'Mahasiswa') {
      axios
        .get(url + `/absentodayquery?user_id=${userId}`)
        .then((response) => {
          setMahasiswaData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching mahasiswa data:', error);
        });
    } else if (role === 'Asisten Lab') {
      axios
        .get(url + `/absentodayquery?aslab_id=${userId}`)
        .then((response) => {
          setMahasiswaData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching mahasiswa data:', error);
        });
    } else {
      axios
        .get(url + '/absenmahasiswa')
        .then((response) => {
          setMahasiswaData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching mahasiswa data:', error);
        });
    }
  };

  // fetch Tamu
  const [tamuData, setTamuData] = useState([
    {
      id: '',
      aslab: { nama: '', id: '' },
      nama: '',
      alamat: '',
      no_telp: '',
      keperluan: '',
      keterangan: '',
      timestamp: '',
    },
  ]);
  // Fetch Tamu data
  useEffect(() => {
    fetchTamuData();
  }, [url]);

  const fetchTamuData = () => {
    if (role === 'Tamu') {
      axios
        .get(url + `/absentodayquery?nama=${username}`)
        .then((response) => {
          setTamuData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tamu data:', error);
        });
    } else if (role === 'Asisten Lab') {
      axios
        .get(url + `/absentodayquery?aslab_id=${userId}`)
        .then((response) => {
          setMahasiswaData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching mahasiswa data:', error);
        });
    } else {
      axios
        .get(url + '/absentamu')
        .then((response) => {
          setTamuData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching tamu data:', error);
        });
    }
  };

  // Delete absen
  const [isModalHapusOpen, setIsModalHapusOpen] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  console.log(selectedData);

  const handleDeleteAbsen = async () => {
    try {
      await axios.delete(`http://localhost:5000/absen/${selectedData}`);
      setIsModalHapusOpen(false); // Close modal after deletion

      // Re-fetch updated data after deletion
      fetchMahasiswaData();
      fetchTamuData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  //fetch detail data
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Aslab and Dosen Section */}
      {role !== 'Mahasiswa' && role !== 'Tamu' && (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row pl-6 pt-4 pb-6 bg-white dark:border-strokedark dark:bg-boxdark space-y-2 w-full">
              <span className="min-w-[100px] text-black dark:text-white text-lg font-bold">
                {tableTitle}
              </span>
              <div className="flex w-full justify-end space-x-4 mr-8">
                <select
                  value={selectedOption}
                  onChange={(e) => handleOptionChange(e.target.value)}
                  className="px-4 py-2 border border-placeholder rounded-md dark:border-white dark:text-white dark:bg-boxdark bg-white text-black"
                >
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Tamu">Tamu</option>
                </select>
                <button
                  onClick={showQRModal}
                  className="bg-blue-500 text-white px-4 py-2 border border-placeholder rounded-md"
                >
                  Show QR
                </button>
              </div>
            </div>
          </div>
          {/* Table section */}
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  {selectedOption === 'Mahasiswa' ? (
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nama
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Penjurusan
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Asisten Lab
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Jadwal
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  ) : (
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nama
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Alamat
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        No Telepon
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Keperluan
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Keterangan
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Asisten Lab
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Jadwal
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {selectedOption === 'Mahasiswa'
                    ? mahasiswaData.map((item, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {key + 1}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.user?.nama}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item.user?.penjurusan}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item.aslab?.nama}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item.timestamp
                                ? formatDate(item.timestamp)
                                : '-'}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                onClick={() => {
                                  setIsModalHapusOpen(true);
                                  setSelectedData(item?.id);
                                }}
                                className="hover:text-primary"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : tamuData.map((item, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {key + 1}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.nama}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.alamat}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.no_telp}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.keperluan}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.keterangan}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item?.aslab?.nama}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {item.timestamp
                                ? formatDate(item.timestamp)
                                : '-'}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                onClick={() => {
                                  setIsModalHapusOpen(true);
                                  setSelectedData(item?.id);
                                }}
                                className="hover:text-primary"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tamu and Mahasiswa Section */}
      {role !== 'Asisten Lab' && role !== 'Dosen' && (
        <>
          <div className="flex flex-col">
            <div className="flex flex-row pl-6 pt-4 pb-6 bg-white dark:border-strokedark dark:bg-boxdark space-y-2 w-full">
              <span className="min-w-[100px] text-black dark:text-white text-lg font-bold">
                Daftar Pertemuan Saya
              </span>
              <div className="flex w-full justify-end space-x-4">
                <button
                  onClick={() => {
                    navigate('/scan');
                  }}
                  className={`bg-white dark:border-white dark:bg-boxdark dark:text-white text-black px-4 py-2 border border-placeholder mr-8 rounded-md`}
                >
                  Daftar Pertemuan
                </button>
              </div>
            </div>
          </div>

          {/* table section */}
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  {role === 'Mahasiswa' ? (
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nama
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Penjurusan
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Asisten Lab
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Jadwal
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  ) : (
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] py-4 px-2 font-medium text-black dark:text-white xl:pl-11">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Nama
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Alamat
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        No Telepon
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Keperluan
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Keterangan
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Asisten Lab
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Jadwal
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {role === 'Mahasiswa'
                    ? mahasiswaData.map((item, key) => (
                        <tr key={key}>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                          >
                            <h5 className="font-medium text-black dark:text-white">
                              {key + 1}
                            </h5>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.user?.nama}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.user?.penjurusan}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.aslab?.nama}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            {item.timestamp ? formatDate(item.timestamp) : '-'}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                onClick={() => {
                                  setIsModalHapusOpen(true);
                                  setSelectedData(item?.id);
                                }}
                                className="hover:text-primary"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : tamuData.map((item, key) => (
                        <tr key={key}>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                          >
                            <h5 className="font-medium text-black dark:text-white">
                              {key + 1}
                            </h5>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.nama}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.alamat}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.no_telp}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.keperluan}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.keterangan}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item?.aslab?.nama}
                            </p>
                          </td>
                          <td
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedData(item?.aslab?.id);
                            }}
                            className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"
                          >
                            <p className="text-black dark:text-white">
                              {item.timestamp
                                ? formatDate(item.timestamp)
                                : '-'}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                onClick={() => {
                                  setIsModalHapusOpen(true);
                                  setSelectedData(item?.id);
                                }}
                                className="hover:text-primary"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                    fill=""
                                  />
                                  <path
                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                    fill=""
                                  />
                                  <path
                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                    fill=""
                                  />
                                  <path
                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Section */}
      <HapusAkunModal
        isOpen={isModalHapusOpen}
        onClose={() => setIsModalHapusOpen(false)}
        onDelete={handleDeleteAbsen}
      />
      <ViewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aslab_id={selectedData}
      />
      {/* Qr Section */}
      {isQRModalOpen && (
        <div className="fixed bg-black inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-4 md:p-8 rounded shadow-lg w-11/12 md:w-1/2 flex flex-col items-center">
            <QRCodeSVG
              value={userId ? userId : ''}
              className="w-64 h-64 md:w-3/5 md:h-3/5" // Responsif: lebih kecil di mobile, lebih besar di desktop
            />
            <button
              onClick={closeQRModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ECommerce;
