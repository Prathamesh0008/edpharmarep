import  dbConnect  from "@/lib/db";
import Order from "@/app/models/Order";

export async function GET() {
  await dbConnect();

  const orders = await Order.find()
    .populate("userId", "name phone address")
    .sort({ createdAt: -1 });

  return Response.json(orders);
}