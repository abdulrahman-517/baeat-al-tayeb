'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Heart, Menu, X, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { SearchModal } from './SearchModal'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/categories/clothing', label: 'الملابس' },
  { href: '/categories/incense', label: 'البخور' },
  { href: '/categories/perfumes', label: 'العطور' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-stone-600 hover:text-amber-800 transition-colors duration-200 text-sm font-medium tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link href="/" className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-wider">
              بائعة<span className="text-amber-800"> الطيب</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-stone-600" />
              </button>
              <Link
                href="/cart"
                className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-stone-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-800 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-stone-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-stone-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/967771495633"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-colors hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
