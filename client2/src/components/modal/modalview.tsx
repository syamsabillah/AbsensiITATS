import axios from 'axios';
import React, { useState, useEffect } from 'react';

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

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  aslab_id: String;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, aslab_id }) => {
  const url = 'http://localhost:5000';
  const [selectedOption, setSelectedOption] = useState<'Mahasiswa' | 'Tamu'>(
    'Mahasiswa',
  );
  const handleOptionChange = (option: string) => {
    setSelectedOption(option as 'Mahasiswa' | 'Tamu');
  };

  // Fetch data
  const [mahasiswaData, setMahasiswaData] = useState([
    {
      id: '',
      user: { nama: '', penjurusan: '', no_induk: '' },
      aslab: { nama: '', id: '' },
      timestamp: '',
    },
  ]);
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

  useEffect(() => {
    axios
      .get(`${url}/absentodayquery?aslab_id=${aslab_id}`)
      .then((response) => {
        const data = response.data;

        // Split data into Mahasiswa and Tamu
        const mahasiswa = data.filter(
          (item: { user_id: null }) => item.user_id !== null,
        );
        const tamu = data.filter(
          (item: { user_id: null }) => item.user_id === null,
        );

        setMahasiswaData(mahasiswa);
        setTamuData(tamu);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [url, aslab_id]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-5xl h-3/4 overflow-y-auto">
          <div className="absolute top-5 right-2 space-x-4">
            <select
              value={selectedOption}
              onChange={(e) => handleOptionChange(e.target.value)}
              className="px-4 py-2 border border-placeholder rounded-md bg-white text-black"
            >
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Tamu">Tamu</option>
            </select>
            <button
              className="text-black border px-4 py-2 rounded-md hover:text-gray-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto mt-10">
            {selectedOption === 'Mahasiswa' && (
              <table className="table-auto w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Penjurusan</th>
                    <th className="px-4 py-2">Asisten lab</th>
                    <th className="px-4 py-2">Jadwal</th>
                  </tr>
                </thead>
                <tbody>
                  {mahasiswaData.map((item, key) => (
                    <tr key={key}>
                      <td className="border px-4 py-2">{key + 1}</td>
                      <td className="border px-4 py-2">{item?.user?.nama}</td>
                      <td className="border px-4 py-2">
                        {item?.user?.penjurusan}
                      </td>
                      <td className="border px-4 py-2">{item?.aslab?.nama}</td>
                      <td className="border px-4 py-2">
                        {item.timestamp ? formatDate(item.timestamp) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedOption === 'Tamu' && (
              <table className="table-auto w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="px-4 py-2">No</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Alamat</th>
                    <th className="px-4 py-2">No Telepon</th>
                    <th className="px-4 py-2">Keperluan</th>
                    <th className="px-4 py-2">Keterangan</th>
                    <th className="px-4 py-2">Asisten Lab</th>
                    <th className="px-4 py-2">Jadwal</th>
                  </tr>
                </thead>
                <tbody>
                  {tamuData.map((item, key) => (
                    <tr key={key}>
                      <td className="border px-4 py-2">{key + 1}</td>
                      <td className="border px-4 py-2">{item?.nama}</td>
                      <td className="border px-4 py-2">{item?.alamat}</td>
                      <td className="border px-4 py-2">{item?.no_telp}</td>
                      <td className="border px-4 py-2">{item?.keperluan}</td>
                      <td className="border px-4 py-2">{item?.keterangan}</td>
                      <td className="border px-4 py-2">{item?.aslab?.nama}</td>
                      <td className="border px-4 py-2">
                        {item.timestamp ? formatDate(item.timestamp) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ViewModal;
