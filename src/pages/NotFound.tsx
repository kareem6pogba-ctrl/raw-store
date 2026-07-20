import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="max-w-[700px] mx-auto px-8 py-32 text-center">
      <div className="font-display text-[90px] text-espresso leading-none mb-4">404</div>
      <h1 className="font-display text-[28px] text-espresso mb-4 font-normal">This piece isn't here.</h1>
      <p className="font-body text-warmgray mb-8">
        The page you're looking for has been moved, sold out, or never existed.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
