import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAbsen = async (req, res) => {
  try {
    const { nama, aslab_id, user_id, alamat, no_telp, keperluan, keterangan } =
      req.body;
    const response = await prisma.tb_absensi.create({
      data: {
        nama: nama,
        user_id: Number(user_id),
        alamat: alamat,
        no_telp: no_telp,
        keperluan: keperluan,
        keterangan: keterangan,
        aslab_id: Number(aslab_id),
      },
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsen = async (req, res) => {
  try {
    const { nama, user_id, alamat, no_telp, keperluan, keterangan } = req.body;
    const response = await prisma.tb_absensi.findMany({
      where: {
        nama: nama,
        user_id: user_id,
        alamat: alamat,
        no_telp: no_telp,
        keperluan: keperluan,
        keterangan: keterangan,
      },
      include: {
        user: {
          select: {
            nama: true,
            role: true,
            penjurusan: true,
            no_induk: true,
            no_telp: true,
          },
        },
        aslab: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsenToday = async (req, res) => {
  try {
    const { nama, user_id, alamat, no_telp, keperluan, keterangan } = req.body;

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await prisma.tb_absensi.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        user: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
        aslab: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsenMahasiswaToday = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await prisma.tb_absensi.findMany({
      where: {
        user: {
          role: "Mahasiswa",
        },
        timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        id: true,
        user: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
            penjurusan: true,
          },
        },
        aslab: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
        timestamp: true,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsenTamuToday = async (req, res) => {
  try {
    const { nama, user_id, alamat, no_telp, keperluan, keterangan } = req.body;

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await prisma.tb_absensi.findMany({
      where: {
        user_id: null,
        timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },

      include: {
        aslab: {
          select: {
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAbsen = async (req, res) => {
  try {
    await prisma.tb_absensi.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getAbsenQuery = async (req, res) => {
  try {
    const { nama, user_id, alamat, no_telp, keperluan, keterangan } = req.query;
    const response = await prisma.tb_absensi.findMany({
      where: {
        nama: nama,
        user_id: Number(user_id),
        alamat: alamat,
        no_telp: no_telp,
        keperluan: keperluan,
        keterangan: keterangan,
      },
      include: {
        user: {
          select: {
            nama: true,
            role: true,
            penjurusan: true,
            no_induk: true,
            no_telp: true,
          },
        },
        aslab: {
          select: {
            id: true,
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAbsenTodayQuery = async (req, res) => {
  try {
    const { nama, user_id, aslab_id } = req.query;

    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const response = await prisma.tb_absensi.findMany({
      where: {
        nama: nama,
        aslab_id: aslab_id ? Number(aslab_id) : undefined, // Convert to number if present
        user_id: user_id ? Number(user_id) : undefined,

        timestamp: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        user: {
          select: {
            nama: true,
            role: true,
            penjurusan: true,
            no_induk: true,
            no_telp: true,
          },
        },
        aslab: {
          select: {
            id: true,
            nama: true,
            role: true,
            no_induk: true,
            no_telp: true,
          },
        },
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
