import React, { useState, type FormEvent } from 'react'
import type { FormData } from '@/hooks/store/useAuthStore'

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: ""
  })
  
  const handleSubmit = (e: FormEvent) => {}

  return (
    <div className="w-full items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        
      </div>
    </div>
  );
}

export default SignUpPage