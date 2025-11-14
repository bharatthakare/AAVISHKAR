
import Link from 'next/link';

const Logo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary-foreground"
  >
    <path
      d="M29.5,13.5A3.5,3.5,0,0,0,33,10H14a3.5,3.5,0,0,0,0,7H31.5A3.5,3.5,0,0,1,29.5,13.5Z"
      fill="currentColor"
    />
    <path
      d="M33,17H15a1,1,0,0,0-1,1V34a1,1,0,0,0,1,1H33a1,1,0,0,0,1-1V18A1,1,0,0,0,33,17Z"
      fill="currentColor"
    />
    <path
      d="M26,35V30a2,2,0,0,0-2-2H20a2,2,0,0,0-2,2v5"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36,25c0,4.42-3.58,8-8,8s-8-3.58-8-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Logo />
              <span className="font-headline">KisanAI</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Empowering Farmers with AI
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Tools</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/ai-tools" className="text-primary-foreground/80 hover:text-primary-foreground">AI Tools</Link></li>
              <li><Link href="/farm-planner" className="text-primary-foreground/80 hover:text-primary-foreground">Farm Planner</Link></li>
              <li><Link href="/market-prices" className="text-primary-foreground/80 hover:text-primary-foreground">Market Prices</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/crop-advisory" className="text-primary-foreground/80 hover:text-primary-foreground">Crop Advisory</Link></li>
              <li><Link href="/community" className="text-primary-foreground/80 hover:text-primary-foreground">Community</Link></li>
              <li><Link href="/pests-diseases" className="text-primary-foreground/80 hover:text-primary-foreground">Pests & Diseases</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">About Us</Link></li>
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Contact</Link></li>
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} KisanAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
