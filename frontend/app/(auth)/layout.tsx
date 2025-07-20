export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex flex-col items-center h-[90vh] justify-center">
      {children}
      </div>
    );
}