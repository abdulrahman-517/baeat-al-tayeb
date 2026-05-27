'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, LogIn, ShieldAlert, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function getAttempts(): { count: number; lastAttempt: number } {
  if (typeof window === 'undefined') return { count: 0, lastAttempt: 0 }
  try {
    const stored = localStorage.getItem('login_attempts')
    if (stored) return JSON.parse(stored)
  } catch {}
  return { count: 0, lastAttempt: 0 }
}

function saveAttempts(count: number) {
  localStorage.setItem('login_attempts', JSON.stringify({ count, lastAttempt: Date.now() }))
}

function clearAttempts() {
  localStorage.removeItem('login_attempts')
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTimer, setLockoutTimer] = useState(0)

  useEffect(() => {
    checkLockout()
    const interval = setInterval(checkLockout, 1000)
    return () => clearInterval(interval)
  }, [])

  function checkLockout() {
    const { count, lastAttempt } = getAttempts()
    if (count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - lastAttempt
      if (elapsed < LOCKOUT_DURATION) {
        setIsLocked(true)
        setLockoutTimer(Math.ceil((LOCKOUT_DURATION - elapsed) / 1000))
        return
      }
      clearAttempts()
      setIsLocked(false)
      setLockoutTimer(0)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (isLocked) return

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const { count } = getAttempts()
        const newCount = count + 1
        saveAttempts(newCount)

        if (newCount >= MAX_ATTEMPTS) {
          setIsLocked(true)
          setLockoutTimer(LOCKOUT_DURATION / 1000)
          setError('تم حظر تسجيل الدخول مؤقتًا. حاول بعد 15 دقيقة.')
        } else {
          setError(`بريد إلكتروني أو كلمة مرور غير صحيحة. المحاولات المتبقية: ${MAX_ATTEMPTS - newCount}`)
        }
        setLoading(false)
        return
      }

      clearAttempts()
      router.replace('/admin')
    } catch {
      setError('حدث خطأ في الاتصال. حاول مرة أخرى.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-1">
              بائعة<span className="text-amber-800"> الطيب</span>
            </h1>
            <p className="text-stone-400">تسجيل دخول المدير</p>
          </div>

          <AnimatePresence mode="wait">
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700">تم حظر تسجيل الدخول</p>
                    <p className="text-xs text-red-500 mt-1">
                      محاولات فاشلة متكررة. حاول بعد {Math.floor(lockoutTimer / 60)}:{String(lockoutTimer % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && !isLocked && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              disabled={isLocked}
            />
            <div className="relative">
              <Input
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-[42px] text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={isLocked}>
              {isLocked ? <Clock className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isLocked ? 'محظور مؤقتًا' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
