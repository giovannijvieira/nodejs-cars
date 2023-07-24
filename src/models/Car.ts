import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Document {
  brand: string;
  model: string;
  year: number;
}

const carSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
});

export default mongoose.model<ICar>('Car', carSchema);
