import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScanQRCodePage = () => {
  const url = 'http://localhost:5000';
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const guestForm = JSON.parse(localStorage.getItem('guestForm') || '{}');

  const initializeScanner = useCallback(() => {
    const qrScannerConfig = {
      fps: 10, // Frames per second for scanning
      qrbox: { width: 250, height: 250 }, // QR code scanning area dimensions
    };

    const newScanner = new Html5QrcodeScanner(
      'qr-reader',
      qrScannerConfig,
      false,
    );

    let failCount = 0;

    const onScanSuccess = (decodedText: string) => {
      setScanResult(decodedText); // Show scan result under the camera
      setError(''); // Clear error message
      failCount = 0; // Reset failure count
      newScanner.clear(); // Stop scanning after successful result
    };

    const onScanFailure = (error: any) => {
      console.warn(`Scan attempt failed: ${error}`);

      failCount += 1;

      if (failCount > 5) {
        setError('Failed to scan. Please try again.');
      }
    };

    newScanner.render(onScanSuccess, onScanFailure);

    scannerRef.current = newScanner; // Save the scanner instance

    return () => {
      newScanner
        .clear()
        .catch((error) => console.error('Failed to clear scanner:', error));
      scannerRef.current = null; // Clear the reference
    };
  }, []);

  useEffect(() => {
    // Initialize the scanner when the component mounts
    const clearScanner = initializeScanner();

    return () => {
      // Clear the scanner when the component unmounts
      clearScanner && clearScanner();
    };
  }, [initializeScanner]);

  //fetch data
  const [namaAslab, setNamaAslab] = useState('');
  useEffect(() => {
    try {
      axios
        .get(url + `/user/${scanResult}`)
        .then((response) => {
          setNamaAslab(response.data.nama);
        })
        .catch((error) => {
          console.error('Error fetching data for Mahasiswa:', error);
        });
    } catch (error) {}
  }, [url, scanResult]);

  //end fetch

  const handleReset = () => {
    setScanResult(null);
    // Clear the existing scanner if any
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((error) => console.error('Failed to clear scanner:', error));
    }
    // Reinitialize the scanner to reopen the camera
    initializeScanner();
  };

  const handleCancel = () => {
    // Navigate to the /dashboard route
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    if (!scanResult) return;

    try {
      // Base postData with common properties
      const postData = {
        aslab_id: scanResult,
        ...(role === 'Mahasiswa' && { user_id: userId }),
        ...(role !== 'Mahasiswa' && {
          nama: guestForm.nama || '',
          alamat: guestForm.alamat || '',
          no_telp: guestForm.no_telp || '',
          keperluan: guestForm.kepentingan || '',
          keterangan: guestForm.keterangan || '',
        }),
      };

      const response = await axios.post(`${url}/absen`, postData);

      console.log('Data submitted successfully:', response.data);
      navigate('/dashboard'); // Navigate to /dashboard after successful submission
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Scan QR Code</h1>

      <div
        id="qr-reader"
        className="w-full max-w-md bg-white p-4 rounded shadow-md"
      ></div>

      {/* Display the scan result under the camera */}
      {scanResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded w-full max-w-md">
          <p className="text-black">Scan Result: {namaAslab}</p>
        </div>
      )}

      {/* Display error if any */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded w-full max-w-md">
          <p>{error}</p>
        </div>
      )}

      {/* Buttons: Reset and Submit */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleCancel}
          className="bg-white border text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={!scanResult} // Disable the submit button if there's no scan result
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ScanQRCodePage;
