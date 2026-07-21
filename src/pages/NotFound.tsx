import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export function NotFound() {
  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-8 py-24 text-center">
      <div className="soft-panel p-14">
        <div className="text-mega text-espresso text-[100px] mb-4">404</div>
        <h1 className="font-display text-2xl text-espresso mb-4 font-extrabold">This piece isn't here.</h1>
        <p className="font-body text-warmgray mb-8">
          The page you're looking for has been moved, sold out, or never existed.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
