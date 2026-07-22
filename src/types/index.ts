export interface ColorOption {
  name: string
  hex: string
}

export interface ColorVariant {
  id: string
  color_name: string
  main_image: string | null
  hover_image: string | null
  video_url: string | null
  gallery: string[]
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
  variants?: ColorVariant[]
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
