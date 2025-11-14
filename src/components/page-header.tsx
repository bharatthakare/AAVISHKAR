type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground to-primary">
        {title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
