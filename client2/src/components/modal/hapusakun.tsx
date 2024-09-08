import React from 'react';

interface HapusAkunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const HapusAkunModal: React.FC<HapusAkunModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Konfirmasi Hapus Data</h2>
        <p className="mb-6">Apakah Anda yakin ingin menghapus data ini?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default HapusAkunModal;
