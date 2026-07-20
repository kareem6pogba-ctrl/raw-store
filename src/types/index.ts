export interface ColorOption {
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string | null
  fabric: string | null
  colors: ColorOption[]
  sizes: string[]
  image_main: string | null
  image_alt: string | null
  tag: string | null
  is_published: boolean
  stock: number
}

export interface CartItem {
  product: Product
  color: ColorOption
  size: string
  qty: number
}

export interface CheckoutForm {
  name: string
  email: string
  phone: string
  address: string
  city: string
  payment: 'cod' | 'online'
}
