import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export const UserProfile: React.FC = () => {
	const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		fullName: user?.fullName || '',
		email: user?.email || ''
	});

	const handleEdit = () => {
		setIsEditing(true);
		setFormData({
			fullName: user?.fullName || '',
			email: user?.email || ''
		});
	};

	const handleSave = () => {
		// TODO: Implement profile update API call
		console.log('Saving profile:', formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFormData({
			fullName: user?.fullName || '',
			email: user?.email || ''
		});
	};

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
					<p className="text-gray-600">You need to be logged in to view your profile.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					{/* Header */}
					<div className="bg-teal-600 px-6 py-8 text-white">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
								<FaUser size={24} />
							</div>
							<div>
								<h1 className="text-2xl font-bold">My Profile</h1>
								<p className="text-teal-100">Manage your account information</p>
							</div>
						</div>
					</div>

					{/* Profile Content */}
					<div className="p-6">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
							{!isEditing ? (
								<button
									onClick={handleEdit}
									className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
								>
									<FaEdit size={16} />
									<span>Edit</span>
								</button>
							) : (
								<div className="flex space-x-2">
									<button
										onClick={handleSave}
										className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
									>
										<FaSave size={16} />
										<span>Save</span>
									</button>
									<button
										onClick={handleCancel}
										className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										<FaTimes size={16} />
										<span>Cancel</span>
									</button>
								</div>
							)}
						</div>

						<div className="space-y-6">
							{/* Full Name */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Full Name
								</label>
								{isEditing ? (
									<input
										type="text"
										value={formData.fullName}
										onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
								) : (
									<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
										<FaUser className="text-gray-400" />
										<span className="text-gray-900">{user?.fullName || 'Not provided'}</span>
									</div>
								)}
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email Address
								</label>
								{isEditing ? (
									<input
										type="email"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
									/>
								) : (
									<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
										<FaEnvelope className="text-gray-400" />
										<span className="text-gray-900">{user?.email || 'Not provided'}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Additional Sections */}
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
						<div className="space-y-3">
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								Change Password
							</button>
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								Privacy Settings
							</button>
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								Notification Preferences
							</button>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
						<div className="space-y-3">
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								View Order History
							</button>
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								Manage Addresses
							</button>
							<button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
								Payment Methods
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};