import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BrandsSkeleton(props: { cards: number }) {
  const array: number[] = [];
  for (let i: number = 0; i < props.cards; i++) array.push(0);
  return (
    <>
      {array.map((_, idx) => {
        return (
          <div key={idx} className="flex flex-col gap-4">
            <Skeleton width={200} height={200}></Skeleton>
            <Skeleton width={200} height={50}></Skeleton>
          </div>
        );
      })}
    </>
  );
}
