import express from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ error: "User unauthorized" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).tirmLeft();
    }

    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
