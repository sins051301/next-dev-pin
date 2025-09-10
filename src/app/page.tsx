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

      {process.env.NEXT_PUBLIC_DEV_PIN_ENV === "development" && (
        <DevPin
          id="5b4e059a-2c10-48a9-95fa-104af28cdf5c"
          name="sf"
          description="fsf"
          todos={["sfsf"]}
          x={607}
          y={238}
        />
      )}
    </>
  );
}
