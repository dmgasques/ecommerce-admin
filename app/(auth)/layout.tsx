type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex justify-center items-center h-full bg-slate-900'>
      {children}
    </div>
  );
}
