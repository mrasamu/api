import * as mongoose from "mongoose";
import Counter from "./counter";

export interface Reservation extends mongoose.Document {
  id: number;
  itemId: number;
  userId: number;
  from: Date;
  to: Date;
  reason?: string;
  approved: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

const reservationSchema = new mongoose.Schema<Reservation>(
  {
    id: { type: Number, unique: true }, // use auto-increment id, instead of _id generated by database
    itemId: { type: Number, required: true },
    userId: { type: Number, required: true }, // reservation's applicant's id
    from: { type: Date, required: true }, // ISO Date
    to: { type: Date, required: true }, // ISO Date
    reason: String,
    approved: { type: Boolean, default: false }, // used for review
    createdAt: { type: Date, default: Date.now },
    createdBy: Number,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: Number
  },
  {
    collection: "reservations"
  }
);

reservationSchema.pre<Reservation>("save", function(next) {
  Counter.findByIdAndUpdate(
    "reservation",
    { $inc: { count: 1 } },
    { rawResult: true, new: true, upsert: true },
    (err, counter) => {
      if (err) {
        return next(err);
      }
      this.id = counter.count;
      next();
    }
  );
});

export default mongoose.model<Reservation>("Reservation", reservationSchema);
