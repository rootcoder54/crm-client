import CardItem from "./CardItem";

const Hero = () => {
  return (
    <div
      
      className="flex flex-col py-6 px-8 gap-y-9 container"
    >
      <h2 className="text-3xl text-zinc-700 font-bold">
        Notre bibliothèque de support pour vous aider à mieux utiliser nos
        solutions
      </h2>
      <CardItem />
    </div>
  );
};

export default Hero;
