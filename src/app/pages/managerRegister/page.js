'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from '../../components/ui/label';
import { UserCircle } from 'lucide-react';

export default function ManagerRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    gender: '',
    email: '',
    staffnustemail: '',
    contactNo: '',
    designation: '',
    hostel: '',
    picture: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, picture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex flex-col items-center">
          <div className="p-8 w-full">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4 cursor-pointer" onClick={triggerFileInput}>
                {previewUrl ? (
                  <Image src={previewUrl} alt="Profile" layout="fill" objectFit="cover" className="rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Manager Registration</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" type="text" required value={formData.employeeId} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="staffnustemail">NUST Email</Label>
                <Input id="staffnustemail2" name="staffnustemail" type="email" required value={formData.staffnustemail} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="contactNo">Contact No.</Label>
                <Input id="contactNo" name="contactNo" type="tel" required value={formData.contactNo} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <select
                  id="designation"
                  name="designation"
                  required
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Designation</option>
                  <option value="Manager">Manager</option>
                  <option value="Caretaker">Caretaker</option>
                </select>
              </div>
              <div>
                <Label htmlFor="hostel">Hostel</Label>
                <select
                  id="hostel"
                  name="hostel"
                  required
                  value={formData.hostel}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select Hostel</option>
                  <option value="Attar">Attar</option>
                  <option value="Liaquat">Liaquat</option>
                  <option value="Ghazali">Ghazali</option>
                  <option value="Beruni">Beruni</option>
                  <option value="Rahmat">Rahmat</option>
                  <option value="Razi">Razi</option>
                  <option value="Hajveri">Hajveri</option>
                  <option value="Zakria">Zakria</option>
                  <option value="Zainab">Zainab</option>
                  <option value="Ayesha">Ayesha</option>
                  <option value="Khadija">Khadija</option>
                  <option value="Fatima">Fatima</option>
                </select>
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
