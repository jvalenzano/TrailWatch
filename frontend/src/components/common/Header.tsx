


interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
}
