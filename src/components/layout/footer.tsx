
import Link from 'next/link';


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20,80 Q 50,20 80,80" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" />
                  <path d="M 30,60 Q 50,40 70,60" stroke="hsl(var(--accent))" strokeWidth="10" fill="none" strokeLinecap="round" />
                  <circle cx="50" cy="25" r="8" fill="white" />
              </svg>
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
