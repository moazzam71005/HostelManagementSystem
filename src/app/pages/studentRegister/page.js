'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from '../../components/ui/label';
import { UserCircle } from 'lucide-react';

export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    registrationNo: '',
    name: '',
    fathername: '',
    email: '',
    nustemail: '',
    password: '',
    contactNo: '',
    school: '',
    batch: '',
    discipline: '',
    hostel: '',
    roomNo: '',
    gender: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
  
    try {
      console.log('1');
      const response = await fetch('http://localhost:5000/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Let the server know the data format
        },
        body: JSON.stringify(formData), // Send the form data
      });
      
      console.log('2');
      const result = await response.json();
      
      if (response.ok) {
        console.log('3');
        alert(result.message); // Show success message
      } else {
        console.log('4');
        console.error(result.error); // Log the error
        alert('Error: ' + result.error); // Show error message
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: ' + error.message);
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-green-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white/70 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
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
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
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
              <div className="uppercase tracking-wide  text-indigo-500 text-xl font-bold"><span className='shine-text-2'>Student Registration</span></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="registrationNo" >Registration No.</Label>
                <Input id="registrationNo" name="registrationNo" className="rounded-xl"  type="text" required value={formData.registrationNo} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" className="rounded-xl" type="text" required value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="fathername">Father&apos;s Name</Label>
                <Input id="fathername" name="fathername" className="rounded-xl" type="text" required value={formData.fathername} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" className="rounded-xl" type="email" required value={formData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="nustemail">NUST Email</Label>
                <Input id="nustemail" name="nustemail" className="rounded-xl" type="email" required value={formData.nustemail} onChange={handleInputChange} />
              </div>
              <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative rounded-xl">
                <Input
                  id="password"
                  name="password"
                  type={formData.showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-gray-600"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                >
                  {formData.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative rounded-xl">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={formData.showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-gray-600"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      showConfirmPassword: !prev.showConfirmPassword,
                    }))
                  }
                >
                  {formData.showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>


              <div>
                <Label htmlFor="contactNo">Contact No.</Label>
                <Input id="contactNo" name="contactNo" className="rounded-xl" type="tel" required value={formData.contactNo} onChange={handleInputChange} />
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
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <Label htmlFor="school">School</Label>
                <select
                  id="school"
                  name="school"
                  required
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>Select School</option>
                  <option value="SEECS">SEECS</option>
                  <option value="NICE">NICE</option>
                  <option value="SMME">SMME</option>
                  <option value="SCME">SCME</option>
                  <option value="IGIS">IGIS</option>
                  <option value="ASAB">ASAB</option>
                  <option value="SNS">SNS</option>
                  <option value="S3H">S3H</option>
                  <option value="SADA">SADA</option>
                  <option value="NBS">NBS</option>
                  <option value="SINES">SINES</option>
                </select>
              </div>
              <div>
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" name="batch" type="text" required value={formData.batch} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="discipline">Discipline</Label>
                <Input id="discipline" name="discipline" type="text" required value={formData.discipline} onChange={handleInputChange} />
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
              <div>
                <Label htmlFor="roomNo">Room No.</Label>
                <Input id="roomNo" name="roomNo" className='rounded-xl' type="text" required value={formData.roomNo} onChange={handleInputChange} />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-indigo-800 text-white font-medium rounded-md py-2 transition-all duration-200 ease-in-out transform hover:scale-105">Register</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
