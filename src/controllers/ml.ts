import { Request, Response } from 'express';
import axios from 'axios';
import config from '../config';

const API_BASE = 'http://127.0.0.1:8001';

export async function trainModel(req: Request, res: Response) {
  const response = await axios.post(`${API_BASE}/train`);
  res.status(response.status).json(response.data);
}

export async function predictRisk(req: Request, res: Response) {
  const response = await axios.post(`${API_BASE}/predict`, req.body);
  res.status(response.status).json(response.data);
}

export async function retrainModel(req: Request, res: Response) {
  const response = await axios.post(`${API_BASE}/retrain`);
  res.status(response.status).json(response.data);
}

export async function metrics(req: Request, res: Response) {
  const response = await axios.get(`${API_BASE}/metrics`);
  res.status(response.status).json(response.data);
}

export async function health(req: Request, res: Response) {
  const response = await axios.get(`${API_BASE}/health`);
  res.status(response.status).json(response.data);
}
