import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategoriesSkeleton(props: { cards: number }) {
  const array: number[] = [];
  for (let i: number = 0; i < props.cards; i++) array.push(0);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-5 py-10 max-w-7xl">
          {array.map((_, idx) => {        
            return (
              <>
                <div key={idx} className="flex flex-col gap-4">
                  <Skeleton width={200} height={200}></Skeleton>
                  <Skeleton width={200} height={50}></Skeleton>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
