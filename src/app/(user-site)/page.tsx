
import DestinationDiscovery from "@/components/user/book/DestinationDiscovery";
import FlightSearch from "@/components/user/book/FlightSearch";

export default function Book() {
  return (
    <div className="bg-red-100">
    <section className="w-full relative h-[90vh] flex flex-wrap justify-center">
      <div className="w-full h-[80vh] bg-cover bg-center flex items-center p-5" style={{backgroundImage: `url(${"https://static0.simpleflyingimages.com/wordpress/wp-content/uploads/2023/08/air-india-1.jpg"})`}}>
      <div className="flex flex-col p-5 gap-5">
        <h1 className="w-250 flex flex-wrap text-9xl text-white font font-bold gap-5">The Art of <p className="text-yellow-500">Elevated</p> Flight.</h1>
        <p className="w-[889] text-4xl text-white font-light">Experience the heritage of the Maharaja reimagined for the
modern world. Precision, privacy, and unparalleled service at
35,000 feet.</p>
      </div>
      </div>

      <div className="w-[90%] h-70 bg-white/20 backdrop-blur-lg border border-gray-300 shadow-lg shadow-black/30 rounded-2xl absolute top-205">
      <FlightSearch/>
      </div>
    </section>
    <section className="">
      <DestinationDiscovery/>
    </section>
    </div>
  );
}
