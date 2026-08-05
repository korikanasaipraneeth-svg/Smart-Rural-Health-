import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
    Package, Plus, Search, Filter, AlertTriangle, 
    Edit, Trash2, X, PlusCircle, MinusCircle, AlertCircle, Bot
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import toast from 'react-hot-toast';

export default function InventoryManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isUpdateQtyModalOpen, setIsUpdateQtyModalOpen] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getInventory();
            setItems(data || []);
            
            // Also fetch AI insights
            try {
                const predictData = await inventoryService.runPredictions();
                setAiInsights(predictData);
            } catch (err) {
                console.error('Failed to fetch AI insights', err);
            }
        } catch (error) {
            console.error('Failed to fetch inventory', error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this item?')) {
            try {
                await inventoryService.deleteItem(id);
                toast.success('Item deleted successfully');
                fetchInventory();
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete item');
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockItems = items.filter(i => i.quantity <= i.threshold).length;

    return (
        <div className="space-y-6">
            {/* AI Insights Banner */}
            {aiInsights && aiInsights.criticalItems?.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-900">AI Supply Chain Insights</h3>
                            <p className="text-indigo-700 text-sm">
                                Based on consumption rates, {aiInsights.criticalItems.length} items are predicted to deplete in the next 7 days.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pharmacy & Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage medicines, vaccines, and equipment</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Items</p>
                        <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                        <h3 className="text-2xl font-bold text-gray-900">{lowStockItems}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search inventory..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Vaccine">Vaccine</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Oxygen">Oxygen</option>
                        <option value="Supplies">Supplies</option>
                    </select>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Level</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">Loading inventory...</td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">No items found</td>
                                </tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{item.name}</span>
                                            {item.supplier && <span className="text-xs text-gray-500">Supplier: {item.supplier}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${item.quantity <= item.threshold ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {item.quantity} {item.unit}
                                                </span>
                                                {item.quantity <= item.threshold && (
                                                    <span className="text-[10px] flex items-center gap-1 text-red-500 font-medium">
                                                        <AlertCircle size={12} /> Low Stock
                                                    </span>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => { setSelectedItem(item); setIsUpdateQtyModalOpen(true); }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                                                title="Update Quantity"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedItem(item); setIsEditModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <InventoryModal 
                        onClose={() => setIsAddModalOpen(false)} 
                        onSuccess={() => { setIsAddModalOpen(false); fetchInventory(); }}
                    />
                )}
                {isEditModalOpen && selectedItem && (
                    <InventoryModal
                        item={selectedItem}
                        onClose={() => { setIsEditModalOpen(false); setSelectedItem(null); }}
                        onSuccess={() => { setIsEditModalOpen(false); setSelectedItem(null); fetchInventory(); }}
                    />
                )}
                {isUpdateQtyModalOpen && selectedItem && (
                    <UpdateQuantityModal
                        item={selectedItem}
                        onClose={() => { setIsUpdateQtyModalOpen(false); setSelectedItem(null); }}
                        onSuccess={() => { setIsUpdateQtyModalOpen(false); setSelectedItem(null); fetchInventory(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function InventoryModal({ item, onClose, onSuccess }) {
    const isEdit = !!item;
    
    // Formatting date for HTML input type="date"
    let defaultExpiry = '';
    if (item?.expiryDate) {
        defaultExpiry = new Date(item.expiryDate).toISOString().split('T')[0];
    }

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: isEdit ? {
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            threshold: item.threshold,
            expiryDate: defaultExpiry,
            supplier: item.supplier || ''
        } : {
            quantity: 0,
            threshold: 10
        }
    });
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            if (isEdit) {
                await inventoryService.updateItem(item._id, data);
                toast.success('Item updated successfully');
            } else {
                await inventoryService.addItem(data);
                toast.success('Item added successfully');
            }
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save item');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Item' : 'Add New Item'}</h2>
                        <p className="text-sm text-gray-500">Fill in the inventory details</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    <form id="inventory-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                                <input {...register('name', { required: true })} placeholder="e.g. Paracetamol" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select {...register('category', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <option value="Medicine">Medicine</option>
                                    <option value="Vaccine">Vaccine</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Oxygen">Oxygen</option>
                                    <option value="Supplies">Supplies</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Quantity</label>
                                <input type="number" {...register('quantity', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Consumption Rate</label>
                                <input type="number" step="0.1" {...register('dailyConsumptionRate')} placeholder="e.g. 5" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unit (e.g. tablets, vials)</label>
                                <input {...register('unit', { required: true })} placeholder="e.g. tablets" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                                <input type="number" {...register('threshold', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                <p className="text-xs text-gray-500 mt-1">Get an alert when stock drops below this</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
                                <input type="date" {...register('expiryDate')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name (Optional)</label>
                                <input {...register('supplier')} placeholder="e.g. Gov Health Supplies" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-3xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="inventory-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70">
                        {submitting ? 'Saving...' : 'Save Item'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function UpdateQuantityModal({ item, onClose, onSuccess }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [submitting, setSubmitting] = useState(false);

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            await inventoryService.updateItem(item._id, { quantity });
            toast.success('Quantity updated');
            onSuccess();
        } catch (err) {
            toast.error('Failed to update quantity');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden flex flex-col"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Update Stock</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <div className="p-6 text-center">
                    <p className="text-gray-900 font-semibold mb-1">{item.name}</p>
                    <p className="text-sm text-gray-500 mb-6">Current Stock: {item.quantity} {item.unit}</p>

                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <MinusCircle size={32} />
                        </button>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                            className="w-24 text-center text-2xl font-bold border-b-2 border-gray-200 focus:border-blue-500 outline-none bg-transparent"
                        />
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors">
                            <PlusCircle size={32} />
                        </button>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2 rounded-b-3xl">
                    <button 
                        onClick={handleUpdate} 
                        disabled={submitting || quantity === item.quantity} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                    >
                        {submitting ? 'Updating...' : 'Confirm Update'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
