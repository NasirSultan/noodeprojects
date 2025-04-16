const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  const { name, price } = req.body;
  const product = new Product({ name, price, user: req.user._id });
  await product.save();
  res.status(201).json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
  if (!product) return res.status(404).send('Product not found');

  await product.deleteOne();
  res.send('Product deleted');
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ user: req.user._id });
  const totalAmount = products.reduce((sum, item) => sum + item.price, 0);
  res.json({ products, totalAmount });
};

exports.getAllProducts = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$user",
          username: { $first: "$userInfo.username" },
          email: { $first: "$userInfo.email" },
          totalAmount: { $sum: "$price" },
          products: {
            $push: {
              name: "$name",
              price: "$price",
              _id: "$_id"
            }
          }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
