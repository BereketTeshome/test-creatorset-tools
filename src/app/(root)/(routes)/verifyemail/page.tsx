import VerifyEmail from "@/components/verify-email";

const page = ({ searchParams }: { searchParams: { token: string } }) => {
  return (
    <div className="bg-black h-screen flex items-center justify-center">
      <VerifyEmail searchParams={searchParams} />
    </div>
  );
};

export default page;
