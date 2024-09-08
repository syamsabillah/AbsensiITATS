import { PrismaClient } from "@prisma/client";
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import argon2 from "argon2";

const prisma = new PrismaClient();

export const Login = async (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });

  const user = await prisma.tb_user.findFirst({
    where: {
      username: req.body.username,
    },
  });

  if (!user) {
    return res.status(400).json({
      msg: "User tidak sesuai",
      error: "popup_wrong_password", // Tambahkan jenis error untuk ditangani di frontend
    });
  }

  const token = jwt.sign({ username }, process.env.PRIVATE_KEY, {
    expiresIn: "20s",
  });
  const match = await argon2.verify(user.password, password);
  if (!match) {
    return res.status(400).json({
      msg: "Password tidak sesuai",
      error: "popup_wrong_password", // Tambahkan jenis error untuk ditangani di frontend
    });
  } else {
    await prisma.tb_user.update({
      where: { username: username },
      data: { token: token },
    });
    return res.json({
      userId: user.id,
      token: token,
      role: user.role,
      nama: user.nama,
    });
  }
};

export const authService = async (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.PRIVATE_KEY, (err) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token Expired" });
      }
      return res.status(500).json({ message: "Failed" });
    }
    return res.json({ token });
  });
};

export const getUsers = async (req, res) => {
  try {
    const { username, nama, role } = req.query;
    const response = await prisma.tb_user.findMany({
      where: {
        username: username,
        nama: nama,
        role: role,
      },
      orderBy: {
        id: `asc`,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { nama, username, password, no_telp, penjurusan, no_induk, role } =
    req.body;

  const token = jwt.sign({ username }, process.env.PRIVATE_KEY, {
    expiresIn: "20s",
  });

  const hashPassword = await argon2.hash(password);

  try {
    if (role === "Mahasiswa") {
      await prisma.tb_user.create({
        data: {
          nama: nama,
          username: username,
          password: hashPassword,
          no_induk: Number(no_induk),
          penjurusan: penjurusan,
          role: role,
          token: token,
        },
      });
    } else if (role === "Dosen") {
      await prisma.tb_user.create({
        data: {
          nama: nama,
          username: username,
          password: hashPassword,
          no_induk: Number(no_induk),
          role: role,
          token: token,
        },
      });
    } else {
      await prisma.tb_user.create({
        data: {
          nama: nama,
          username: username,
          password: hashPassword,
          no_induk: Number(no_induk),
          no_telp: no_telp,
          penjurusan: penjurusan,
          role: role,
          token: token,
        },
      });
    }

    return res.status(201).json({
      token: token,
      role: role,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { nama, username, password, no_telp, penjurusan, no_induk, role } =
    req.body;
  try {
    if (password) {
      const hashPassword = await argon2.hash(password);
      if (role === "Mahasiswa") {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            password: hashPassword,
            no_induk: Number(no_induk),
            penjurusan: penjurusan,
            role: role,
          },
        });
      } else if (role === "Dosen") {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            password: hashPassword,
            no_induk: Number(no_induk),
            role: role,
          },
        });
      } else {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            password: hashPassword,
            no_induk: Number(no_induk),
            no_telp: no_telp,
            penjurusan: penjurusan,
            role: role,
          },
        });
      }

      res.status(201).json({ message: "User updated successfully" });
    } else {
      if (role === "Mahasiswa") {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            no_induk: Number(no_induk),
            penjurusan: penjurusan,
            role: role,
          },
        });
      } else if (role === "Dosen") {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            no_induk: Number(no_induk),
            role: role,
          },
        });
      } else {
        await prisma.tb_user.update({
          where: {
            id: Number(req.params.id),
          },
          data: {
            nama: nama,
            username: username,
            no_induk: Number(no_induk),
            no_telp: no_telp,
            penjurusan: penjurusan,
            role: role,
          },
        });
      }

      res.status(201).json({ message: "User updated successfully" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await prisma.tb_user.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await prisma.tb_user.delete({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.tb_user.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        no_induk: true,
        no_telp: true,
        penjurusan: true,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
