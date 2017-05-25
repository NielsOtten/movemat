import mongoose from 'mongoose';
import errorMessages from '../constants/errorMessages';

const Schema = new mongoose.Schema({});

export default mongoose.model('Photo', Schema);