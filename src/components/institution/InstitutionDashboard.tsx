import React, { useState } from 'react';
import { useWallet } from '@mysten/wallet-adapter-react';
import { addProduct, updateProduct } from '../sui/InstitutionActions';

export function InstitutionDashboard() {
  const wallet = useWallet();
  const [form, setForm] = useState({ name: '', description: '', quantity: '', price: '', productId: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    await addProduct(wallet, {
      capabilityId: 'YOUR_INVOICE_CAPABILITY_ID',
      name: form.name,
      description: form.description,
      quantity: form.quantity,
      price: form.price,
      clockId: 'CLOCK_ID',
    });
    alert('Product added!');
  };

  const handleUpdateProduct = async () => {
    await updateProduct(wallet, {
      capabilityId: 'YOUR_INVOICE_CAPABILITY_ID',
      productId: form.productId,
      name: form.name,
      description: form.description,
      quantity: form.quantity,
      price: form.price,
    });
    alert('Product updated!');
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <input name="name" placeholder="Product Name" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="quantity" placeholder="Quantity" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="productId" placeholder="Product ID (for update)" onChange={handleChange} />
      <button onClick={handleAddProduct}>Add Product</button>
      <button onClick={handleUpdateProduct}>Update Product</button>
    </div>
  );
}
