const Product = require('../models/Product');
const Log = require('../models/Log');
const User = require('../models/User');
exports.addProduct = async (req, res) => {
  const { name, price, quantity } = req.body;

  const product = new Product({
    name,
    price,
    quantity,
    totalAmount: price * quantity, // if you want to store this
    user: req.user._id
  });

  await product.save();

  // ✅ Log with full product details (snapshot)
  const log = new Log({
    action: 'add',
    user: req.user._id,
    product: product._id, // keep reference
    productSnapshot: {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      totalAmount: product.totalAmount
    }
  });

  await log.save();

  res.status(201).json(product);
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user._id });
    if (!product) return res.status(404).send('Product not found');

    // Log with correct product ID and snapshot data
    await Log.create({
      action: 'delete',
      product: product._id, // ✅ This should be ObjectId, not string
      user: req.user._id,
      productSnapshot: {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        totalAmount: product.totalAmount
      }
   
    });

    await product.deleteOne();

    res.send('Product deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while deleting product');
  }
};



exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ user: req.user._id });
  const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ products, totalAmount });
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate('user', 'username email');
  res.json(products);
};

exports.getAllUsers = async (req, res) => {
  try {
    // Query users with the role of "user"
    const users = await User.find({ role: 'user' });

    // If no users found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};


exports.getUserProducts = async (req, res) => {
  const user = await User.findById(req.params.userId);
  const products = await Product.find({ user: user._id });
  res.json(products);
};





exports.addProducadmin = async (req, res) => {
  const { name, price, quantity, user } = req.body;

  try {
    // Optional: Ensure only admin can use this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    if (!user) {
      return res.status(400).json({ error: 'Target user ID is required.' });
    }

    const product = new Product({
      name,
      price,
      quantity,
      totalAmount: price * quantity,
      user // 👈 this is the target user ID from body
    });

    await product.save();

    // ✅ Log the action under the target user ID (not the admin)
    const log = new Log({
      action: 'add',
      user: user, // 👈 set to the input user ID
      product: product._id,
      productSnapshot: {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        totalAmount: product.totalAmount
      }
    });

    await log.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error while adding product' });
  }
};




// GET /api/products/getuserproducts/:id

exports.getUserProductsById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Optional: Ensure only admin can use this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const products = await Product.find({ user: userId });

    const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ products, totalAmount });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Server error while fetching user products' });
  }
};


exports.deleteProductadmin = async (req, res) => {
  const { productId, user } = req.body;

  try {
    // ✅ Ensure only admin can use this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    if (!user) {
      return res.status(400).json({ error: 'Target user ID is required.' });
    }

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const product = await Product.findOne({ _id: productId, user });

    if (!product) {
      return res.status(404).json({ error: 'Product not found for the specified user.' });
    }

    // Additional check to ensure the product belongs to the user
    if (product.user.toString() !== user) {
      return res.status(403).json({ error: 'You cannot delete this product.' });
    }

    // Save snapshot before deletion for logging
    const productSnapshot = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      totalAmount: product.totalAmount
    };

    await product.deleteOne(); // or product.remove();

    // ✅ Log the delete action
    const log = new Log({
      action: 'delete',
      user: user,
      product: productId,
      productSnapshot
    });

    await log.save();

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
};

