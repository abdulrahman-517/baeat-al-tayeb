'use client'

import Link from 'next/link'
import { MessageCircle, Music2, Mail, MapPin, Phone, Camera } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/categories/clothing', label: 'الملابس' },
  { href: '/categories/incense', label: 'البخور' },
  { href: '/categories/perfumes', label: 'العطور' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

const policies = [
  { href: '#', label: 'سياسة الاسترجاع' },
  { href: '#', label: 'سياسة الخصوصية' },
  { href: '#', label: 'الشروط والأحكام' },
]

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">
              بائعة<span className="text-amber-500"> الطيب</span>
            </h3>
            <p className="text-stone-400 leading-relaxed text-sm">
              أناقة تفوح بالفخامة - متجر نسائي فاخر للملابس، البخور، والعطور الشرقية.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://wa.me/967771495633"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-800 hover:bg-stone-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-semibold mb-4">السياسات</h4>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.label}>
                  <Link
                    href={policy.href}
                    className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
                  >
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-stone-400">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                +967 771 495 633
              </li>
              <li className="flex items-center gap-3 text-stone-400">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                info@baeataltayeb.com
              </li>
              <li className="flex items-center gap-3 text-stone-400">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                اليمن
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8 text-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر بائعة الطيب
          </p>
        </div>
      </div>
    </footer>
  )
}
