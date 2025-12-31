import mongoose from "mongoose";

/* ---------------- ORDER ITEM ---------------- */
const OrderItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 50 },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

/* ---------------- ADDRESS ---------------- */
const AddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

/* ---------------- ORDER ---------------- */
const OrderSchema = new mongoose.Schema(
  {

    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    /* ===== OLD FIELDS (KEPT AS-IS) ===== */
    patient: { type: String },
    phone: { type: String },
    product: { type: String },
    amount: { type: Number },

    


    /* ===== NEW STRUCTURED ORDER ===== */
    orderId: { type: String, required: true, unique: true },

    userId: {
  type: String,
  required: true,
  index: true,
},


    items: {
      type: [OrderItemSchema],
      default: [],
    },

    userEmail: {
  type: String,
  required: true,
  index: true,
},


    totals: {
      totalDistinct: { type: Number, default: 0 },
      totalQty: { type: Number, default: 0 },
      totalPrice: { type: Number, default: 0 },
    },

    address: {
      type: AddressSchema,
      required: true,
    },

    paymentMethod: {
  type: String,
  enum: ["cod", "upi", "card", "wallet"],
  default: "cod",
},

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Cancelled"],
      default: "Pending",
    },
    
    
  },
  { timestamps: true }
);  

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
