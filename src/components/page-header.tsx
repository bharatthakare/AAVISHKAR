type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-gray-800">
        {title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
