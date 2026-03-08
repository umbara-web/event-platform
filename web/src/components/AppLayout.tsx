import Navbar from '@/src/components/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900'>
      <Navbar />
      <main className='flex flex-1 flex-col'>{children}</main>
      <footer className='mt-auto border-t border-gray-200 bg-white py-8'>
        <div className='container mx-auto px-4 text-center text-sm text-gray-500'>
          <p>
            © {new Date().getFullYear()} TicketFest Platform MVP. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
