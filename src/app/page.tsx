import DevPin from "@/ui/dev-pin";

export default function Home() {
  return (
    <>
      <DevPin
        id="test"
        name="test"
        description="test"
        todos={["test1", "test2"]}
        x={20}
        y={20}
      />
      <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-black text-white">
        home
      </div>
    </>
  );
}
