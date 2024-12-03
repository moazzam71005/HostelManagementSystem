"use client";

import Link from 'next/link'
import { Button } from '../../components/ui/button'
import Card from "../../components/ui/card/card";
import CardHeader from "../../components/ui/card/cardheader";
import CardTitle from "../../components/ui/card/cardtitle";
import CardDescription from "../../components/ui/card/carddescription";
import CardContent from "../../components/ui/card/cardcontent";
import { SelectTrigger } from '../../components/ui/selecttrigger';
import { useRouter } from 'next/navigation';


export default function RegisterAccount() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose your account type
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student</CardTitle>
                <CardDescription>Register as a student looking for accommodation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {console.log('Navigate to student registration');
            router.push("/pages/studentRegister")}}>
                  Register as Student
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manager/Caretaker</CardTitle>
                <CardDescription>Register as a hostel manager or caretaker</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {console.log('Navigate to manager registration');
            router.push("/pages/managerRegister")}}>
                  Register as Manager/Caretaker
                </Button>
              </CardContent>
            </Card>

            <div className="text-sm text-center">
              <Link href="/pages/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}